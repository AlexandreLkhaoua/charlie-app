import { NextResponse } from 'next/server'
import { clients } from '@/data/clients'
import { marketAlerts, getUnreadAlerts } from '@/data/alerts'
import { complianceData, getTotalComplianceIssues } from '@/data/compliance'
import { portfolios, calculateTotalAUM } from '@/data/portfolios'
import { DashboardKPIs } from '@/types'

export async function GET() {
  try {
    const totalAUM = calculateTotalAUM()
    const totalClients = clients.length
    const avgReturn = clients.reduce((sum, c) => sum + c.ytdReturn, 0) / totalClients
    const clientsAtRisk = clients.filter(c => c.status === 'At Risk').length
    const pendingReviews = clients.filter(c => c.status === 'Review Pending').length
    const complianceIssues = getTotalComplianceIssues()
    const newAlerts = getUnreadAlerts().length
    
    const kpis: DashboardKPIs = {
      totalAUM,
      totalClients,
      avgReturn,
      clientsAtRisk,
      pendingReviews,
      complianceIssues,
      newAlerts,
    }
    
    // Performance par asset class (agrégé)
    const allocationSummary = portfolios.reduce((acc, portfolio) => {
      portfolio.allocation.forEach(item => {
        const existing = acc.find(a => a.asset === item.asset)
        if (existing) {
          existing.value += item.value
        } else {
          acc.push({ ...item })
        }
      })
      return acc
    }, [] as { asset: string; value: number; percentage: number; color: string }[])
    
    // Recalculer les pourcentages
    const totalValue = allocationSummary.reduce((sum, item) => sum + item.value, 0)
    allocationSummary.forEach(item => {
      item.percentage = (item.value / totalValue) * 100
    })
    
    // Top performers et underperformers
    const clientsByPerformance = [...clients].sort((a, b) => b.ytdReturn - a.ytdReturn)
    const topPerformers = clientsByPerformance.slice(0, 3)
    const underperformers = clientsByPerformance.slice(-3).reverse()
    
    // Alertes récentes
    const recentAlerts = [...marketAlerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
    
    return NextResponse.json({
      success: true,
      data: {
        kpis,
        allocationSummary,
        topPerformers,
        underperformers,
        recentAlerts,
        clientsByStatus: {
          active: clients.filter(c => c.status === 'Active').length,
          reviewPending: clients.filter(c => c.status === 'Review Pending').length,
          atRisk: clients.filter(c => c.status === 'At Risk').length,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
