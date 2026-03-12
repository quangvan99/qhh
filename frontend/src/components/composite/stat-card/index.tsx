import { TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ModuleColor = 'lms' | 'exam' | 'ai' | 'library' | 'admin' | 'primary'
export interface StatCardProps {
  title: string
  value: string | number
  delta?: number
  deltaType?: 'positive-is-good' | 'positive-is-bad'
  icon?: React.ReactNode
  module?: ModuleColor
  loading?: boolean
  unit?: string
  className?: string
}

const borderColors: Record<ModuleColor, string> = {
  primary: 'border-l-teal-500',
  lms:     'border-l-emerald-500',
  exam:    'border-l-amber-500',
  ai:      'border-l-blue-500',
  library: 'border-l-purple-500',
  admin:   'border-l-slate-500',
}

export function StatCard({ title, value, delta, deltaType = 'positive-is-good', icon, module: mod = 'primary', loading, unit, className }: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('border-l-4', borderColors[mod], className)}>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = (delta ?? 0) >= 0
  const isGood = deltaType === 'positive-is-good' ? isPositive : !isPositive
  const deltaColor = isGood ? 'text-green-600' : 'text-red-600'

  return (
    <Card className={cn('border-l-4', borderColors[mod], className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className={cn('mt-1 flex items-center gap-1 text-sm font-medium', deltaColor)}>
            {isPositive
              ? <TrendingUp className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(delta)}%</span>
            <span className="text-muted-foreground font-normal">so với kỳ trước</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
