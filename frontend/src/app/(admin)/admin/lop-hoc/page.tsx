'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockClasses, mockTeachers } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/composite/empty-state'
import { toast } from 'sonner'
import {
  LayoutGrid, List, Plus, Search, Users, GraduationCap,
  UserCheck, Eye, Scan, UserCog, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ClassItem = typeof mockClasses[number]

const CLASS_PROGRESS: Record<string, number> = {
  '10A1': 72, '10A2': 68, '10A3': 75, '10A4': 60, '10A5': 80,
  '10A6': 55, '10A7': 78, '10A8': 65,
  '11A1': 82, '11A2': 70, '11A3': 85, '11A4': 74, '11A5': 77,
  '11A6': 88, '11A7': 66, '11A8': 79,
  '12A1': 91, '12A2': 87, '12A3': 93, '12A4': 84, '12A5': 89,
  '12A6': 95, '12A7': 82, '12A8': 90,
}

function getProgressColor(pct: number) {
  if (pct >= 85) return 'text-green-600'
  if (pct >= 70) return 'text-blue-600'
  if (pct >= 55) return 'text-yellow-600'
  return 'text-red-600'
}

function getTeacherName(id: string | null) {
  if (!id) return 'Chưa phân công'
  return mockTeachers.find(t => t.id === id)?.name ?? id
}

function ClassCard({ cls }: { cls: ClassItem }) {
  const progress = CLASS_PROGRESS[cls.name] ?? 70
  const teacher = getTeacherName(cls.homeroom)

  return (
    <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-2xl font-bold">{cls.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Khối {cls.grade} · {cls.year}</p>
        </div>
        <Badge variant="outline" className="text-xs">{cls.room}</Badge>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <UserCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground text-xs">GVCN:</span>
          <span className="text-xs font-medium truncate">{teacher}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground text-xs">Sĩ số:</span>
          <span className="text-xs font-medium">{cls.studentCount} học sinh</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Hoàn thành chương trình</span>
          <span className={cn('text-xs font-semibold', getProgressColor(progress))}>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full', progress >= 85 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : progress >= 55 ? 'bg-yellow-500' : 'bg-red-500')}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-xs cursor-pointer"
          onClick={() => toast.info(`Xem học sinh lớp ${cls.name}`)}>
          <Eye className="h-3 w-3" /> Xem HS
        </Button>
        <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-xs cursor-pointer"
          onClick={() => toast.info(`Điểm danh lớp ${cls.name}`)}>
          <Scan className="h-3 w-3" /> Điểm danh
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"
          onClick={() => toast.info(`Phân công GV lớp ${cls.name}`)}>
          <UserCog className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function ClassListRow({ cls }: { cls: ClassItem }) {
  const progress = CLASS_PROGRESS[cls.name] ?? 70
  const teacher = getTeacherName(cls.homeroom)

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3 hover:shadow-sm transition-all">
      <div className="w-16 shrink-0">
        <p className="font-bold text-lg">{cls.name}</p>
        <p className="text-xs text-muted-foreground">Khối {cls.grade}</p>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">GVCN</p>
          <p className="text-xs font-medium truncate">{teacher}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sĩ số</p>
          <p className="text-xs font-medium">{cls.studentCount} HS</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tiến độ</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-full rounded-full', progress >= 85 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-yellow-500')}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={cn('text-xs font-medium', getProgressColor(progress))}>{progress}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
          onClick={() => toast.info(`Xem HS lớp ${cls.name}`)}>
          <Eye className="h-3.5 w-3.5" /> Xem
        </Button>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs cursor-pointer"
          onClick={() => toast.info(`Điểm danh ${cls.name}`)}>
          <Scan className="h-3.5 w-3.5" /> Điểm danh
        </Button>
      </div>
    </div>
  )
}

function AddClassDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => { await new Promise(r => setTimeout(r, 500)) },
    onSuccess: () => {
      toast.success('Đã tạo lớp học mới!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] })
      onClose()
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm lớp học mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tên lớp</Label>
              <Input placeholder="VD: 10A9" />
            </div>
            <div className="space-y-1.5">
              <Label>Khối</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Chọn khối" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Khối 10</SelectItem>
                  <SelectItem value="11">Khối 11</SelectItem>
                  <SelectItem value="12">Khối 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>GVCN</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Chọn giáo viên chủ nhiệm" /></SelectTrigger>
              <SelectContent>
                {mockTeachers.slice(0, 10).map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name} ({t.subject})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Năm học</Label>
              <Input defaultValue="2024-2025" />
            </div>
            <div className="space-y-1.5">
              <Label>Phòng học</Label>
              <Input placeholder="VD: P209" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? 'Đang tạo...' : 'Tạo lớp'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="flex gap-3">
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { data: classes, isLoading } = useQuery({
    queryKey: ['admin', 'classes', gradeFilter],
    queryFn: () => adminMockApi.getClasses({ grade: gradeFilter !== 'all' ? parseInt(gradeFilter) : undefined }),
  })

  if (isLoading) return <PageSkeleton />

  const filtered = (classes ?? []).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  const grade10 = filtered.filter(c => c.grade === 10)
  const grade11 = filtered.filter(c => c.grade === 11)
  const grade12 = filtered.filter(c => c.grade === 12)

  const renderGradeSection = (label: string, items: ClassItem[]) => {
    if (gradeFilter !== 'all' && items.length === 0) return null
    if (items.length === 0) return null

    return (
      <div key={label}>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-semibold">{label}</h2>
          <Badge variant="secondary">{items.length} lớp</Badge>
        </div>
        {viewMode === 'grid' ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map(cls => <ClassCard key={cls.id} cls={cls} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(cls => <ClassListRow key={cls.id} cls={cls} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Lớp học</h1>
          <Badge variant="secondary">{filtered.length} lớp</Badge>
        </div>
        <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm lớp
        </Button>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm lớp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: '10', label: 'Khối 10' },
            { value: '11', label: 'Khối 11' },
            { value: '12', label: 'Khối 12' },
          ].map(({ value, label }) => (
            <button
              key={value}
              data-testid={`filter-grade-${value}`}
              onClick={() => setGradeFilter(value)}
              className={cn(
                'rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                gradeFilter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-lg border p-1">
          <button
            className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy lớp học"
          description="Thử thay đổi bộ lọc hoặc thêm lớp mới"
          icon={<BookOpen className="h-12 w-12" />}
          action={{ label: 'Thêm lớp', onClick: () => setAddDialogOpen(true) }}
        />
      ) : (
        <div className="space-y-8">
          {gradeFilter === 'all' ? (
            <>
              {renderGradeSection('Khối 10', grade10)}
              {renderGradeSection('Khối 11', grade11)}
              {renderGradeSection('Khối 12', grade12)}
            </>
          ) : (
            <>
              {renderGradeSection(`Khối ${gradeFilter}`, filtered)}
            </>
          )}
        </div>
      )}

      <AddClassDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </div>
  )
}
