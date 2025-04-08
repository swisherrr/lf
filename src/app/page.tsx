'use client'

import { useState } from 'react'
import RsiDisplay from '@/components/RsiDisplay'
import HistoricalRsiDisplay from '@/components/HistoricalRsiDisplay'

export default function Home() {
  const [ticker, setTicker] = useState('')
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [rsiData, setRsiData] = useState<{
    symbol: string
    rsi: number
    timestamp: string
  } | null>(null)
  const [historicalData, setHistoricalData] = useState<{
    symbol: string
    data: Array<{ date: string; rsi: number }>
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setErrorDetails(null)
    setShowResults(true)

    try {
      if (viewMode === 'live') {
        const response = await fetch(`/api/rsi?symbol=${ticker.toUpperCase()}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          setErrorDetails(data.details)
          return
        }
        
        setRsiData(data)
      } else {
        if (!startDate || !endDate) {
          setError('Please enter both start and end dates')
          return
        }
        
        const response = await fetch(`/api/historical-rsi?symbol=${ticker}&startDate=${startDate}&endDate=${endDate}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          setErrorDetails(data.details)
          return
        }
        
        setHistoricalData(data)
      }
    } catch (err) {
      setError('Failed to fetch RSI data')
      setErrorDetails(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Stock Technical Analysis</h1>
        <p>Enter a stock ticker to view the RSI</p>
      </header>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker (e.g., AAPL)"
            className="ticker-input"
            required
          />
        </div>

        <div className="options-group">
          <div className="option">
            <input
              type="radio"
              id="live"
              name="viewMode"
              value="live"
              checked={viewMode === 'live'}
              onChange={() => setViewMode('live')}
              className="radio-input"
            />
            <label htmlFor="live" className="radio-label">Live</label>
          </div>
          <div className="option">
            <input
              type="radio"
              id="historical"
              name="viewMode"
              value="historical"
              checked={viewMode === 'historical'}
              onChange={() => setViewMode('historical')}
              className="radio-input"
            />
            <label htmlFor="historical" className="radio-label">Historical</label>
          </div>
        </div>

        {viewMode === 'historical' && (
          <div className="date-range">
            <div className="input-group">
              <label htmlFor="startDate" className="date-label">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="endDate" className="date-label">End Date:</label>
              <input
                type="date"
                id="endDate"
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

      {showResults && viewMode === 'live' && (
        <RsiDisplay
          symbol={rsiData?.symbol || null}
          rsiValue={rsiData?.rsi || null}
          timestamp={rsiData?.timestamp || null}
          isLoading={isLoading}
          error={error}
          errorDetails={errorDetails}
        />
      )}

      {showResults && viewMode === 'historical' && (
        <HistoricalRsiDisplay
          symbol={historicalData?.symbol || null}
          data={historicalData?.data || null}
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
