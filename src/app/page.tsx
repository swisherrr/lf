'use client'

import { useState } from 'react'
import RsiDisplay from '@/components/RsiDisplay'

export default function Home() {
  const [ticker, setTicker] = useState('')
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [rsiData, setRsiData] = useState<{
    symbol: string
    rsi: number
    timestamp: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setErrorDetails(null)
    setRsiData(null)

    try {
      if (viewMode === 'live') {
        const response = await fetch(`/api/rsi?symbol=${ticker.toUpperCase()}`)
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch RSI data')
          if (data.details) {
            setErrorDetails(String(data.details))
          } else {
            setErrorDetails(null)
          }
          return
        }
        
        setRsiData(data)
      } else {
        // Historical data implementation will be added later
        setError('Historical data not implemented yet')
        setErrorDetails('This feature is coming soon')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      if (err instanceof Error && err.stack) {
        setErrorDetails(err.stack)
      } else {
        setErrorDetails(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Stock Technical Analysis</h1>
        <p>Enter a stock ticker to analyze technical indicators</p>
      </header>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter stock ticker (e.g., AAPL)"
            className="ticker-input"
            required
          />
        </div>

        <div className="options-group">
          <label className="option">
            <input
              type="radio"
              name="viewMode"
              value="live"
              checked={viewMode === 'live'}
              onChange={(e) => setViewMode(e.target.value as 'live' | 'historical')}
              className="radio-input"
            />
            <span className="radio-label">Live</span>
          </label>
          <label className="option">
            <input
              type="radio"
              name="viewMode"
              value="historical"
              checked={viewMode === 'historical'}
              onChange={(e) => setViewMode(e.target.value as 'live' | 'historical')}
              className="radio-input"
            />
            <span className="radio-label">Historical</span>
          </label>
        </div>

        {viewMode === 'historical' && (
          <div className="date-range">
            <div className="input-group">
              <span className="date-label">Start:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
                required
              />
            </div>
            <div className="input-group">
              <span className="date-label">End:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
                required
              />
            </div>
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="button">
            Analyze
          </button>
        </div>
      </form>

      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {errorDetails && (
            <details>
              <summary>Error Details</summary>
              <pre>{errorDetails}</pre>
            </details>
          )}
        </div>
      )}
      {rsiData && (
        <RsiDisplay
          symbol={rsiData.symbol}
          rsiValue={rsiData.rsi}
          timestamp={rsiData.timestamp}
          isLoading={isLoading}
          error={error}
          errorDetails={errorDetails}
        />
      )}

      <div className="footer">
        <p>© 2025 LF Holdings</p>
      </div>
    </main>
  )
}
