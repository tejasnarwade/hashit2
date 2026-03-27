# Vectra - Financial Life Simulation Game

A multiplayer financial strategy game where players make investment decisions, manage risks, and compete to maximize their net worth over multiple years.

## About Vectra

Vectra is an educational financial simulation game that teaches players about:

- Investment strategies and portfolio management
- Risk assessment and mitigation
- Financial planning and wealth building
- Real-world economic scenarios

Players navigate through years of financial decisions, facing random events, market volatility, and strategic choices that impact their final net worth.

## Features

- **Multiplayer Game Rooms**: Compete with friends in real-time
- **Investment System**: Multiple asset classes (Savings, Mutual Funds, Stocks, Gold, Real Estate, Crypto)
- **Risk Management**: Insurance products to protect against random events
- **Dynamic Events**: Medical emergencies, market crashes, windfalls, and more
- **Progressive Unlocks**: New investment options unlock each year
- **Leaderboard**: Track performance and compare with other players

## Tech Stack

- **Frontend**: React with professional dark theme UI
- **Backend**: Node.js + Express
- **Database**: Supabase for real-time data and authentication
- **Game Engine**: Custom JavaScript financial simulation engine

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/hnikhil-dev/hashit2.git
   cd hashit2
   ```

2. Install dependencies

   ```bash
   npm run install-all
   ```

3. Set up Supabase:
   - Create a Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Create `.env` files in both root and backend directories:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

4. Start development servers
   ```bash
   npm run dev
   ```

## Project Structure

```
vectra/
├── frontend/           # React application
│   ├── public/        # Static assets
│   └── src/           # Source code
│       ├── App.js     # Main application
│       ├── App.css    # Professional dark theme
│       └── index.js   # Entry point
├── backend/           # Node.js server
│   └── server.js      # Express API & game logic
├── package.json       # Root package configuration
└── README.md          # This file
```

## Game Mechanics

- **Year Cycle**: Each round represents one year
- **Income & Expenses**: Salary income with automatic expense deduction
- **Investment Returns**: Risk-based returns on different asset classes
- **Random Events**: Probability-based liabilities and windfalls
- **Insurance**: Reduce impact of negative events
- **Winning**: Highest net worth after N years wins

## Development

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build production bundles
- `npm start` - Start production servers

## Team

Developed for hackathon by Team Vectra

## License

MIT
