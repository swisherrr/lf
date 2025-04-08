import { NextResponse } from 'next/server';

// Alpha Vantage API key - should be set in environment variables
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!symbol || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: symbol, startDate, endDate' },
      { status: 400 }
    );
  }

  try {
    // Construct the API URL
    const url = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${API_KEY}`;
    
    // Fetch data from Alpha Vantage
    const response = await fetch(url);
    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message']) {
      return NextResponse.json(
        { error: 'API Error', details: data['Error Message'] },
        { status: 400 }
      );
    }
    
    // Extract the RSI data
    const rsiData = data['Technical Analysis: RSI'];
    if (!rsiData) {
      return NextResponse.json(
        { error: 'No RSI data available', details: 'The API response did not contain RSI data' },
        { status: 404 }
      );
    }
    
    // Filter data by date range
    const filteredData = [];
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    for (const [date, values] of Object.entries(rsiData)) {
      const currentDate = new Date(date);
      if (currentDate >= startDateObj && currentDate <= endDateObj) {
        const rsiValue = (values as { RSI: string })['RSI'];
        filteredData.push({
          date: date,
          rsi: parseFloat(rsiValue)
        });
      }
    }
    
    // Sort data by date (newest first)
    filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({
      symbol,
      data: filteredData
    });
  } catch (error) {
    console.error('Error fetching historical RSI data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical RSI data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 