'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface HeatmapCell {
  rowId: string
  colId: string
  value: number
  tooltip?: string
  status?: 'present' | 'absent' | 'late' | 'unknown'
}

interface HeatmapGridProps {
  rows: { id: string; label: string; subLabel?: string }[]
  cols: { id: string; label: string; isWeekend?: boolean }[]
  data: HeatmapCell[]
  maxValue?: number
  mode?: 'attendance' | 'score' | 'progress'
  colorFn?: (value: number, max: number) => string
  onCellClick?: (rowId: string, colId: string) => void
  rowLabelWidth?: number
  cellSize?: 'sm' | 'md' | 'lg'
  stickyFirstCol?: boolean
  className?: string
}

const attendanceColor = (value: number, status?: string): string => {
  if (status === 'late') return 'bg-yellow-300 dark:bg-yellow-700'
  if (status === 'absent' || value === 0) return 'bg-red-300 dark:bg-red-800'
  if (status === 'present' || value === 1) return 'bg-green-500 dark:bg-green-600'
  return 'bg-muted'
}

const scoreColor = (value: number, max: number): string => {
  const pct = value / max
  if (pct >= 0.9) return 'bg-green-500 dark:bg-green-600'
  if (pct >= 0.7) return 'bg-green-300 dark:bg-green-700'
  if (pct >= 0.5) return 'bg-yellow-300 dark:bg-yellow-700'
  if (pct > 0) return 'bg-red-300 dark:bg-red-800'
  return 'bg-muted'
}

const defaultColorFn = (value: number, max: number): string => scoreColor(value, max)

const CELL_SIZE = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
}

export function HeatmapGrid({
  rows,
  cols,
  data,
  maxValue = 1,
  mode,
  colorFn = defaultColorFn,
  onCellClick,
  rowLabelWidth = 120,
  cellSize = 'md',
  stickyFirstCol = false,
  className,
}: HeatmapGridProps) {
  const cellMap = new Map(data.map(d => [`${d.rowId}:${d.colId}`, d]))
  const sizeCls = CELL_SIZE[cellSize]

  const getColor = (cell: HeatmapCell | undefined): string => {
    if (!cell || cell.value < 0) return 'bg-muted/50'
    if (mode === 'attendance') return attendanceColor(cell.value, cell.status)
    return colorFn(cell.value, maxValue)
  }

  return (
    <TooltipProvider>
      <div className={cn('w-full overflow-x-auto', className)}>
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th
                style={{ width: rowLabelWidth, minWidth: rowLabelWidth }}
                className={cn(
                  'py-1 pr-3 text-left text-muted-foreground font-normal',
                  stickyFirstCol && 'sticky left-0 z-10 bg-background'
                )}
              />
              {cols.map(col => (
                <th
                  key={col.id}
                  className={cn(
                    'px-0.5 py-1 text-center font-normal whitespace-nowrap',
                    col.isWeekend ? 'text-muted-foreground/50' : 'text-muted-foreground'
                  )}
                  style={{ minWidth: 28 }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/20">
                <td
                  style={{ width: rowLabelWidth, maxWidth: rowLabelWidth }}
                  className={cn(
                    'py-0.5 pr-3 font-medium truncate',
                    stickyFirstCol && 'sticky left-0 z-10 bg-background'
                  )}
                  title={row.label}
                >
                  <div className="truncate">{row.label}</div>
                  {row.subLabel && (
                    <div className="text-[10px] text-muted-foreground truncate">{row.subLabel}</div>
                  )}
                </td>
                {cols.map(col => {
                  const cell = cellMap.get(`${row.id}:${col.id}`)
                  const color = getColor(cell)
                  return (
                    <td key={col.id} className="px-0.5 py-0.5">
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              sizeCls,
                              'rounded-sm transition-opacity hover:opacity-70',
                              color,
                              onCellClick ? 'cursor-pointer' : 'cursor-default'
                            )}
                            onClick={() => onCellClick?.(row.id, col.id)}
                            role={onCellClick ? 'button' : undefined}
                            tabIndex={onCellClick ? 0 : undefined}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>{cell?.tooltip ?? `${row.label} — ${col.label}`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend for attendance mode */}
      {mode === 'attendance' && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-green-500" /> Có mặt
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-300 dark:bg-red-800" /> Vắng
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-yellow-300 dark:bg-yellow-700" /> Muộn
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-muted/50" /> Không có dữ liệu
          </span>
        </div>
      )}
    </TooltipProvider>
  )
}
