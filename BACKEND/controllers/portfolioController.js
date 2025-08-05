const portfolio = require('../models/portfolio');
const axios = require('axios');

// Validation helpers
const validateTicker = (ticker) => {
  return ticker && typeof ticker === 'string' && ticker.trim().length > 0;
};

const validateQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0;
};

// Browse Portfolio
exports.list = async (req, res) => {
  try {
    const portfolioData = await portfolio.getPortfolio();
    res.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

// Get Portfolio Summary
exports.summary = async (req, res) => {
  try {
    const summary = await portfolio.getPortfolioSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
};

// Add Ticker (legacy endpoint)
exports.add = async (req, res) => {
  const { ticker } = req.body;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }

  try {
    await portfolio.addItem(ticker.toUpperCase(), 1);
    res.json({ success: true, message: `Added ${ticker.toUpperCase()} to portfolio` });
  } catch (error) {
    console.error('Error adding ticker:', error);
    res.status(500).json({ error: 'Failed to add ticker to portfolio' });
  }
};

// Remove Ticker
exports.remove = async (req, res) => {
  const { ticker } = req.body;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }

  try {
    const removed = await portfolio.removeItem(ticker.toUpperCase());
    if (removed) {
      res.json({ success: true, message: `Removed ${ticker.toUpperCase()} from portfolio` });
    } else {
      res.status(404).json({ error: 'Ticker not found in portfolio' });
    }
  } catch (error) {
    console.error('Error removing ticker:', error);
    res.status(500).json({ error: 'Failed to remove ticker from portfolio' });
  }
};

// Browse Tickers (Finnhub)
exports.searchFinnhub = async (req, res) => {
  const q = req.query.q;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const FINNHUB_KEY = process.env.FINNHUB_KEY;
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: 'Finnhub API key not configured' });
  }

  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${FINNHUB_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching tickers:', error);
    if (error.response) {
      res.status(error.response.status).json({ error: 'External API error' });
    } else {
      res.status(500).json({ error: 'Failed to search tickers' });
    }
  }
};

// Get Historical Data (Polygon)
exports.historic = async (req, res) => {
  const { ticker } = req.params;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }

  const POLYGON_TOKEN = process.env.POLYGON_TOKEN;
  if (!POLYGON_TOKEN) {
    return res.status(500).json({ error: 'Polygon API key not configured' });
  }

  try {
    // Get data for the last 6 months
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${startDate}/${endDate}?apiKey=${POLYGON_TOKEN}`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    if (error.response) {
      res.status(error.response.status).json({ error: 'External API error' });
    } else {
      res.status(500).json({ error: 'Failed to fetch historical data' });
    }
  }
};

// Buy stocks
exports.buy = async (req, res) => {
  const { ticker, quantity } = req.body;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }
  
  if (!validateQuantity(quantity)) {
    return res.status(400).json({ error: 'Invalid quantity. Must be a positive number' });
  }

  try {
    const qty = parseInt(quantity);
    await portfolio.addItem(ticker.toUpperCase(), qty);
    const updatedPortfolio = await portfolio.getPortfolio();
    res.json({ 
      success: true, 
      message: `Bought ${qty} shares of ${ticker.toUpperCase()}`,
      portfolio: updatedPortfolio
    });
  } catch (error) {
    console.error('Error buying stock:', error);
    res.status(500).json({ error: error.message || 'Failed to buy stock' });
  }
};

// Sell stocks
exports.sell = async (req, res) => {
  const { ticker, quantity } = req.body;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }
  
  if (!validateQuantity(quantity)) {
    return res.status(400).json({ error: 'Invalid quantity. Must be a positive number' });
  }

  try {
    const qty = parseInt(quantity);
    const result = await portfolio.sellItem(ticker.toUpperCase(), qty);
    
    if (result.success) {
      const updatedPortfolio = await portfolio.getPortfolio();
      res.json({ 
        success: true, 
        message: `Sold ${qty} shares of ${ticker.toUpperCase()}`,
        portfolio: updatedPortfolio
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error selling stock:', error);
    res.status(500).json({ error: 'Failed to sell stock' });
  }
};

// Get current stock price
exports.getCurrentPrice = async (req, res) => {
  const { ticker } = req.params;
  
  if (!validateTicker(ticker)) {
    return res.status(400).json({ error: 'Invalid ticker symbol' });
  }

  const FINNHUB_KEY = process.env.FINNHUB_KEY;
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: 'Finnhub API key not configured' });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker.toUpperCase()}&token=${FINNHUB_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching price:', error);
    if (error.response) {
      res.status(error.response.status).json({ error: 'External API error' });
    } else {
      res.status(500).json({ error: 'Unable to fetch price' });
    }
  }
};
