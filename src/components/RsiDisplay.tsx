import React from 'react';

interface RsiDisplayProps {
  symbol: string | null;
  timestamp: string | null;
  rsiValue: number | null;
  isLoading: boolean;
  error: string | null;
  errorDetails?: string | null;
}

const RsiDisplay: React.FC<RsiDisplayProps> = ({
  symbol,
  timestamp,
  rsiValue,
  isLoading,
  error,
  errorDetails
}) => {
  if (isLoading) {
    return (
      <div className="rsi-display">
        <div className="loading">Loading RSI data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rsi-display">
        <div className="error-message">
          <div className="error-title">Error</div>
          <div className="error-text">{error}</div>
          {errorDetails && (
            <div className="error-details">
              <div className="error-details-title">Details:</div>
              <div className="error-details-text">{errorDetails}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!symbol || !rsiValue || !timestamp) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      const [date] = dateStr.split(' ');
      const [year, month, day] = date.split('-');
      return `${parseInt(month)}/${parseInt(day)}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="rsi-display">
      <div className="rsi-title">RSI Analysis for {symbol}</div>
      <div className="rsi-value">RSI Value: {rsiValue.toFixed(2)}</div>
      <div className="rsi-timestamp">Last Updated: {formatDate(timestamp)}</div>
    </div>
  );
};

export default RsiDisplay; 