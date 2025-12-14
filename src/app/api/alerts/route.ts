import { NextResponse } from 'next/server'
import { marketAlerts, getUnreadAlerts, getAlertsByType, getAlertsBySeverity } from '@/data/alerts'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')
    const unreadOnly = searchParams.get('unread') === 'true'
    
    let alerts = marketAlerts
    
    if (unreadOnly) {
      alerts = getUnreadAlerts()
    }
    
    if (type) {
      alerts = alerts.filter(a => a.type === type)
    }
    
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity)
    }
    
    // Trier par date décroissante
    alerts = alerts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: alerts,
      total: alerts.length,
      unreadCount: getUnreadAlerts().length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { alertIds, read } = body
    
    if (!alertIds || !Array.isArray(alertIds)) {
      return NextResponse.json(
        { success: false, error: 'alertIds array is required' },
        { status: 400 }
      )
    }
    
    // Dans un vrai MVP, on mettrait à jour en base de données
    // Ici on simule juste la réponse
    return NextResponse.json({
      success: true,
      message: `${alertIds.length} alerts marked as ${read ? 'read' : 'unread'}`,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update alerts' },
      { status: 500 }
    )
  }
}
