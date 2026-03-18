'use client'

import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BulkAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  disabled?: boolean
  loading?: boolean
}

interface BulkActionBarProps {
  selectedCount: number
  totalCount?: number
  actions: BulkAction[]
  onClearSelection: () => void
  onSelectAll?: () => void
  position?: 'bottom' | 'top'
  className?: string
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  onSelectAll,
  position = 'bottom',
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  const isAllSelected = totalCount !== undefined && selectedCount === totalCount

  return (
    <div
      className={cn(
        'fixed left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border bg-background px-5 py-3 shadow-xl',
        'animate-in slide-in-from-bottom-4 duration-200',
        position === 'bottom' ? 'bottom-6' : 'top-6',
        className
      )}
    >
      <button
        onClick={onClearSelection}
        className="flex items-center gap-1.5 rounded-full p-1 hover:bg-muted transition-colors"
        aria-label="Bỏ chọn tất cả"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <span className="text-sm font-medium whitespace-nowrap">
        {selectedCount}
        {totalCount !== undefined && `/${totalCount}`} đã chọn
      </span>

      {onSelectAll && !isAllSelected && totalCount !== undefined && (
        <button
          onClick={onSelectAll}
          className="text-xs text-primary hover:underline whitespace-nowrap"
        >
          Chọn tất cả {totalCount}
        </button>
      )}

      <div className="h-4 w-px bg-border shrink-0" />

      <div className="flex items-center gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <Button
              key={i}
              size="sm"
              variant={action.variant ?? 'default'}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className="h-8 gap-1.5 whitespace-nowrap"
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {action.loading ? 'Đang xử lý...' : action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
