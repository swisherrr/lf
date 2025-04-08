import React, { useState } from 'react';

interface HistoricalRsiData {
  date: string;
  rsi: number;
}

interface HistoricalRsiDisplayProps {
  symbol: string | null;
  data: HistoricalRsiData[] | null;
  isLoading: boolean;
  error: string | null;
  errorDetails?: string | null;
}

const HistoricalRsiDisplay: React.FC<HistoricalRsiDisplayProps> = ({
  symbol,
  data,
  isLoading,
  error,
  errorDetails
}) => {
  const [displayCount, setDisplayCount] = useState(10);

  if (isLoading) {
    return (
      <div className="rsi-display">
        <div className="loading">Loading historical RSI data...</div>
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

  if (!symbol || !data || data.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${parseInt(month)}/${parseInt(day)}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const downloadCsv = () => {
    if (!data || data.length === 0) return;

    // Format dates for filename
    const formatDateForFilename = (dateStr: string) => {
      try {
        const [year, month, day] = dateStr.split('-');
        return `${year}${month}${day}`;
      } catch (e) {
        return dateStr.replace(/-/g, '');
      }
    };

    // Get the first and last dates from the data
    const firstDate = data[data.length - 1].date;
    const lastDate = data[0].date;
    
    // Create filename in the format: SYMBOL_RSI_YYYYMMDD_to_YYYYMMDD.csv
    const filename = `${symbol}_RSI_${formatDateForFilename(firstDate)}_to_${formatDateForFilename(lastDate)}.csv`;

    // Create CSV content
    const csvContent = [
      ['Date', 'RSI'],
      ...data.map(item => [formatDate(item.date), item.rsi.toFixed(2)])
    ].map(row => row.join(',')).join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedData = data.slice(0, displayCount);

  return (
    <div className="rsi-display historical">
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
          {displayedData.map((item, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell" style={{ textAlign: 'left', paddingLeft: '30px' }}>{formatDate(item.date)}</td>
              <td className="table-cell">{item.rsi.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Spacer div to force more space */}
      <div style={{ height: '50px' }}></div>
      
      <div className="rsi-controls">
        <div className="rsi-info">
          Showing {displayedData.length} of {data.length} records
        </div>
        <button className="download-button" onClick={downloadCsv}>
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default HistoricalRsiDisplay; 