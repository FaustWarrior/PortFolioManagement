# Portfolio Management API Documentation

## Base URL
`http://localhost:3000`

## Endpoints

### Portfolio Management

#### GET /api/portfolio
Get all portfolio holdings.

**Response:**
```json
[
  {
    "ticker": "AAPL",
    "quantity": 10
  },
  {
    "ticker": "MSFT", 
    "quantity": 5
  }
]
```

#### POST /api/portfolio/buy
Buy stocks and add to portfolio.

**Request Body:**
```json
{
  "ticker": "AAPL",
  "quantity": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bought 5 shares of AAPL",
  "portfolio": [...]
}
```

#### POST /api/portfolio/sell
Sell stocks from portfolio.

**Request Body:**
```json
{
  "ticker": "AAPL",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sold 2 shares of AAPL",
  "portfolio": [...]
}
```

#### POST /api/portfolio/remove
Remove a stock completely from portfolio.

**Request Body:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Removed AAPL from portfolio"
}
```

### Stock Data

#### GET /api/search?q={query}
Search for stock tickers using Finnhub API.

**Parameters:**
- `q` (required): Search query string

**Response:**
```json
{
  "result": [
    {
      "symbol": "AAPL",
      "description": "Apple Inc"
    }
  ]
}
```

#### GET /api/price/{ticker}
Get current stock price using Finnhub API.

**Parameters:**
- `ticker` (required): Stock ticker symbol

**Response:**
```json
{
  "c": 150.25,
  "h": 152.00,
  "l": 149.50,
  "o": 151.00,
  "pc": 149.75,
  "t": 1640995200
}
```

#### GET /api/history/{ticker}
Get historical stock data using Polygon API.

**Parameters:**
- `ticker` (required): Stock ticker symbol

**Response:**
```json
{
  "results": [
    {
      "c": 150.25,
      "h": 152.00,
      "l": 149.50,
      "o": 151.00,
      "t": 1640995200000,
      "v": 1000000
    }
  ]
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Environment Variables Required

```
FINNHUB_KEY=your_finnhub_api_key
POLYGON_TOKEN=your_polygon_api_key
```

## Frontend Features

- **Portfolio Summary**: View total portfolio value, number of stocks, and total shares
- **Stock Search**: Search and add stocks to portfolio using Finnhub API
- **Buy/Sell Operations**: Manage stock quantities with validation
- **Historical Charts**: View stock performance using Chart.js
- **Responsive Design**: Mobile-friendly interface
- **Real-time Pricing**: Current stock prices from Finnhub API