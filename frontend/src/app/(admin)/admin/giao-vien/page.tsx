'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockTeachers } from '@/lib/mock/data'
import { DataTable } from '@/components/patterns/data-table'
import { BulkActionBar } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/composite/empty-state'
import { toast } from 'sonner'
import {
  UserPlus, Upload, Search, Eye, Pencil, Trash2,
  CheckCircle, XCircle, Mail, Phone, Building2, Calendar,
  KeyRound, Users, RefreshCw,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

type Teacher = typeof mockTeachers[number]

const SUBJECTS = ['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh', 'Sinh học', 'Tin học', 'Thể dục', 'Âm nhạc', 'Mỹ thuật', 'GDCD']
const DEPARTMENTS: Record<string, string> = {
  'Toán': 'Tổ Toán',
  'Vật lý': 'Tổ Lý-Hóa-Sinh',
  'Hóa học': 'Tổ Lý-Hóa-Sinh',
  'Sinh học': 'Tổ Lý-Hóa-Sinh',
  'Ngữ văn': 'Tổ Văn-Sử-Địa',
  'Lịch sử': 'Tổ Văn-Sử-Địa',
  'Địa lý': 'Tổ Văn-Sử-Địa',
  'Tiếng Anh': 'Tổ Ngoại ngữ',
  'Tin học': 'Tổ Tin học',
  'Thể dục': 'Tổ Thể chất',
  'Âm nhạc': 'Tổ Nghệ thuật',
  'Mỹ thuật': 'Tổ Nghệ thuật',
  'GDCD': 'Tổ GDCD',
}

function getInitials(name: string) {
  return name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
}

function TeacherDrawer({ teacher, open, onClose }: { teacher: Teacher | null; open: boolean; onClose: () => void }) {
  if (!teacher) return null
  const dept = DEPARTMENTS[teacher.subject] ?? 'Chưa phân tổ'
  const homeroomClass = teacher.homeroom ?? '—'

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-0">
          <SheetTitle>Hồ sơ giáo viên</SheetTitle>
          <SheetDescription>Thông tin chi tiết giáo viên</SheetDescription>
        </SheetHeader>

        {/* Avatar header */}
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-16 w-16 text-xl">
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(teacher.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{teacher.name}</h3>
            <p className="text-sm text-muted-foreground">{teacher.subject} · {dept}</p>
            <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className="mt-1">
              {teacher.status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="canhan" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="canhan" className="flex-1">Cá nhân</TabsTrigger>
            <TabsTrigger value="congtac" className="flex-1">Công tác</TabsTrigger>
            <TabsTrigger value="taikhoan" className="flex-1">Tài khoản</TabsTrigger>
          </TabsList>

          <TabsContent value="canhan" className="mt-4 space-y-3">
            <InfoRow icon={<Users className="h-4 w-4" />} label="Họ và tên" value={teacher.name} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={teacher.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Số điện thoại" value={teacher.phone} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Năm vào trường" value={String(teacher.joinYear)} />
          </TabsContent>

          <TabsContent value="congtac" className="mt-4 space-y-3">
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Môn dạy" value={teacher.subject} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Tổ bộ môn" value={dept} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Chủ nhiệm lớp" value={homeroomClass} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Năm công tác" value={`${new Date().getFullYear() - teacher.joinYear} năm`} />
          </TabsContent>

          <TabsContent value="taikhoan" className="mt-4 space-y-3">
            <InfoRow icon={<Users className="h-4 w-4" />} label="Tên đăng nhập" value={teacher.email.split('@')[0] ?? teacher.email} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Lần đăng nhập cuối" value="Hôm nay, 07:15" />
            <div className="pt-2">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => toast.success('Đã gửi email reset mật khẩu')}>
                <KeyRound className="h-4 w-4" />
                Reset mật khẩu
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function TeacherFormDialog({
  open, onClose, teacher,
}: { open: boolean; onClose: () => void; teacher: Teacher | null }) {
  const queryClient = useQueryClient()
  const isEdit = !!teacher

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 600))
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Đã cập nhật giáo viên!' : 'Đã thêm giáo viên mới!')
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
      onClose()
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa thông tin giáo viên' : 'Thêm giáo viên mới'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Họ và tên</Label>
            <Input defaultValue={teacher?.name} placeholder="Nguyễn Thị Lan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue={teacher?.email} placeholder="gv@quochoc.edu.vn" />
            </div>
            <div className="space-y-1.5">
              <Label>Số điện thoại</Label>
              <Input defaultValue={teacher?.phone} placeholder="0901234567" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Môn dạy</Label>
              <Select defaultValue={teacher?.subject}>
                <SelectTrigger><SelectValue placeholder="Chọn môn" /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Năm vào trường</Label>
              <Input type="number" defaultValue={teacher?.joinYear} placeholder="2020" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Trạng thái</Label>
            <Select defaultValue={teacher?.status ?? 'active'}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TeachersPage() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null)
  const [selectedRows, setSelectedRows] = useState<Teacher[]>([])

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'teachers', search, subjectFilter, statusFilter],
    queryFn: () => adminMockApi.getTeachers({
      search: search || undefined,
      subject: subjectFilter !== 'all' ? subjectFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
  })

  const teachers = data?.data ?? []
  const total = data?.total ?? 0

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => { await new Promise(r => setTimeout(r, 400)) },
    onSuccess: () => {
      toast.success('Đã xóa giáo viên')
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const handleBulkActivate = useCallback(() => {
    toast.success(`Đã kích hoạt ${selectedRows.length} giáo viên`)
    setSelectedRows([])
  }, [selectedRows])

  const handleBulkDeactivate = useCallback(() => {
    toast.success(`Đã vô hiệu hóa ${selectedRows.length} giáo viên`)
    setSelectedRows([])
  }, [selectedRows])

  const handleBulkDelete = useCallback(() => {
    toast.success(`Đã xóa ${selectedRows.length} giáo viên`)
    setSelectedRows([])
  }, [selectedRows])

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: 'name',
      header: 'Giáo viên',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Môn dạy',
      cell: ({ row }) => <Badge variant="outline">{row.original.subject}</Badge>,
    },
    {
      accessorKey: 'phone',
      header: 'Điện thoại',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone}</span>,
    },
    {
      accessorKey: 'joinYear',
      header: 'Năm vào trường',
      cell: ({ row }) => <span className="text-sm">{row.original.joinYear}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"
            onClick={() => { setSelectedTeacher(row.original); setDrawerOpen(true) }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"
            onClick={() => { setEditTeacher(row.original); setFormOpen(true) }}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive hover:text-destructive"
            onClick={() => deleteMutation.mutate(row.original.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Giáo viên</h1>
          <Badge variant="secondary">{total} giáo viên</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Chức năng import đang phát triển')}>
            <Upload className="h-4 w-4" /> Import Excel
          </Button>
          <Button size="sm" className="gap-2 cursor-pointer" onClick={() => { setEditTeacher(null); setFormOpen(true) }}>
            <UserPlus className="h-4 w-4" /> Thêm giáo viên
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm giáo viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={v => v && setSubjectFilter(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tổ bộ môn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn</SelectItem>
            {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={teachers}
        columns={columns}
        loading={isLoading}
        selectable
        onSelectionChange={setSelectedRows}
        searchable={false}
        emptyState={
          <EmptyState
            title="Không tìm thấy giáo viên"
            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            icon={<Users className="h-12 w-12" />}
            action={{ label: 'Thêm giáo viên', onClick: () => { setEditTeacher(null); setFormOpen(true) } }}
          />
        }
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.length}
        totalCount={teachers.length}
        onClearSelection={() => setSelectedRows([])}
        actions={[
          { label: 'Kích hoạt', icon: CheckCircle, onClick: handleBulkActivate },
          { label: 'Vô hiệu hóa', icon: XCircle, onClick: handleBulkDeactivate, variant: 'outline' },
          { label: 'Xóa', icon: Trash2, onClick: handleBulkDelete, variant: 'destructive' },
        ]}
      />

      {/* Teacher Detail Drawer */}
      <TeacherDrawer
        teacher={selectedTeacher}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Form Dialog */}
      <TeacherFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTeacher(null) }}
        teacher={editTeacher}
      />
    </div>
  )
}
