'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'

type ChartType = 'bar' | 'line' | 'pie'
export interface ChartCardProps {
  title: string
  type: ChartType
  data: Record<string, unknown>[]
  dataKey: string
  xKey?: string
  colors?: string[]
  loading?: boolean
  height?: number
  filterOptions?: { label: string; value: string }[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  className?: string
}

const DEFAULT_COLORS = ['#0d9488', '#10b981', '#f59e0b', '#3b82f6', '#a855f7', '#64748b']

export function ChartCard({
  title, type, data, dataKey, xKey = 'name', colors = DEFAULT_COLORS,
  loading, height = 300, filterOptions, filterValue, onFilterChange, className,
}: ChartCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {filterOptions && filterOptions.length > 0 && (
          <Select
            value={filterValue}
            onValueChange={(val) => { if (val && onFilterChange) onFilterChange(val) }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full" style={{ height }} />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey={xKey} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : type === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey={xKey} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={xKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={height / 3}
                  label
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
