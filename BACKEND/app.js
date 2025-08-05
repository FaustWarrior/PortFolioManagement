const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const portfolioController = require('./controllers/portfolioController');
const authController = require('./controllers/authController');
const { initializeDatabase } = require('./config/database');
const app = express();

require('dotenv').config();

// Initialize database
initializeDatabase().catch(console.error);

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Portfolio routes (protected)
app.get('/api/portfolio', portfolioController.list);
app.get('/api/portfolio/summary', portfolioController.summary);
app.post('/api/portfolio/add', portfolioController.add);
app.post('/api/portfolio/remove', portfolioController.remove);

app.post('/api/portfolio/buy', portfolioController.buy);
app.post('/api/portfolio/sell', portfolioController.sell);
app.get('/api/price/:ticker', portfolioController.getCurrentPrice);


// Finnhub lookup
app.get('/api/search', portfolioController.searchFinnhub);

// Polygon historic
app.get('/api/history/:ticker', portfolioController.historic);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
