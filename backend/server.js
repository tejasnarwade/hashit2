const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Example route to get data from Supabase
app.get('/api/items', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});