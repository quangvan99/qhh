'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockStudents, mockClasses } from '@/lib/mock/data'
import { DataTable } from '@/components/patterns/data-table'
import { BulkActionBar } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/composite/empty-state'
import { toast } from 'sonner'
import {
  Search, UserPlus, Download, Eye, Pencil, Trash2,
  GraduationCap, Phone, Home, Users, Star, BookOpen,
  ArrowRightLeft, RefreshCw, FileDown,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

type Student = typeof mockStudents[number]

function getInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

function ScholarshipBadge({ level }: { level: string | null }) {
  if (!level) return <span className="text-xs text-muted-foreground">—</span>
  if (level === 'loai1') return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Loại 1</Badge>
  return <Badge className="bg-slate-400 text-white hover:bg-slate-500">Loại 2</Badge>
}

function ConductBar({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-blue-500' : score >= 65 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs tabular-nums">{score}</span>
    </div>
  )
}

const mockGrades = [
  { subject: 'Toán', scores: [8.0, 7.5, 9.0], avg: 8.2 },
  { subject: 'Vật lý', scores: [7.5, 8.0, 7.0], avg: 7.5 },
  { subject: 'Hóa học', scores: [9.0, 8.5, 9.5], avg: 9.0 },
  { subject: 'Ngữ văn', scores: [7.0, 7.5, 8.0], avg: 7.5 },
  { subject: 'Tiếng Anh', scores: [8.5, 9.0, 8.5], avg: 8.7 },
  { subject: 'Lịch sử', scores: [8.0, 7.0, 8.5], avg: 7.8 },
]

function StudentDrawer({ student, open, onClose }: { student: Student | null; open: boolean; onClose: () => void }) {
  if (!student) return null
  const cls = mockClasses.find(c => c.id === student.classId)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-0">
          <SheetTitle>Hồ sơ học sinh</SheetTitle>
          <SheetDescription>Thông tin chi tiết học sinh</SheetDescription>
        </SheetHeader>

        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-16 w-16 text-xl">
            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.id} · Lớp {cls?.name ?? student.classId}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                {student.status === 'active' ? 'Đang học' : 'Thôi học'}
              </Badge>
              <ScholarshipBadge level={student.scholarshipLevel} />
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="canhan" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="canhan" className="flex-1 text-xs">Cá nhân</TabsTrigger>
            <TabsTrigger value="hoctap" className="flex-1 text-xs">Học tập</TabsTrigger>
            <TabsTrigger value="renluyen" className="flex-1 text-xs">Rèn luyện</TabsTrigger>
            <TabsTrigger value="giadinh" className="flex-1 text-xs">Gia đình</TabsTrigger>
          </TabsList>

          <TabsContent value="canhan" className="mt-4 space-y-3">
            <div className="grid gap-3">
              <InfoRow2 label="Họ và tên" value={student.name} />
              <InfoRow2 label="Mã học sinh" value={student.id} />
              <InfoRow2 label="Ngày sinh" value={new Date(student.dob).toLocaleDateString('vi-VN')} />
              <InfoRow2 label="Email" value={student.email} />
              <InfoRow2 label="SĐT phụ huynh" value={student.phone} />
              <InfoRow2 label="Lớp" value={cls?.name ?? student.classId} />
            </div>
          </TabsContent>

          <TabsContent value="hoctap" className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-sm">Bảng điểm học kỳ 1</h4>
              <Badge variant="outline">GPA: 8.1</Badge>
            </div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Môn</th>
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground">ĐM1</th>
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground">ĐM2</th>
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground">HK</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">TB</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGrades.map((g, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2 font-medium">{g.subject}</td>
                      {g.scores.map((s, j) => (
                        <td key={j} className="px-3 py-2 text-center">{s}</td>
                      ))}
                      <td className="px-3 py-2 text-right font-semibold text-primary">{g.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="renluyen" className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Điểm rèn luyện (ĐRL)</p>
                <p className="text-3xl font-bold mt-1">{student.conductScore}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Xếp loại</p>
                <Badge className="mt-1" variant={student.conductScore >= 90 ? 'default' : student.conductScore >= 75 ? 'secondary' : 'destructive'}>
                  {student.conductScore >= 90 ? 'Xuất sắc' : student.conductScore >= 75 ? 'Tốt' : student.conductScore >= 65 ? 'Khá' : 'Trung bình'}
                </Badge>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium mb-2">Lịch sử vi phạm</p>
              <p className="text-sm text-muted-foreground text-center py-4">Không có vi phạm nào được ghi nhận</p>
            </div>
          </TabsContent>

          <TabsContent value="giadinh" className="mt-4 space-y-3">
            <div className="rounded-xl border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Bố / Người giám hộ</p>
              <InfoRow2 label="Tên" value="Nguyễn Văn A" />
              <InfoRow2 label="Nghề nghiệp" value="Kỹ sư" />
              <InfoRow2 label="SĐT" value="0901234501" />
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Mẹ / Người giám hộ 2</p>
              <InfoRow2 label="Tên" value="Trần Thị B" />
              <InfoRow2 label="Nghề nghiệp" value="Giáo viên" />
              <InfoRow2 label="SĐT" value="0901234502" />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function InfoRow2({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-medium text-right">{value}</span>
    </div>
  )
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [scholarshipFilter, setScholarshipFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Student[]>([])

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'students', search, classFilter, gradeFilter, statusFilter],
    queryFn: () => adminMockApi.getStudents({
      search: search || undefined,
      classId: classFilter !== 'all' ? classFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
  })

  const students = data?.data ?? []
  const total = data?.total ?? 0

  // Apply client-side grade filter
  const filteredStudents = students.filter(s => {
    if (gradeFilter === 'all') return true
    const cls = mockClasses.find(c => c.id === s.classId)
    return cls?.grade === parseInt(gradeFilter)
  }).filter(s => {
    if (scholarshipFilter === 'all') return true
    if (scholarshipFilter === 'none') return !s.scholarshipLevel
    return s.scholarshipLevel === scholarshipFilter
  })

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Họ tên',
      cell: ({ row }) => {
        const cls = mockClasses.find(c => c.id === row.original.classId)
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">Lớp {cls?.name ?? row.original.classId}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'Mã HS',
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>,
    },
    {
      accessorKey: 'conductScore',
      header: 'ĐRL',
      cell: ({ row }) => <ConductBar score={row.original.conductScore} />,
    },
    {
      accessorKey: 'scholarshipLevel',
      header: 'Học bổng',
      cell: ({ row }) => <ScholarshipBadge level={row.original.scholarshipLevel} />,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? 'Đang học' : 'Thôi học'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"
            onClick={() => { setSelectedStudent(row.original); setDrawerOpen(true) }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive hover:text-destructive"
            onClick={() => toast.success('Đã xóa học sinh')}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Học sinh</h1>
          <Badge variant="secondary">{total} học sinh</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Đang xuất Excel...')}>
            <FileDown className="h-4 w-4" /> Xuất Excel
          </Button>
          <Button size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Chức năng thêm mới đang phát triển')}>
            <UserPlus className="h-4 w-4" /> Thêm học sinh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học sinh..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={gradeFilter} onValueChange={v => v && setGradeFilter(v)}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Khối" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khối</SelectItem>
            <SelectItem value="10">Khối 10</SelectItem>
            <SelectItem value="11">Khối 11</SelectItem>
            <SelectItem value="12">Khối 12</SelectItem>
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={v => v && setClassFilter(v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Lớp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lớp</SelectItem>
            {mockClasses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={scholarshipFilter} onValueChange={v => v && setScholarshipFilter(v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Học bổng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="loai1">Học bổng Loại 1</SelectItem>
            <SelectItem value="loai2">Học bổng Loại 2</SelectItem>
            <SelectItem value="none">Không có</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang học</SelectItem>
            <SelectItem value="inactive">Thôi học</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        loading={isLoading}
        selectable
        onSelectionChange={setSelectedRows}
        searchable={false}
        emptyState={
          <EmptyState
            title="Không tìm thấy học sinh"
            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            icon={<GraduationCap className="h-12 w-12" />}
          />
        }
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        totalCount={filteredStudents.length}
        onClearSelection={() => setSelectedRows([])}
        actions={[
          { label: 'Chuyển lớp', icon: ArrowRightLeft, onClick: () => toast.info('Chức năng chuyển lớp đang phát triển') },
          { label: 'Cập nhật ĐRL', icon: RefreshCw, onClick: () => toast.success(`Đã cập nhật ĐRL ${selectedRows.length} học sinh`), variant: 'outline' },
          { label: 'Xuất Excel', icon: FileDown, onClick: () => toast.info('Đang xuất Excel...'), variant: 'outline' },
        ]}
      />

      {/* Student Detail Drawer */}
      <StudentDrawer
        student={selectedStudent}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
