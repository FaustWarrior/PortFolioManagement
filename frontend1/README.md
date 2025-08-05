# Trinity Firms - Portfolio Management Frontend

A modern, responsive portfolio management dashboard built with React, Vite, Tailwind CSS, and Material UI.

## Features

- **Modern Dashboard**: Clean, professional interface with real-time data
- **Portfolio Management**: Buy, sell, and track stock investments
- **Real-time Search**: Search and add stocks with live data
- **Interactive Charts**: View historical price data with Recharts
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Material UI Integration**: Professional components and theming
- **Tailwind CSS**: Utility-first styling for rapid development

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material UI** - React component library
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icons
- **Axios** - HTTP client for API requests

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to the backend API running on `http://localhost:3000` with the following endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/portfolio` - Get portfolio holdings
- `GET /api/portfolio/summary` - Get portfolio summary
- `POST /api/portfolio/buy` - Buy stocks
- `POST /api/portfolio/sell` - Sell stocks
- `POST /api/portfolio/remove` - Remove stocks
- `GET /api/search` - Search stocks
- `GET /api/history/:ticker` - Get historical data

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx      # Main dashboard component
│   ├── Login.jsx          # Authentication component
│   ├── Header.jsx         # Navigation header
│   ├── StatsCards.jsx     # Portfolio statistics
│   ├── SearchSection.jsx  # Stock search functionality
│   ├── PortfolioTable.jsx # Holdings table
│   └── ChartModal.jsx     # Price chart modal
├── App.jsx               # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard with all components
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Collapsible navigation and stacked components

## Development

- Hot module replacement for instant updates
- ESLint configuration for code quality
- Tailwind CSS for rapid styling
- Material UI for consistent components