import { StatCard } from '@/components/composite/stat-card'
import type { StatCardProps } from '@/components/composite/stat-card'
import { cn } from '@/lib/utils'

export interface StatGridProps {
  stats: StatCardProps[]
  cols?: 2 | 3 | 4
  className?: string
}

const gridCols = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function StatGrid({ stats, cols = 4, className }: StatGridProps) {
  return (
    <div className={cn('grid gap-4', gridCols[cols], className)}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}
