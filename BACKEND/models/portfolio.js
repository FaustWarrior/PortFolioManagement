const { getPool } = require('../config/database');
const axios = require('axios');

// In-memory fallback storage
let memoryPortfolio = [];

// Get current price from Finnhub
async function getCurrentPrice(ticker) {
  try {
    const FINNHUB_KEY = process.env.FINNHUB_KEY;
    if (!FINNHUB_KEY) {
      console.error('Finnhub API key not configured');
      return null;
    }
    
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data && response.data.c && response.data.c > 0) {
      return response.data.c;
    } else {
      console.error(`Invalid price data for ${ticker}:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error.message);
    return null;
  }
}

async function addItem(ticker, qty = 1, buyPrice = null) {
  if (!ticker || typeof ticker !== 'string') {
    throw new Error('Invalid ticker symbol');
  }
  
  if (!qty || qty <= 0) {
    throw new Error('Quantity must be a positive number');
  }

  const price = buyPrice || await getCurrentPrice(ticker);
  if (!price || price <= 0) {
    throw new Error(`Unable to fetch current price for ${ticker}. Please try again later.`);
  }

  const totalAmount = price * qty;
  const pool = getPool();

  if (pool) {
    // Use database
    try {
      // Check if holding exists
      const [existing] = await pool.execute(
        'SELECT * FROM holdings WHERE ticker = ?',
        [ticker]
      );

      if (existing.length > 0) {
        // Update existing holding
        const current = existing[0];
        const newQuantity = parseInt(current.quantity) + parseInt(qty);
        const newTotalInvested = parseFloat(current.total_invested) + parseFloat(totalAmount);
        const newAvgPrice = newTotalInvested / newQuantity;

        await pool.execute(
          'UPDATE holdings SET quantity = ?, avg_buy_price = ?, total_invested = ? WHERE ticker = ?',
          [newQuantity, newAvgPrice, newTotalInvested, ticker]
        );
      } else {
        // Insert new holding
        await pool.execute(
          'INSERT INTO holdings (ticker, quantity, avg_buy_price, total_invested) VALUES (?, ?, ?, ?)',
          [ticker, qty, price, totalAmount]
        );
      }

      // Record transaction
      await pool.execute(
        'INSERT INTO transactions (ticker, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?)',
        [ticker, 'BUY', qty, price, totalAmount]
      );
    } catch (error) {
      console.error('Database error, falling back to memory:', error);
      addItemMemory(ticker, qty, price, totalAmount);
    }
  } else {
    // Use memory storage
    addItemMemory(ticker, qty, price, totalAmount);
  }
}

function addItemMemory(ticker, qty, price, totalAmount) {
  const existing = memoryPortfolio.find(item => item.ticker === ticker);
  if (existing) {
    const newQuantity = existing.quantity + qty;
    const newTotalInvested = existing.total_invested + totalAmount;
    existing.quantity = newQuantity;
    existing.avg_buy_price = newTotalInvested / newQuantity;
    existing.total_invested = newTotalInvested;
  } else {
    memoryPortfolio.push({
      ticker,
      quantity: qty,
      avg_buy_price: price,
      total_invested: totalAmount
    });
  }
}

async function sellItem(ticker, qty) {
  if (!ticker || typeof ticker !== 'string') {
    return { success: false, error: 'Invalid ticker symbol' };
  }
  
  if (!qty || qty <= 0) {
    return { success: false, error: 'Quantity must be a positive number' };
  }

  const pool = getPool();

  if (pool) {
    // Use database
    try {
      const [existing] = await pool.execute(
        'SELECT * FROM holdings WHERE ticker = ?',
        [ticker]
      );

      if (existing.length === 0) {
        return { success: false, error: 'Stock not found in portfolio' };
      }

      const holding = existing[0];
      const currentQuantity = parseInt(holding.quantity);
      const sellQuantity = parseInt(qty);
      
      if (currentQuantity < sellQuantity) {
        return { success: false, error: `Insufficient shares. You only have ${currentQuantity} shares of ${ticker}` };
      }

      const sellPrice = await getCurrentPrice(ticker) || parseFloat(holding.avg_buy_price);
      const newQuantity = currentQuantity - sellQuantity;

      if (newQuantity <= 0) {
        await pool.execute('DELETE FROM holdings WHERE ticker = ?', [ticker]);
      } else {
        const newTotalInvested = parseFloat(holding.total_invested) * (newQuantity / currentQuantity);
        await pool.execute(
          'UPDATE holdings SET quantity = ?, total_invested = ? WHERE ticker = ?',
          [newQuantity, newTotalInvested, ticker]
        );
      }

      await pool.execute(
        'INSERT INTO transactions (ticker, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?)',
        [ticker, 'SELL', qty, sellPrice, sellPrice * qty]
      );

      return { success: true };
    } catch (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Database error occurred' };
    }
  } else {
    // Use memory storage
    return sellItemMemory(ticker, qty);
  }
}

function sellItemMemory(ticker, qty) {
  const existing = memoryPortfolio.find(item => item.ticker === ticker);
  if (!existing) {
    return { success: false, error: 'Stock not found in portfolio' };
  }
  
  if (existing.quantity < qty) {
    return { success: false, error: `Insufficient shares. You only have ${existing.quantity} shares of ${ticker}` };
  }

  existing.quantity -= qty;
  if (existing.quantity <= 0) {
    memoryPortfolio = memoryPortfolio.filter(item => item.ticker !== ticker);
  } else {
    existing.total_invested = existing.total_invested * (existing.quantity / (existing.quantity + qty));
  }
  
  return { success: true };
}

async function removeItem(ticker) {
  if (!ticker || typeof ticker !== 'string') {
    return false;
  }
  
  const pool = getPool();

  if (pool) {
    try {
      const [result] = await pool.execute('DELETE FROM holdings WHERE ticker = ?', [ticker]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error removing item:', error);
      return removeItemMemory(ticker);
    }
  } else {
    return removeItemMemory(ticker);
  }
}

function removeItemMemory(ticker) {
  const initialLength = memoryPortfolio.length;
  memoryPortfolio = memoryPortfolio.filter(item => item.ticker !== ticker);
  return memoryPortfolio.length < initialLength;
}

async function getPortfolio() {
  const pool = getPool();

  if (pool) {
    try {
      const [holdings] = await pool.execute('SELECT * FROM holdings ORDER BY ticker');
      
      const portfolioWithPnL = await Promise.all(
        holdings.map(async (holding) => {
          const currentPrice = await getCurrentPrice(holding.ticker);
          // If we can't get current price, use average buy price as fallback
          const effectivePrice = currentPrice || parseFloat(holding.avg_buy_price);
          const currentValue = effectivePrice * holding.quantity;
          const totalPnL = currentValue - holding.total_invested;
          const pnlPercentage = holding.total_invested > 0 ? (totalPnL / holding.total_invested) * 100 : 0;

          return {
            ticker: holding.ticker,
            quantity: holding.quantity,
            avg_buy_price: parseFloat(holding.avg_buy_price),
            total_invested: parseFloat(holding.total_invested),
            current_price: effectivePrice,
            current_value: currentValue,
            total_pnl: totalPnL,
            pnl_percentage: pnlPercentage,
            price_unavailable: !currentPrice // Flag to indicate if real-time price is unavailable
          };
        })
      );

      return portfolioWithPnL;
    } catch (error) {
      console.error('Database error, using memory:', error);
      return getPortfolioMemory();
    }
  } else {
    return getPortfolioMemory();
  }
}

async function getPortfolioMemory() {
  const portfolioWithPnL = await Promise.all(
    memoryPortfolio.map(async (holding) => {
      const currentPrice = await getCurrentPrice(holding.ticker);
      // If we can't get current price, use average buy price as fallback
      const effectivePrice = currentPrice || holding.avg_buy_price;
      const currentValue = effectivePrice * holding.quantity;
      const totalPnL = currentValue - holding.total_invested;
      const pnlPercentage = holding.total_invested > 0 ? (totalPnL / holding.total_invested) * 100 : 0;

      return {
        ticker: holding.ticker,
        quantity: holding.quantity,
        avg_buy_price: holding.avg_buy_price,
        total_invested: holding.total_invested,
        current_price: effectivePrice,
        current_value: currentValue,
        total_pnl: totalPnL,
        pnl_percentage: pnlPercentage,
        price_unavailable: !currentPrice // Flag to indicate if real-time price is unavailable
      };
    })
  );

  return portfolioWithPnL;
}

async function getPortfolioSummary() {
  try {
    const portfolio = await getPortfolio();
    
    const summary = portfolio.reduce((acc, holding) => {
      acc.totalInvested += holding.total_invested;
      acc.currentValue += holding.current_value;
      acc.totalPnL += holding.total_pnl;
      acc.totalStocks += 1;
      acc.totalShares += holding.quantity;
      return acc;
    }, {
      totalInvested: 0,
      currentValue: 0,
      totalPnL: 0,
      totalStocks: 0,
      totalShares: 0
    });

    summary.pnlPercentage = summary.totalInvested > 0 ? (summary.totalPnL / summary.totalInvested) * 100 : 0;
    
    return summary;
  } catch (error) {
    console.error('Error calculating portfolio summary:', error);
    return {
      totalInvested: 0,
      currentValue: 0,
      totalPnL: 0,
      pnlPercentage: 0,
      totalStocks: 0,
      totalShares: 0
    };
  }
}

module.exports = { addItem, sellItem, removeItem, getPortfolio, getPortfolioSummary };
