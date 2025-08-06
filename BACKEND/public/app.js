// Portfolio Management Application
class PortfolioApp {
    constructor() {
        this.chart = null;
        this.portfolio = [];
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.loadPortfolio();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.searchTickers());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchTickers();
        });
        
        // Manual refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadPortfolio());
        }
    }

    async loadPortfolio() {
        try {
            const response = await fetch('/api/portfolio');
            this.portfolio = await response.json();
            this.renderPortfolio();
            this.updatePortfolioSummary();
        } catch (error) {
            this.showError('Failed to load portfolio');
        }
    }

    async renderPortfolio() {
        const container = document.getElementById('portfolioList');
        
        if (this.portfolio.length === 0) {
            container.innerHTML = '<p class="loading">Your portfolio is empty. Search and add some stocks to get started!</p>';
            return;
        }

        container.innerHTML = '<div class="loading">Loading portfolio data...</div>';
        
        let portfolioHTML = '';
        
        for (const item of this.portfolio) {
            try {
                
                const pnlClass = item.total_pnl >= 0 ? 'profit' : 'loss';
                const pnlSign = item.total_pnl >= 0 ? '+' : '';
                
                portfolioHTML += `
                    <div class="portfolio-item">
                        <div class="portfolio-header">
                            <div class="ticker-info">
                                <span class="ticker-symbol">${item.ticker}</span>
                                <span class="quantity-badge">${item.quantity} shares</span>
                                <span class="ticker-price">$${item.current_price.toFixed(2)}</span>
                                <span class="avg-price">Avg: $${item.avg_buy_price.toFixed(2)}</span>
                            </div>
                            <div class="pnl-info">
                                <span class="current-value">Value: $${item.current_value.toFixed(2)}</span>
                                <span class="pnl ${pnlClass}">${pnlSign}$${item.total_pnl.toFixed(2)} (${pnlSign}${item.pnl_percentage.toFixed(2)}%)</span>
                            </div>
                        </div>
                        <div class="portfolio-actions">
                            <input type="number" class="quantity-input" id="buyQty_${item.ticker}" min="1" placeholder="Qty">
                            <button class="btn btn-success btn-small" onclick="app.buyStock('${item.ticker}')">Buy</button>
                            <input type="number" class="quantity-input" id="sellQty_${item.ticker}" min="1" placeholder="Qty">
                            <button class="btn btn-danger btn-small" onclick="app.sellStock('${item.ticker}')">Sell</button>
                            <button class="btn btn-info btn-small" onclick="app.showChart('${item.ticker}')">Chart</button>
                            <button class="btn btn-danger btn-small" onclick="app.removeStock('${item.ticker}')">Remove</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                portfolioHTML += `
                    <div class="portfolio-item">
                        <div class="portfolio-header">
                            <div class="ticker-info">
                                <span class="ticker-symbol">${symbol}</span>
                                <span class="quantity-badge">${quantity} shares</span>
                                <span class="ticker-price">Price unavailable</span>
                            </div>
                        </div>
                        <div class="portfolio-actions">
                            <button class="btn btn-danger btn-small" onclick="app.removeStock('${symbol}')">Remove</button>
                        </div>
                    </div>
                `;
            }
        }
        
        container.innerHTML = portfolioHTML;
    }

    async updatePortfolioSummary() {
        try {
            const response = await fetch('/api/portfolio/summary');
            const summary = await response.json();
            
            // Update basic summary
            const totalValueEl = document.getElementById('totalValue');
            const totalStocksEl = document.getElementById('totalStocks');
            const totalSharesEl = document.getElementById('totalShares');
            
            if (totalValueEl) totalValueEl.textContent = `$${summary.currentValue.toFixed(2)}`;
            if (totalStocksEl) totalStocksEl.textContent = summary.totalStocks;
            if (totalSharesEl) totalSharesEl.textContent = summary.totalShares;
            
            // Update P&L information if elements exist
            const pnlElement = document.getElementById('totalPnL');
            const pnlPercentElement = document.getElementById('pnlPercentage');
            
            if (pnlElement) {
                pnlElement.textContent = `$${summary.totalPnL.toFixed(2)}`;
                pnlElement.className = `summary-value ${summary.totalPnL >= 0 ? 'profit' : 'loss'}`;
            }
            
            if (pnlPercentElement) {
                pnlPercentElement.textContent = `${summary.pnlPercentage.toFixed(2)}%`;
                pnlPercentElement.className = `summary-value ${summary.pnlPercentage >= 0 ? 'profit' : 'loss'}`;
            }
        } catch (error) {
            console.error('Failed to fetch portfolio summary:', error);
        }
    }

    async searchTickers() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showError('Please enter a search term');
            return;
        }

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            const results = data.result || [];

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="loading">No results found</p>';
                return;
            }

            let resultsHTML = '';
            results.slice(0, 10).forEach(item => {
                if (item.symbol) {
                    resultsHTML += `
                        <div class="search-item">
                            <div class="search-item-info">
                                <div class="search-symbol">${item.symbol}</div>
                                <div class="search-description">${item.description || 'No description available'}</div>
                            </div>
                            <div class="search-actions">
                                <input type="number" class="quantity-input" id="addQty_${item.symbol}" min="1" value="1">
                                <button class="btn btn-primary btn-small" onclick="app.addToPortfolio('${item.symbol}')">Add to Portfolio</button>
                            </div>
                        </div>
                    `;
                }
            });

            resultsContainer.innerHTML = resultsHTML;
        } catch (error) {
            this.showError('Failed to search tickers');
            resultsContainer.innerHTML = '';
        }
    }

    async addToPortfolio(symbol) {
        const qtyInput = document.getElementById(`addQty_${symbol}`);
        const quantity = parseInt(qtyInput.value) || 1;

        try {
            const response = await fetch('/api/portfolio/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: symbol, quantity })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showSuccess(`Added ${quantity} shares of ${symbol} to portfolio`);
                this.loadPortfolio();
                qtyInput.value = '1';
            } else {
                this.showError(result.error || 'Failed to add to portfolio');
            }
        } catch (error) {
            console.error('Error adding to portfolio:', error);
            this.showError('Failed to add to portfolio');
        }
    }

    async buyStock(symbol) {
        const qtyInput = document.getElementById(`buyQty_${symbol}`);
        const quantity = parseInt(qtyInput.value);

        if (!quantity || quantity <= 0) {
            this.showError('Please enter a valid quantity');
            return;
        }

        try {
            const response = await fetch('/api/portfolio/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: symbol, quantity })
            });

            if (response.ok) {
                this.showSuccess(`Bought ${quantity} shares of ${symbol}`);
                this.loadPortfolio();
                qtyInput.value = '';
            } else {
                this.showError('Failed to buy stock');
            }
        } catch (error) {
            this.showError('Failed to buy stock');
        }
    }

    async sellStock(symbol) {
        const qtyInput = document.getElementById(`sellQty_${symbol}`);
        const quantity = parseInt(qtyInput.value);

        if (!quantity || quantity <= 0) {
            this.showError('Please enter a valid quantity');
            return;
        }

        try {
            const response = await fetch('/api/portfolio/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: symbol, quantity })
            });

            if (response.ok) {
                this.showSuccess(`Sold ${quantity} shares of ${symbol}`);
                this.loadPortfolio();
                qtyInput.value = '';
            } else {
                this.showError('Failed to sell stock');
            }
        } catch (error) {
            this.showError('Failed to sell stock');
        }
    }

    async removeStock(symbol) {
        if (!confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
            return;
        }

        try {
            const response = await fetch('/api/portfolio/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: symbol })
            });

            if (response.ok) {
                this.showSuccess(`Removed ${symbol} from portfolio`);
                this.loadPortfolio();
            } else {
                this.showError('Failed to remove stock');
            }
        } catch (error) {
            this.showError('Failed to remove stock');
        }
    }

    async showChart(symbol) {
        try {
            const response = await fetch(`/api/history/${symbol}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const dates = data.results.map(x => new Date(x.t).toLocaleDateString());
                const closes = data.results.map(x => x.c);
                this.plotChart(dates, closes, symbol);
            } else {
                this.showError('No historical data available for this stock');
            }
        } catch (error) {
            this.showError('Failed to load chart data');
        }
    }

    plotChart(labels, values, symbol) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Closing Price`,
                    data: values,
                    borderColor: '#4a90e2',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${symbol} Price History`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    startAutoRefresh() {
        // Refresh every 2 minutes to avoid API limits
        this.refreshInterval = setInterval(() => {
            this.loadPortfolio();
        }, 120000); // 2 minutes
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
});