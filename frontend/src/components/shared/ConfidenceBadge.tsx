import { cn } from '@/lib/utils'

interface ConfidenceBadgeProps {
  /** 0–1 float hoặc 0–100 int. Nếu > 1 sẽ tự động nhân 100 */
  value: number
  showIcon?: boolean
  size?: 'sm' | 'md'
  thresholds?: {
    high: number   // >= high → xanh, default 85
    medium: number // >= medium → vàng, default 65
  }
  className?: string
}

export function ConfidenceBadge({
  value,
  showIcon = true,
  size = 'md',
  thresholds = { high: 85, medium: 65 },
  className,
}: ConfidenceBadgeProps) {
  // Normalize: nếu value <= 1 thì nhân 100
  const pct = Math.round(value <= 1 ? value * 100 : value)

  const isHigh = pct >= thresholds.high
  const isMedium = pct >= thresholds.medium

  const colorCls = isHigh
    ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
    : isMedium
    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'

  const label = isHigh ? 'Cao' : isMedium ? 'Trung bình' : 'Thấp'
  const icon = isHigh ? '●' : isMedium ? '◐' : '○'

  const sizeCls = size === 'sm' ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizeCls,
        colorCls,
        className
      )}
      title={`Độ tin cậy: ${pct}%`}
      data-confidence={pct}
    >
      {showIcon && <span className="leading-none">{icon}</span>}
      {label}{' '}
      <span data-pct={pct}>{pct}%</span>
    </span>
  )
}
