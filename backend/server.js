const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const grokApiKey = process.env.GROK_API_KEY;
const grokModel = process.env.GROK_MODEL || 'grok-3-mini';

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);
const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseKey) : null;
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

app.use(cors());
app.use(express.json());

const FIELD_QUESTIONS = {
  monthlyIncome: 'What is your monthly income (in your local currency)?',
  monthlyExpenses: 'What are your average monthly expenses?',
  savings: 'How much total savings do you currently have?',
  riskAppetite: 'What is your risk comfort: low, medium, or high?',
  age: 'What is your age?',
  debt: 'Do you currently have debt? If yes, roughly how much and at what interest rate?',
  goalTimelineMonths: 'What is your timeline for this goal (in months)?',
};

const DEFAULT_PROFILE = {
  monthlyIncome: null,
  monthlyExpenses: null,
  savings: null,
  riskAppetite: null,
  age: null,
  debt: null,
  goalTimelineMonths: null,
};

function normalizeProfile(profile = {}) {
  return { ...DEFAULT_PROFILE, ...profile };
}

function inferIntent(question = '') {
  const q = question.toLowerCase();
  if (/(invest|sip|mutual fund|stock|portfolio|equity)/.test(q)) return 'investing';
  if (/(save|saving|budget|expense|cut cost)/.test(q)) return 'saving';
  if (/(debt|loan|emi|credit card)/.test(q)) return 'debt';
  if (/(emergency fund|insurance|protect)/.test(q)) return 'protection';
  return 'general_planning';
}

function requiredFieldsForIntent(intent) {
  if (intent === 'investing') return ['monthlyIncome', 'monthlyExpenses', 'savings', 'riskAppetite', 'goalTimelineMonths'];
  if (intent === 'saving') return ['monthlyIncome', 'monthlyExpenses', 'savings'];
  if (intent === 'debt') return ['monthlyIncome', 'monthlyExpenses', 'debt', 'savings'];
  if (intent === 'protection') return ['monthlyIncome', 'monthlyExpenses', 'savings', 'debt'];
  return ['monthlyIncome', 'monthlyExpenses', 'savings'];
}

function getMissingFields(profile, requiredFields) {
  return requiredFields.filter((field) => {
    const value = profile[field];
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  });
}

function parseNumeric(text = '') {
  const digits = String(text).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return digits ? Number(digits[0]) : null;
}

function coerceProfileValue(field, answer) {
  const clean = String(answer || '').trim();
  if (!clean) return null;
  if (field === 'riskAppetite') {
    const lower = clean.toLowerCase();
    if (lower.includes('low')) return 'low';
    if (lower.includes('high')) return 'high';
    if (lower.includes('med')) return 'medium';
    return clean;
  }
  if (['monthlyIncome', 'monthlyExpenses', 'savings', 'age', 'goalTimelineMonths'].includes(field)) {
    return parseNumeric(clean) ?? clean;
  }
  return clean;
}

function isValidProfileValue(field, value) {
  if (value === null || value === undefined) return false;
  if (field === 'riskAppetite') return ['low', 'medium', 'high'].includes(String(value).toLowerCase());
  if (field === 'age') return Number.isFinite(Number(value)) && Number(value) > 0;
  if (field === 'goalTimelineMonths') return Number.isFinite(Number(value)) && Number(value) >= 1;
  if (['monthlyIncome', 'monthlyExpenses', 'savings'].includes(field)) {
    return Number.isFinite(Number(value)) && Number(value) >= 0;
  }
  if (field === 'debt') return String(value).trim().length > 0;
  return true;
}

function buildLearningPath(profile) {
  const path = [];
  const income = Number(profile.monthlyIncome) || 0;
  const expenses = Number(profile.monthlyExpenses) || 0;
  const savings = Number(profile.savings) || 0;

  path.push('Learn Budgeting');
  if (income > 0 && expenses >= income * 0.7) path.push('Cut expenses and create a 50/30/20 style plan');
  if (income > 0 && savings < income * 3) path.push('Build Emergency Fund');
  if (profile.debt && String(profile.debt).toLowerCase() !== 'no') path.push('Pay high-interest debt before aggressive investing');
  path.push('Start Investing');

  return [...new Set(path)].slice(0, 4);
}

function buildSystemInsights(profile, intent) {
  const income = Number(profile.monthlyIncome) || 0;
  const expenses = Number(profile.monthlyExpenses) || 0;
  const savings = Number(profile.savings) || 0;
  const surplus = income - expenses;

  let priority = 'Build consistency';
  let problem = 'No critical issue detected';

  if (income > 0 && surplus <= 0) {
    priority = 'Expense control';
    problem = 'Monthly expenses are equal to or higher than income';
  } else if (income > 0 && savings < income * 3) {
    priority = 'Emergency fund';
    problem = 'Savings buffer appears to be under 3 months of income';
  } else if (intent === 'investing' && !profile.riskAppetite) {
    priority = 'Risk profiling';
    problem = 'Risk appetite is unclear for investment strategy';
  }

  return { priority, problem, surplus };
}

function buildFallbackAnswer(question, intent, profile, insights) {
  const q = String(question || '').toLowerCase();
  const surplus = Number(insights?.surplus) || 0;
  const hasIphoneGoal = /(iphone|phone|mobile)/.test(q);

  if (hasIphoneGoal) {
    const target = 100000;
    const months = Math.max(1, Number(profile.goalTimelineMonths) || 1);
    const monthlyRequired = Math.ceil(target / months);
    return [
      'Here is a practical plan for your purchase goal:',
      `1. You need about ${monthlyRequired} per month for ${months} month(s) to reach 100000.`,
      `2. Your current monthly surplus is about ${surplus}. Keep at least part of this in a dedicated goal account.`,
      '3. Use a simple split: essentials first, emergency fund second, then goal savings.',
      'Learning module recommendation: saving.',
    ].join('\n');
  }

  if (intent === 'saving') {
    return [
      'Here is a practical saving plan based on your profile:',
      `1. Your estimated monthly surplus is ${surplus}. Automate savings right after salary credit.`,
      '2. Start with a clear target and timeline, then track progress every month.',
      '3. Reduce 1-2 high-leak expense categories and redirect that amount to savings.',
      'Learning module recommendation: saving.',
    ].join('\n');
  }

  if (intent === 'debt') {
    return [
      'Here is a practical debt-first plan:',
      '1. List all loans/cards by interest rate.',
      '2. Pay minimum on all and aggressively prepay the highest-interest debt first.',
      `3. Use your monthly surplus (${surplus}) consistently for prepayment.`,
      'Learning module recommendation: credit.',
    ].join('\n');
  }

  return [
    'Here is a practical plan based on your profile:',
    `1. Track your monthly cash flow. You currently have a surplus of approximately ${surplus}.`,
    '2. Build or protect your emergency fund before increasing risk.',
    '3. Start with small, consistent monthly contributions aligned to your risk level.',
    'Learning module recommendation: investing.',
  ].join('\n');
}

function buildAdvisorPrompt({ question, profile, insights, learningPath, recentMessages, qaMemory }) {
  return [
    'You are a beginner-friendly financial advisor for a gamified financial literacy platform.',
    'Tone: friendly, non-judgmental, practical.',
    '',
    'TASK FORMAT:',
    'The user has asked a question. You also have existing knowledge/context.',
    'Use the existing knowledge to answer the user question accurately and personally.',
    '',
    'RESPONSE REQUIREMENTS:',
    '1) Give a simple explanation in plain language.',
    '2) Provide step-by-step actionable advice.',
    '3) Recommend exactly one learning module from: budgeting, saving, investing, credit.',
    '4) Keep response concise and personalized to the profile.',
    '5) If data is uncertain, state assumptions briefly.',
    '',
    `USER QUESTION:\n${question}`,
    '',
    'EXISTING KNOWLEDGE / CONTEXT:',
    `- User profile (JSON): ${JSON.stringify(profile)}`,
    `- System insights (JSON): ${JSON.stringify(insights)}`,
    `- AI-driven learning path: ${learningPath.join(' -> ')}`,
    `- Recent chat memory (up to 10 messages): ${JSON.stringify(recentMessages)}`,
    `- Previous Q&A memory (up to 5 pairs): ${JSON.stringify(qaMemory)}`,
  ].join('\n');
}

function isContextDependentQuestion(question = '') {
  const q = String(question).trim().toLowerCase();
  if (!q) return false;
  const words = q.split(/\s+/).filter(Boolean);
  return words.length <= 6 || /(next|also|that|this|it|then|now|what about|and for me)/.test(q);
}

async function callGrok(messages) {
  if (!grokApiKey) return null;
  const modelCandidates = [grokModel, 'grok-3-mini', 'grok-3'];

  for (let i = 0; i < modelCandidates.length; i += 1) {
    const model = modelCandidates[i];
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${grokApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    }

    const body = await response.text();
    const isModelMissing = response.status === 400 && body.includes('Model not found');
    if (!isModelMissing || i === modelCandidates.length - 1) {
      throw new Error(`Grok API failed: ${response.status} ${body}`);
    }
  }
  return null;
}

// Example route to get data from Supabase
app.get('/api/items', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY.',
    });
  }

  const { data, error } = await supabase
    .from('items')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.json(data);
  }
});

// Example route to add data
app.post('/api/items', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY.',
    });
  }

  const { name } = req.body;
  const { data, error } = await supabase
    .from('items')
    .insert([{ name }]);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.json(data);
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: 'Recipient email and message text are required.' });
  }

  if (!gmailUser || !gmailAppPassword) {
    return res.status(500).json({
      error: 'Gmail SMTP is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to the backend environment.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"Shubham Chaudhari" <${gmailUser}>`,
      to,
      subject: 'Test email from Hashit2',
      text,
    });

    return res.json({ message: `Email sent successfully to ${to}.` });
  } catch (mailError) {
    return res.status(500).json({
      error: mailError.message || 'Unable to send email right now.',
    });
  }
});

app.post('/api/financial-chat', async (req, res) => {
  try {
    const {
      question = '',
      profile = {},
      recentMessages = [],
      qaMemory = [],
      pendingField = null,
      originalQuestion = '',
    } = req.body || {};

    if (!String(question).trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const updatedProfile = normalizeProfile(profile);
    if (pendingField && FIELD_QUESTIONS[pendingField]) {
      const parsedValue = coerceProfileValue(pendingField, question);
      if (!isValidProfileValue(pendingField, parsedValue)) {
        return res.json({
          type: 'follow_up',
          followUpQuestion: `Please provide a valid value. ${FIELD_QUESTIONS[pendingField]}`,
          pendingField,
          originalQuestion: originalQuestion || question,
          profile: updatedProfile,
          requiredFields: [],
          missingFields: [pendingField],
        });
      }
      updatedProfile[pendingField] = parsedValue;
    }

    const memoryPairs = Array.isArray(qaMemory) ? qaMemory.slice(-5) : [];
    const lastQuestionFromMemory = memoryPairs.length > 0 ? memoryPairs[memoryPairs.length - 1]?.question : '';
    const shouldUsePreviousQuestionAsContext =
      !pendingField && isContextDependentQuestion(question) && String(lastQuestionFromMemory || '').trim();

    const effectiveQuestion = shouldUsePreviousQuestionAsContext
      ? `${lastQuestionFromMemory}. Follow-up: ${question}`
      : question;

    const anchorQuestion = pendingField ? (originalQuestion || effectiveQuestion) : effectiveQuestion;
    const intent = inferIntent(anchorQuestion);
    const requiredFields = requiredFieldsForIntent(intent);
    const missingFields = getMissingFields(updatedProfile, requiredFields);

    if (missingFields.length > 0) {
      const nextField = missingFields[0];
      return res.json({
        type: 'follow_up',
        followUpQuestion: FIELD_QUESTIONS[nextField],
        pendingField: nextField,
        originalQuestion: anchorQuestion,
        profile: updatedProfile,
        requiredFields,
        missingFields,
      });
    }

    const insights = buildSystemInsights(updatedProfile, intent);
    const learningPath = buildLearningPath(updatedProfile);
    const clippedHistory = Array.isArray(recentMessages) ? recentMessages.slice(-10) : [];

    // Step 1: prompt generator
    const generatedPrompt = buildAdvisorPrompt({
      question: anchorQuestion,
      profile: updatedProfile,
      insights,
      learningPath,
      recentMessages: clippedHistory,
      qaMemory: memoryPairs,
    });

    // Step 2: final answer from Grok
    let aiAnswer = null;
    let aiWarning = null;
    try {
      aiAnswer = await callGrok([
        {
          role: 'system',
          content:
            'You are an expert financial coaching assistant. Use the user profile and insights to create safe, educational guidance. Avoid legal/tax promises.',
        },
        {
          role: 'user',
          content: generatedPrompt,
        },
      ]);
    } catch (aiError) {
      const message = String(aiError?.message || '');
      const hasCreditOrPermissionIssue =
        message.includes('403') ||
        message.toLowerCase().includes('does not have permission') ||
        message.toLowerCase().includes('credits') ||
        message.toLowerCase().includes('license');

      if (hasCreditOrPermissionIssue) {
        aiWarning =
          'Grok credits/license unavailable. Returned a local personalized fallback response.';
      } else {
        throw aiError;
      }
    }

    const fallbackAnswer = buildFallbackAnswer(anchorQuestion, intent, updatedProfile, insights);

    return res.json({
      type: 'answer',
      answer: aiAnswer || fallbackAnswer,
      profile: updatedProfile,
      promptUsed: generatedPrompt,
      insights,
      learningPath,
      chatMemoryUsed: clippedHistory,
      effectiveQuestion,
      aiWarning,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unable to process financial chat right now.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
