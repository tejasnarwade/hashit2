import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Example: Fetch from a table named 'items'
    const { data, error } = await supabase
      .from('items')
      .select('*');

    if (error) console.error('Error fetching data:', error);
    else setData(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hashit2 App</h1>
        <p>Data from Supabase:</p>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;