import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
  onClick?: () => void
  className?: string
}

export function KPICard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
  className,
}: KPICardProps) {
  const variantStyles = {
    default: 'border-border bg-card',
    success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
    danger: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
  }

  const trendPositive = trend?.isPositive !== undefined ? trend.isPositive : (trend?.value ?? 0) > 0

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              {trend.value > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 shrink-0" />
              ) : trend.value < 0 ? (
                <ArrowDown className="h-3 w-3 text-red-500 shrink-0" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
              <span
                className={cn(
                  trendPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                  trend.value === 0 && 'text-muted-foreground'
                )}
              >
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="ml-3 shrink-0 rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
