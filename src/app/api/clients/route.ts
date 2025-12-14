import { NextResponse } from 'next/server'
import { clients } from '@/data/clients'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({
      success: true,
      data: clients,
      total: clients.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Dans un vrai MVP, on sauvegarderait en base de données
    const newClient = {
      id: `client-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Client created successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
