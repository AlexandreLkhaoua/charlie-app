'use client'

import { MarketAlert } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import { AlertTriangle, Info, AlertCircle, TrendingUp, DollarSign, Globe, Landmark, Coins } from 'lucide-react'

interface AlertCardProps {
  alert: MarketAlert
  compact?: boolean
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const severityConfig = {
    info: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Info, badge: 'secondary' as const },
    warning: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertTriangle, badge: 'warning' as const },
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle, badge: 'destructive' as const },
  }

  const typeIcons = {
    Macro: Globe,
    Stocks: TrendingUp,
    Rates: Landmark,
    FX: DollarSign,
    Crypto: Coins,
    Commodities: Coins,
  }

  const config = severityConfig[alert.severity]
  const TypeIcon = typeIcons[alert.type] || Info
  const SeverityIcon = config.icon

  if (compact) {
    return (
      <div className={cn('flex items-start gap-3 p-3 rounded-lg', config.bg)}>
        <SeverityIcon className={cn('h-5 w-5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{alert.title}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {!alert.read && (
          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        )}
      </div>
    )
  }

  return (
    <Card className={cn(!alert.read && 'border-l-4 border-l-primary')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', config.bg)}>
              <TypeIcon className={cn('h-5 w-5', config.color)} />
            </div>
            <div>
              <CardTitle className="text-base">{alert.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={config.badge}>{alert.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(alert.timestamp)}
                </span>
              </div>
            </div>
          </div>
          <SeverityIcon className={cn('h-5 w-5 flex-shrink-0', config.color)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{alert.description}</p>
        <div className={cn('p-3 rounded-lg', config.bg)}>
          <p className="text-sm font-medium">Portfolio Impact</p>
          <p className="text-sm text-muted-foreground mt-1">{alert.impact}</p>
        </div>
        {alert.affectedClients.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Affects {alert.affectedClients.length} client(s)
          </p>
        )}
      </CardContent>
    </Card>
  )
}
