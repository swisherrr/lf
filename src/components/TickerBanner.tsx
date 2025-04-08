import React from 'react';

interface TickerBannerProps {
  symbols?: string[];
}

interface StockData {
  price: number;
  change: number;
}

const TickerBanner: React.FC<TickerBannerProps> = ({ 
  symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'] 
}) => {
  // Sample data for demonstration
  const sampleData: Record<string, StockData> = {
    'AAPL': { price: 175.84, change: 1.23 },
    'MSFT': { price: 338.45, change: 0.87 },
    'GOOGL': { price: 142.65, change: -0.45 },
    'AMZN': { price: 178.75, change: 1.56 },
    'META': { price: 334.55, change: 2.34 },
    'TSLA': { price: 238.45, change: -1.78 },
    'NVDA': { price: 437.53, change: 3.21 },
    'JPM': { price: 172.28, change: 0.32 },
    'V': { price: 280.33, change: 0.91 },
    'WMT': { price: 59.48, change: -0.25 }
  };

  return (
    <div className="ticker-banner">
      <div className="ticker-container">
        <div className="ticker-track">
          {symbols.map((symbol) => (
            <div key={symbol} className="ticker-item">
              <span className="ticker-symbol">{symbol}</span>
              <span className="ticker-price">${sampleData[symbol]?.price.toFixed(2) || '0.00'}</span>
              <span className={`ticker-change ${sampleData[symbol]?.change >= 0 ? 'positive' : 'negative'}`}>
                {sampleData[symbol]?.change >= 0 ? '▲' : '▼'} {Math.abs(sampleData[symbol]?.change || 0).toFixed(2)}%
              </span>
            </div>
          ))}
          {/* Duplicate items to create seamless loop */}
          {symbols.map((symbol) => (
            <div key={`${symbol}-dup`} className="ticker-item">
              <span className="ticker-symbol">{symbol}</span>
              <span className="ticker-price">${sampleData[symbol]?.price.toFixed(2) || '0.00'}</span>
              <span className={`ticker-change ${sampleData[symbol]?.change >= 0 ? 'positive' : 'negative'}`}>
                {sampleData[symbol]?.change >= 0 ? '▲' : '▼'} {Math.abs(sampleData[symbol]?.change || 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerBanner; 