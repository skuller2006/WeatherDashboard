# AI-Powered Weather Analytics Dashboard

A production-quality, responsive, AI-powered Weather Analytics Dashboard built with modern web technologies. This project is structured as a monorepo containing a React frontend and a Node.js/Express backend (upcoming phases).

## Features

- **Real-time Weather Data**: Current conditions, temperature, humidity, wind, pressure, visibility, and UV index.
- **Forecasting**: Detailed hourly (24h) and daily (7-day) forecasts.
- **Interactive Charts**: Visualizations for temperature, humidity, wind, and precipitation trends using Recharts.
- **Smart Alerts**: Intelligent weather warnings based on threshold conditions.
- **Weather Insights**: Deterministic (and future ML-powered) text summaries of weather patterns.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Dark Mode**: Seamless light/dark theme toggling with OS preference detection.

## Tech Stack

### Frontend (Phase 1)
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React (Icons)
- CSS Variables / Custom Properties

### Backend & Database (Upcoming Phases)
- Node.js & Express
- PostgreSQL
- Prisma ORM
- Zod Validation

## Project Structure

```
weather-dashboard/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (e.g., useWeather)
│   │   ├── pages/          # Application pages (e.g., Dashboard)
│   │   ├── services/       # API interaction layer
│   │   ├── types/          # TypeScript interfaces/types
│   │   ├── utils/          # Helper functions and formatters
│   │   └── ...
├── server/                 # Backend Node.js Application (Phase 2+)
└── README.md
```

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` in the `client` directory and add your OpenWeatherMap API Key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

## Running Locally

To start the frontend development server:
```bash
npm run dev:client
```
The application will be available at `http://localhost:5173`.

## Phase 1 Implementation Details

Phase 1 focuses entirely on the frontend UI using simulated mock data. No real API calls or backend database connections are made in this phase. The application supports searching for mock cities (e.g., "Hyderabad", "London", "New York", "Tokyo", "Dubai", "Sydney") to demonstrate loading states, error handling, and data visualization.

---
*Built incrementally with a focus on clean architecture, strong typing, and professional UI/UX.*
