import { NextResponse } from 'next/server'

// Constants
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  
  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 })
  }

  if (!ALPHA_VANTAGE_API_KEY) {
    return NextResponse.json({ error: 'Alpha Vantage API key is not configured' }, { status: 500 })
  }

  try {
    console.log(`Fetching RSI data for ${symbol} with API key: ${ALPHA_VANTAGE_API_KEY.substring(0, 4)}...`)
    
    const apiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&entitlement=realtime&apikey=${ALPHA_VANTAGE_API_KEY}`
    console.log(`API URL: ${apiUrl.replace(ALPHA_VANTAGE_API_KEY, 'HIDDEN')}`)
    
    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API response not OK: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json({ 
        error: `Failed to fetch RSI data: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('API response:', JSON.stringify(data).substring(0, 200) + '...')

    if (data['Error Message']) {
      console.error('Alpha Vantage API error:', data['Error Message'])
      return NextResponse.json({ error: data['Error Message'] }, { status: 400 })
    }

    if (data['Note']) {
      console.warn('Alpha Vantage API note:', data['Note'])
      return NextResponse.json({ error: 'API rate limit reached. Please try again later.', details: data['Note'] }, { status: 429 })
    }

    // Get the last refreshed date from Meta Data
    const metaData = data['Meta Data']
    if (!metaData) {
      console.error('No Meta Data in response:', data)
      return NextResponse.json({ error: 'No Meta Data available', details: 'The API response did not contain Meta Data' }, { status: 404 })
    }

    const lastRefreshed = metaData['3: Last Refreshed']
    if (!lastRefreshed) {
      console.error('No Last Refreshed date in Meta Data:', metaData)
      return NextResponse.json({ error: 'No Last Refreshed date available', details: 'The API response did not contain a Last Refreshed date' }, { status: 404 })
    }

    const timeSeries = data['Technical Analysis: RSI']
    if (!timeSeries) {
      console.error('No RSI data in response:', data)
      return NextResponse.json({ error: 'No RSI data available', details: 'The API response did not contain RSI data' }, { status: 404 })
    }

    // Get the first entry in the dictionary (most recent)
    const dates = Object.keys(timeSeries)
    if (dates.length === 0) {
      console.error('No dates in time series')
      return NextResponse.json({ error: 'No RSI data available', details: 'The API response contained no dates' }, { status: 404 })
    }
    
    // Get the first date (most recent)
    const latestDate = dates[0]
    const latestRsi = parseFloat(timeSeries[latestDate]['RSI'])
    
    if (isNaN(latestRsi)) {
      console.error('Invalid RSI value:', timeSeries[latestDate])
      return NextResponse.json({ error: 'Invalid RSI data', details: 'The API returned an invalid RSI value' }, { status: 500 })
    }

    return NextResponse.json({
      symbol,
      rsi: latestRsi,
      timestamp: lastRefreshed // Use the Last Refreshed date from Meta Data
    })
  } catch (error) {
    console.error('Error fetching RSI data:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch RSI data', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 