import { NextResponse } from 'next/server'
import { AllocationItem } from '@/types'

interface SimulationRequest {
  currentAllocation: AllocationItem[]
  proposedAllocation: AllocationItem[]
  investmentAmount?: number
}

export async function POST(request: Request) {
  try {
    const body: SimulationRequest = await request.json()
    const { currentAllocation, proposedAllocation, investmentAmount = 0 } = body
    
    if (!proposedAllocation || proposedAllocation.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Proposed allocation is required' },
        { status: 400 }
      )
    }
    
    // Calculer les métriques de risque/rendement simulées
    const calculateExpectedReturn = (allocation: AllocationItem[]): number => {
      const assetReturns: Record<string, number> = {
        'US Equities': 10.5,
        'International Equities': 8.2,
        'Fixed Income': 4.5,
        'Alternatives': 7.8,
        'Real Estate': 6.5,
        'Cash': 2.0,
        'Crypto': 15.0,
      }
      
      return allocation.reduce((sum, item) => {
        const expectedReturn = assetReturns[item.asset] || 5.0
        return sum + (item.percentage / 100) * expectedReturn
      }, 0)
    }
    
    const calculateExpectedRisk = (allocation: AllocationItem[]): number => {
      const assetRisks: Record<string, number> = {
        'US Equities': 16.0,
        'International Equities': 18.5,
        'Fixed Income': 5.5,
        'Alternatives': 12.0,
        'Real Estate': 10.0,
        'Cash': 0.5,
        'Crypto': 45.0,
      }
      
      // Simplification - en réalité on utiliserait une matrice de corrélation
      return allocation.reduce((sum, item) => {
        const risk = assetRisks[item.asset] || 10.0
        return sum + (item.percentage / 100) * risk
      }, 0)
    }
    
    const currentReturn = calculateExpectedReturn(currentAllocation || [])
    const proposedReturn = calculateExpectedReturn(proposedAllocation)
    const currentRisk = calculateExpectedRisk(currentAllocation || [])
    const proposedRisk = calculateExpectedRisk(proposedAllocation)
    
    const riskFreeRate = 4.5
    const currentSharpe = (currentReturn - riskFreeRate) / (currentRisk || 1)
    const proposedSharpe = (proposedReturn - riskFreeRate) / (proposedRisk || 1)
    
    // Estimer le coût de rebalancing (simplifié)
    const rebalancingCost = Math.abs(proposedReturn - currentReturn) * 0.001 * investmentAmount
    
    // Max drawdown estimé (simplifié)
    const maxDrawdown = proposedRisk * 2.5 // Approximation rough
    
    return NextResponse.json({
      success: true,
      data: {
        currentAllocation,
        proposedAllocation,
        metrics: {
          current: {
            expectedReturn: currentReturn,
            expectedRisk: currentRisk,
            sharpeRatio: currentSharpe,
          },
          proposed: {
            expectedReturn: proposedReturn,
            expectedRisk: proposedRisk,
            sharpeRatio: proposedSharpe,
          },
          difference: {
            returnDelta: proposedReturn - currentReturn,
            riskDelta: proposedRisk - currentRisk,
            sharpeDelta: proposedSharpe - currentSharpe,
          },
        },
        maxDrawdown,
        rebalancingCost,
        recommendation: proposedSharpe > currentSharpe 
          ? 'The proposed allocation improves risk-adjusted returns'
          : 'The proposed allocation may not improve portfolio efficiency',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to run simulation' },
      { status: 500 }
    )
  }
}
