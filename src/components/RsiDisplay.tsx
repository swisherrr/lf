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
      <div className="rsi-title">{symbol}</div>
      <table className="rsi-data-table">
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '40%' }} />
        </colgroup>
        <thead>
          <tr className="table-header">
            <th className="table-cell" style={{ textAlign: 'left', paddingLeft: '30px' }}>Date</th>
            <th className="table-cell">RSI Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-row">
            <td className="table-cell" style={{ textAlign: 'left', paddingLeft: '30px' }}>{formatDate(timestamp)}</td>
            <td className="table-cell">{rsiValue.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RsiDisplay; 