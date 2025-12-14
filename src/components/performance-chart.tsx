'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceChartProps {
  title?: string
}

// Mock data pour la performance
const performanceData = [
  { month: 'Jan', portfolio: 100, benchmark: 100 },
  { month: 'Feb', portfolio: 102.5, benchmark: 101.8 },
  { month: 'Mar', portfolio: 101.2, benchmark: 99.5 },
  { month: 'Apr', portfolio: 105.8, benchmark: 103.2 },
  { month: 'May', portfolio: 108.2, benchmark: 106.5 },
  { month: 'Jun', portfolio: 107.1, benchmark: 105.8 },
  { month: 'Jul', portfolio: 110.5, benchmark: 108.2 },
  { month: 'Aug', portfolio: 109.8, benchmark: 107.5 },
  { month: 'Sep', portfolio: 112.4, benchmark: 110.2 },
  { month: 'Oct', portfolio: 111.2, benchmark: 109.5 },
  { month: 'Nov', portfolio: 115.8, benchmark: 112.8 },
  { month: 'Dec', portfolio: 118.2, benchmark: 115.5 },
]

export function PerformanceChart({ title = 'Portfolio Performance' }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Portfolio"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="Benchmark"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
