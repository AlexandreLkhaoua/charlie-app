import { NextResponse } from 'next/server'
import { products, searchProducts, getProductsByType } from '@/data/products'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let result = products
    
    if (query) {
      result = searchProducts(query)
    }
    
    if (type) {
      result = result.filter(p => p.type === type)
    }
    
    // Pagination
    const total = result.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedData = result.slice(startIndex, startIndex + limit)
    
    return NextResponse.json({
      success: true,
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
