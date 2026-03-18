'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherMockApi } from '@/lib/mock'
import { BulkActionBar, ConfidenceBadge } from '@/components/shared'
import { useClassStore } from '@/stores/class.store'
import { toast } from 'sonner'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, XCircle, Clock, AlertTriangle, Scan } from 'lucide-react'
import { cn } from '@/lib/utils'

type AttendanceRecord = {
  id: string
  studentId: string
  studentName: string
  classId: string
  date: string
  checkInTime: string | null
  status: string
  confidence: number | null
  method: string
  cameraId: string
}

type AttendanceFilter = 'all' | 'pending' | 'confirmed' | 'absent'

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{className?: string}>, label: string, value: number, color: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
      <Icon className={cn('h-8 w-8 shrink-0', color)} />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function AttendanceTable({
  records,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onConfirmSingle,
  onMarkAbsent,
}: {
  records: AttendanceRecord[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onConfirmSingle: (id: string) => void
  onMarkAbsent: (id: string) => void
}) {
  const allSelected = records.length > 0 && selectedIds.size === records.length

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2.5 w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Học sinh</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Giờ vào</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Độ tin cậy</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Trạng thái</th>
            <th className="px-3 py-2.5">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map(record => {
            const isLowConfidence = record.confidence !== null && record.confidence < 0.85
            const isPending = record.status === 'present' && record.confidence !== null
            return (
              <tr
                key={record.id}
                className={cn(
                  'transition-colors',
                  isLowConfidence && 'bg-yellow-50 dark:bg-yellow-950/20',
                  selectedIds.has(record.id) && 'bg-blue-50 dark:bg-blue-950/20'
                )}
              >
                <td className="px-3 py-2.5">
                  <Checkbox
                    checked={selectedIds.has(record.id)}
                    onCheckedChange={() => onToggleSelect(record.id)}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[10px] bg-primary/10">
                        {record.studentName.split(' ').slice(-2).map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      {isLowConfidence && (
                        <p className="text-[10px] text-yellow-600 flex items-center gap-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Cần xem lại
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 hidden sm:table-cell">
                  <span className="font-mono text-xs">{record.checkInTime ?? '—'}</span>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  {record.confidence !== null ? (
                    <ConfidenceBadge value={record.confidence} size="sm" />
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {record.status === 'present' ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Có mặt</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Vắng</Badge>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {isPending && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-green-700 px-1.5"
                        onClick={() => onConfirmSingle(record.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-0.5" />
                        Xác nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-red-600 px-1.5"
                        onClick={() => onMarkAbsent(record.id)}
                      >
                        <XCircle className="h-3 w-3 mr-0.5" />
                        Vắng
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {records.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không có dữ liệu điểm danh</p>
        </div>
      )}
    </div>
  )
}

export default function DiemDanhPage() {
  const { currentClassId } = useClassStore()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<AttendanceFilter>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const { data: allRecords = [], isLoading } = useQuery({
    queryKey: ['gv', 'attendance-all', currentClassId],
    queryFn: async () => {
      const { mockAttendanceToday } = await import('@/lib/mock/data')
      const raw = currentClassId
        ? mockAttendanceToday.filter(a => a.classId === currentClassId)
        : mockAttendanceToday
      return raw.map(a => ({ ...a, date: a.date ?? '' })) as AttendanceRecord[]
    },
    enabled: true,
  })

  const confirmMutation = useMutation({
    mutationFn: (ids: string[]) => teacherMockApi.confirmAttendance(ids),
    onSuccess: (data) => {
      toast.success(`Đã xác nhận ${data.confirmed} học sinh`)
      queryClient.invalidateQueries({ queryKey: ['gv', 'attendance-all'] })
      queryClient.invalidateQueries({ queryKey: ['gv', 'pending-attendance'] })
      setSelectedIds(new Set())
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const present = allRecords.filter(r => r.status === 'present')
  const absent = allRecords.filter(r => r.status === 'absent')
  const pending = allRecords.filter(r => r.status === 'present' && r.confidence !== null && r.confidence < 0.9)
  const lowConfidence = allRecords.filter(r => r.confidence !== null && r.confidence < 0.85)

  const filtered = filter === 'pending' ? pending
    : filter === 'confirmed' ? present.filter(r => r.confidence === null || r.confidence >= 0.9)
    : filter === 'absent' ? absent
    : allRecords

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(r => r.id)))
    }
  }

  function confirmSelected() {
    confirmMutation.mutate(Array.from(selectedIds))
  }

  function confirmAll() {
    const ids = pending.map(r => r.id)
    confirmMutation.mutate(ids)
  }

  function confirmSingle(id: string) {
    confirmMutation.mutate([id])
  }

  function markAbsent(id: string) {
    toast.info('Đã đánh dấu vắng mặt')
  }

  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })

  if (!currentClassId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Scan className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chưa chọn lớp</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn lớp để xem điểm danh</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Điểm danh</h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard icon={CheckCircle2} label="Có mặt" value={present.length} color="text-green-500" />
        <SummaryCard icon={XCircle} label="Vắng mặt" value={absent.length} color="text-red-500" />
        <SummaryCard icon={Clock} label="Chờ xác nhận" value={pending.length} color="text-orange-500" />
        <SummaryCard icon={AlertTriangle} label="Tin cậy thấp ⚠️" value={lowConfidence.length} color="text-yellow-500" />
      </div>

      <Tabs defaultValue="hom-nay">
        <TabsList>
          <TabsTrigger value="hom-nay" className="gap-1.5">
            Hôm nay
            {pending.length > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] h-4 px-1">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="hom-qua">Hôm qua</TabsTrigger>
          <TabsTrigger value="tuan-nay">Tuần này</TabsTrigger>
        </TabsList>

        <TabsContent value="hom-nay" className="mt-4 space-y-3">
          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap">
            {([
              { key: 'all' as const, label: 'Tất cả', count: allRecords.length },
              { key: 'pending' as const, label: 'Chờ xác nhận', count: pending.length, badge: true },
              { key: 'confirmed' as const, label: 'Đã xác nhận', count: present.length - pending.length },
              { key: 'absent' as const, label: 'Vắng mặt', count: absent.length },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  filter === f.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-background hover:bg-muted'
                )}
              >
                {f.label}
                <span className={cn(
                  'rounded-full px-1 text-[10px]',
                  filter === f.key ? 'bg-primary-foreground/20' : f.badge ? 'bg-red-100 text-red-700' : 'bg-muted-foreground/20'
                )}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <AttendanceTable
              records={filtered}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleAll={toggleAll}
              onConfirmSingle={confirmSingle}
              onMarkAbsent={markAbsent}
            />
          )}

          {/* Quick bulk confirm for all pending */}
          {pending.length > 0 && selectedIds.size === 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border bg-background px-5 py-3 shadow-xl animate-in slide-in-from-bottom-4">
              <span className="text-sm font-medium">{pending.length} tiết chờ xác nhận</span>
              <div className="h-4 w-px bg-border" />
              <Button
                size="sm"
                onClick={confirmAll}
                disabled={confirmMutation.isPending}
                className="bg-green-600 hover:bg-green-700 h-8"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                {confirmMutation.isPending ? 'Đang xử lý...' : `Xác nhận tất cả (${pending.length})`}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="hom-qua" className="mt-4">
          <div className="rounded-md border">
            <table className="w-full text-sm" data-testid="diem-danh-table-hom-qua">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Học sinh</th>
                  <th className="px-3 py-2 text-left">Giờ vào</th>
                  <th className="px-3 py-2 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Nguyễn Thị Lan', time: '06:58', status: 'Có mặt' },
                  { name: 'Trần Minh Khoa', time: '07:05', status: 'Có mặt' },
                  { name: 'Lê Thị Hoa', time: '—', status: 'Vắng' },
                  { name: 'Phạm Văn Đức', time: '07:12', status: 'Có mặt' },
                  { name: 'Võ Thị Mai', time: '—', status: 'Vắng' },
                ].map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.time}</td>
                    <td className="px-3 py-2">
                      <span className={r.status === 'Có mặt' ? 'text-green-600' : 'text-red-500'}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Có mặt: 3 · Vắng: 2 (đã xác nhận)</p>
        </TabsContent>

        <TabsContent value="tuan-nay" className="mt-4">
          <div className="text-center py-10 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Xem điểm danh tuần này</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* BulkActionBar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filtered.length}
        onClearSelection={() => setSelectedIds(new Set())}
        onSelectAll={() => setSelectedIds(new Set(filtered.map(r => r.id)))}
        actions={[
          {
            label: `Xác nhận đã chọn (${selectedIds.size})`,
            onClick: confirmSelected,
            loading: confirmMutation.isPending,
            icon: CheckCircle2,
          },
          {
            label: 'Đánh dấu vắng',
            variant: 'destructive' as const,
            onClick: () => {
              toast.info(`Đã đánh dấu vắng ${selectedIds.size} học sinh`)
              setSelectedIds(new Set())
            },
            icon: XCircle,
          },
        ]}
      />
    </div>
  )
}
