import { NextResponse } from 'next/server'
import { getClientById } from '@/data/clients'
import { getPortfolioByClientId } from '@/data/portfolios'
import { getComplianceByClientId, getTaxInfoByClientId, getAccountsByClientId } from '@/data/compliance'
import { getAlertsForClient } from '@/data/alerts'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = getClientById(id)
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }
    
    // Enrichir avec les données associées
    const portfolio = getPortfolioByClientId(id)
    const compliance = getComplianceByClientId(id)
    const taxInfo = getTaxInfoByClientId(id)
    const accounts = getAccountsByClientId(id)
    const alerts = getAlertsForClient(id)
    
    return NextResponse.json({
      success: true,
      data: {
        ...client,
        portfolio,
        compliance,
        taxInfo,
        accounts,
        alerts,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const client = getClientById(id)
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }
    
    // Dans un vrai MVP, on mettrait à jour en base de données
    const updatedClient = {
      ...client,
      ...body,
      id, // Empêcher la modification de l'ID
    }
    
    return NextResponse.json({
      success: true,
      data: updatedClient,
      message: 'Client updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = getClientById(id)
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }
    
    // Dans un vrai MVP, on supprimerait de la base de données
    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
