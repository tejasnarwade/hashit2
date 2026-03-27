import React, { useState } from 'react';
import supabase from '../lib/supabase';

function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

export default function CreateRoomForm() {
  const [name, setName] = useState('');
  const [years, setYears] = useState(5);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setRoomCode(null);

    if (!name.trim()) {
      setError('Player name is required.');
      return;
    }

    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
      setError('Supabase keys are missing. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to frontend/.env');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Find or create user. Prefer auth mapping when available, else match case-insensitively by name
      let userId = null;
      try {
        const { data: authData } = await supabase.auth.getUser();
        const authUser = authData?.user;
        const authId = authUser?.id;

        if (authId) {
          // try find by auth_id
          const { data: authUsers, error: authFindErr } = await supabase
            .from('users')
            .select('user_id')
            .eq('auth_id', authId)
            .limit(1);
          if (authFindErr) throw authFindErr;
          if (authUsers && authUsers.length > 0) {
            userId = authUsers[0].user_id ?? authUsers[0].id;
          } else {
            const { data: upserted, error: upsertErr } = await supabase
              .from('users')
              .upsert({ auth_id: authId, name }, { onConflict: 'auth_id' })
              .select()
              .single();
            if (upsertErr) throw upsertErr;
            userId = upserted.user_id ?? upserted.id;
          }
        } else {
          // not authenticated: try case-insensitive name match to avoid duplicates
          const { data: existingUsers, error: findErr } = await supabase
            .from('users')
            .ilike('name', name)
            .limit(1)
            .select('user_id');
          if (findErr) throw findErr;
          if (existingUsers && existingUsers.length > 0) {
            userId = existingUsers[0].user_id ?? existingUsers[0].id;
          } else {
            const { data: insertedUsers, error: insertErr } = await supabase
              .from('users')
              .insert({ name })
              .select()
              .single();
            if (insertErr) throw insertErr;
            userId = insertedUsers.user_id ?? insertedUsers.id;
          }
        }
      } catch (userErr) {
        throw userErr;
      }

      // Step 2: Generate a 4-digit unique room code (try a few times on collision)
      let code = generateRoomCode().toString();
      let attempts = 0;
      while (attempts < 5) {
        const { data: existing, error: checkError } = await supabase
          .from('rooms')
          .select('room_id')
          .eq('room_code', code)
          .limit(1);
        if (checkError) throw checkError;
        if (!existing || existing.length === 0) break;
        code = generateRoomCode().toString();
        attempts += 1;
      }

      // Step 3: Insert into rooms
      const { data: insertedRooms, error: roomError } = await supabase
        .from('rooms')
        .insert({ room_code: code, total_years: Number(years) })
        .select();

      if (roomError) throw roomError;
      const room = Array.isArray(insertedRooms) ? insertedRooms[0] : insertedRooms;
      const roomId = room?.room_id ?? room?.id;

      // Step 4: Insert into room_players
      const { error: rpError } = await supabase
        .from('room_players')
        .insert({ room_id: roomId, user_id: userId });

      if (rpError) throw rpError;

      setRoomCode(code);
      setName('');
      setYears(5);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Create room error:', err);
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    // Render as a compact card so it fits when embedded in the existing app layout
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Room</h2>

        {roomCode ? (
          <div className="mb-4 p-4 border rounded bg-green-50 text-center">
            <p className="text-lg">Room successfully created!</p>
            <p className="mt-2 text-3xl font-bold tracking-widest">{roomCode}</p>
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Player Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
              aria-label="Player name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Years</label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Number of years"
            >
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>After creation, share the room code with players to join.</p>
        </div>
      </div>
    </div>
  );
}
