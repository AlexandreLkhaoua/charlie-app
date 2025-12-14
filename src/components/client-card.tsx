'use client'

import Link from 'next/link'
import { Client } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCompactNumber, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusVariant = {
    Active: 'success',
    'Review Pending': 'warning',
    'At Risk': 'destructive',
  } as const

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{client.type}</p>
              </div>
            </div>
            <Badge variant={statusVariant[client.status]}>{client.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total AUM</p>
              <p className="text-lg font-semibold">{formatCompactNumber(client.totalAUM)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">YTD Return</p>
              <div className="flex items-center gap-1">
                {client.ytdReturn >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p
                  className={`text-lg font-semibold ${
                    client.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {formatPercentage(client.ytdReturn)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <span>RM: {client.relationshipManager}</span>
            <div className="flex items-center gap-1 text-primary">
              View Details <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
