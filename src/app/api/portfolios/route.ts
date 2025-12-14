import { NextResponse } from 'next/server'
import { portfolios, getPortfolioByClientId } from '@/data/portfolios'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    
    if (clientId) {
      const portfolio = getPortfolioByClientId(clientId)
      
      if (!portfolio) {
        return NextResponse.json(
          { success: false, error: 'Portfolio not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: portfolio,
      })
    }
    
    return NextResponse.json({
      success: true,
      data: portfolios,
      total: portfolios.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}
