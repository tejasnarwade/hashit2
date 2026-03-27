// ===== TEST COMPONENT =====
// Simple test to check if components render without errors

import React from 'react';
import AIChatBot from './AIChatBot';
import InvestmentSimulator from './InvestmentSimulator';

function TestComponents() {
  return (
    <div>
      <h1>Testing Components</h1>
      <AIChatBot
        onBack={() => console.log('back')}
        onSignOut={() => console.log('sign out')}
        loading={false}
      />
    </div>
  );
}

export default TestComponents;