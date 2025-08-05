# Trinity Firms - Portfolio Management System

A professional portfolio management platform for modern investors. Track, analyze, and grow your investments with confidence using Trinity Firms' comprehensive suite of financial tools.

## Features

- **Portfolio Management**: Add, buy, sell, and remove stocks from your portfolio
- **Real-time Data**: Live stock prices and search functionality via Finnhub API
- **Historical Analysis**: View stock performance charts using Polygon API
- **Portfolio Analytics**: Track total portfolio value, number of holdings, and shares
- **Responsive Design**: Modern, mobile-friendly user interface
- **REST API**: Complete backend API for portfolio operations

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **Finnhub API** for real-time stock data and search
- **Polygon API** for historical stock data
- **Axios** for HTTP requests
- **dotenv** for environment configuration

### Frontend
- **Vanilla JavaScript** with modern ES6+ features
- **Chart.js** for interactive stock charts
- **CSS3** with responsive design and animations
- **HTML5** with semantic markup

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project-root/BACKEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the BACKEND directory:
   ```
   FINNHUB_KEY=your_finnhub_api_key
   POLYGON_TOKEN=your_polygon_api_key
   ```

4. **Get API Keys**
   - **Finnhub**: Sign up at [finnhub.io](https://finnhub.io) for free API access
   - **Polygon**: Sign up at [polygon.io](https://polygon.io) for free API access

5. **Start the server**
   ```bash
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Project-root/
└── BACKEND/
    ├── controllers/
    │   └── portfolioController.js    # API route handlers
    ├── models/
    │   └── portfolio.js              # Portfolio data model
    ├── public/
    │   ├── index.html               # Main HTML file
    │   ├── styles.css               # CSS styling
    │   └── app.js                   # Frontend JavaScript
    ├── .env                         # Environment variables
    ├── app.js                       # Express server setup
    ├── package.json                 # Dependencies and scripts
    └── API_DOCUMENTATION.md         # API documentation
```

## Usage

### Adding Stocks
1. Use the search bar to find stocks by ticker symbol or company name
2. Select a stock from the search results
3. Specify the quantity and click "Add to Portfolio"

### Managing Portfolio
- **Buy More Shares**: Enter quantity and click "Buy" for existing holdings
- **Sell Shares**: Enter quantity and click "Sell" (validates sufficient shares)
- **View Charts**: Click "Chart" to see historical price performance
- **Remove Stocks**: Click "Remove" to completely remove a stock from portfolio

### Portfolio Analytics
- View real-time portfolio value in the summary section
- Track total number of different stocks held
- Monitor total shares across all holdings

## API Endpoints

The application provides a RESTful API with the following main endpoints:

- `GET /api/portfolio` - Get portfolio holdings
- `POST /api/portfolio/buy` - Buy stocks
- `POST /api/portfolio/sell` - Sell stocks
- `POST /api/portfolio/remove` - Remove stocks
- `GET /api/search?q={query}` - Search stocks
- `GET /api/price/{ticker}` - Get current price
- `GET /api/history/{ticker}` - Get historical data

See [API_DOCUMENTATION.md](BACKEND/API_DOCUMENTATION.md) for detailed API documentation.

## Development

### Available Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

### Code Structure
- **MVC Pattern**: Organized with models, views (frontend), and controllers
- **Error Handling**: Comprehensive error handling and validation
- **Responsive Design**: Mobile-first CSS approach
- **Modern JavaScript**: ES6+ features and async/await patterns

## Future Enhancements

- **Database Integration**: Replace in-memory storage with persistent database
- **User Authentication**: Multi-user support with secure login
- **Advanced Analytics**: Portfolio performance metrics and comparisons
- **Real-time Updates**: WebSocket integration for live price updates
- **Export Features**: PDF reports and CSV data export
- **Watchlists**: Track stocks without purchasing
- **News Integration**: Stock-related news and analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please create an issue in the repository or contact the development team.