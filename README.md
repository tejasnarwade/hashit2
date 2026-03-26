# Hashit2 Full-Stack App

A full-stack web application with React frontend, Node.js backend, and Supabase database.

## Setup

1. Clone the repository
2. Run `npm install` in the root directory
3. Set up Supabase:
   - Create a Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file in the root with:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```
4. Run `npm run install-all` to install dependencies for all parts
5. Run `npm run dev` to start development servers

## Project Structure

- `frontend/` - React application
- `backend/` - Node.js Express server
- `.env` - Environment variables

## Technologies

- Frontend: React, JavaScript
- Backend: Node.js, Express
- Database: Supabase

hashit2/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── components/
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       └── index.js
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
├── .env
├── .gitignore
├── package.json
└── README.md