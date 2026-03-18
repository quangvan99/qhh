'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { mockTeachers, mockClasses } from '@/lib/mock/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Building2, Users, ChevronRight, Settings, Calendar, BookOpen,
  Plus, Edit, CheckCircle, AlertTriangle, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Department data
const departments = [
  { id: 'to-toan', name: 'Tổ Toán', subjects: ['Toán'], headId: 'gv-025', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { id: 'to-ly-hoa-sinh', name: 'Tổ Lý-Hóa-Sinh', subjects: ['Vật lý', 'Hóa học', 'Sinh học'], headId: 'gv-002', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { id: 'to-van-su-dia', name: 'Tổ Văn-Sử-Địa', subjects: ['Ngữ văn', 'Lịch sử', 'Địa lý'], headId: 'gv-004', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  { id: 'to-ngoai-ngu', name: 'Tổ Ngoại ngữ', subjects: ['Tiếng Anh'], headId: 'gv-007', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  { id: 'to-tin-hoc', name: 'Tổ Tin học', subjects: ['Tin học'], headId: 'gv-033', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
  { id: 'to-the-duc', name: 'Tổ Thể dục - Nghệ thuật', subjects: ['Thể dục', 'Âm nhạc', 'Mỹ thuật'], headId: 'gv-034', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
  { id: 'to-gdcd', name: 'Tổ GDCD', subjects: ['GDCD'], headId: 'gv-037', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
]

const schoolYears = [
  { id: 'sy-2024', year: '2024-2025', status: 'active', startDate: '05/09/2024', endDate: '31/05/2025', sem1End: '18/01/2025' },
  { id: 'sy-2023', year: '2023-2024', status: 'completed', startDate: '05/09/2023', endDate: '31/05/2024', sem1End: '13/01/2024' },
  { id: 'sy-2022', year: '2022-2023', status: 'completed', startDate: '05/09/2022', endDate: '31/05/2023', sem1End: '14/01/2023' },
]

const rooms = [
  { id: 'r-p201', name: 'P201', capacity: 40, building: 'Tòa A', floor: 2, status: 'available', type: 'Lớp học' },
  { id: 'r-p202', name: 'P202', capacity: 40, building: 'Tòa A', floor: 2, status: 'occupied', type: 'Lớp học' },
  { id: 'r-p203', name: 'P203', capacity: 40, building: 'Tòa A', floor: 2, status: 'available', type: 'Lớp học' },
  { id: 'r-p101', name: 'P101', capacity: 25, building: 'Tòa A', floor: 1, status: 'maintenance', type: 'Phòng máy tính' },
  { id: 'r-p102', name: 'P102', capacity: 30, building: 'Tòa A', floor: 1, status: 'available', type: 'Phòng thí nghiệm' },
  { id: 'r-hle', name: 'HLĐ', capacity: 500, building: 'Hội trường', floor: 1, status: 'available', type: 'Hội trường' },
  { id: 'r-tv', name: 'Thư viện', capacity: 80, building: 'Tòa B', floor: 1, status: 'available', type: 'Thư viện' },
  { id: 'r-gym', name: 'Phòng thể chất', capacity: 100, building: 'Khu thể thao', floor: 1, status: 'available', type: 'Thể thao' },
]

function DepartmentCard({ dept }: { dept: typeof departments[number] }) {
  const head = mockTeachers.find(t => t.id === dept.headId)
  const members = mockTeachers.filter(t => dept.subjects.includes(t.subject))

  return (
    <div className="rounded-xl border bg-card p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', dept.color)}>
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{dept.name}</h3>
            <p className="text-xs text-muted-foreground">{dept.subjects.join(', ')}</p>
          </div>
        </div>
        <Badge variant="secondary">{members.length} GV</Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tổ trưởng:</span>
          <span className="text-xs font-medium">{head?.name ?? '—'}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {members.slice(0, 4).map(m => (
            <Badge key={m.id} variant="outline" className="text-xs">{m.name.split(' ').pop()}</Badge>
          ))}
          {members.length > 4 && <Badge variant="outline" className="text-xs">+{members.length - 4}</Badge>}
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full gap-2 cursor-pointer text-xs"
        onClick={() => toast.info(`Xem chi tiết tổ ${dept.name}`)}>
        Xem chi tiết <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

function RoomStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    available: { label: 'Trống', className: 'bg-green-100 text-green-700' },
    occupied: { label: 'Đang dùng', className: 'bg-orange-100 text-orange-700' },
    maintenance: { label: 'Bảo trì', className: 'bg-red-100 text-red-700' },
  }
  const v = (variants[status] ?? variants.available)!
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', v.className)}>{v.label}</span>
}

export default function SchoolStructurePage() {
  const [schoolName, setSchoolName] = useState('THPT Quốc Học Huế')
  const [schoolYear, setSchoolYear] = useState('2024-2025')
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Cơ cấu trường</h1>
        <p className="text-sm text-muted-foreground">Quản lý tổ bộ môn, năm học, phòng học và thông tin nhà trường</p>
      </div>

      <Tabs defaultValue="toboomon">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="toboomon">Tổ bộ môn</TabsTrigger>
          <TabsTrigger value="namhoc">Năm học</TabsTrigger>
          <TabsTrigger value="phonghoc">Phòng học</TabsTrigger>
          <TabsTrigger value="thongtin">Thông tin trường</TabsTrigger>
        </TabsList>

        {/* Tổ bộ môn */}
        <TabsContent value="toboomon" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Danh sách tổ bộ môn</h2>
              <Badge variant="secondary">{departments.length} tổ</Badge>
            </div>
            <Button size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Thêm tổ bộ môn')}>
              <Plus className="h-4 w-4" /> Thêm tổ
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map(d => <DepartmentCard key={d.id} dept={d} />)}
          </div>
        </TabsContent>

        {/* Năm học */}
        <TabsContent value="namhoc" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Năm học</h2>
            <Button size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Thêm năm học')}>
              <Plus className="h-4 w-4" /> Năm học mới
            </Button>
          </div>
          <div className="space-y-3">
            {schoolYears.map(sy => (
              <div key={sy.id} className={cn(
                'flex items-center gap-4 rounded-xl border p-4',
                sy.status === 'active' && 'border-primary bg-primary/5'
              )}>
                <div className="flex items-center gap-3">
                  {sy.status === 'active' ? (
                    <div className="rounded-lg bg-green-100 p-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted p-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">Năm học {sy.year}</h3>
                    <p className="text-xs text-muted-foreground">
                      {sy.startDate} → {sy.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-auto text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Kết thúc HK1</p>
                    <p className="text-xs font-medium">{sy.sem1End}</p>
                  </div>
                  {sy.status === 'active' && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đang diễn ra</Badge>
                  )}
                  {sy.status === 'completed' && (
                    <Badge variant="secondary">Đã kết thúc</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Phòng học */}
        <TabsContent value="phonghoc" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Danh sách phòng</h2>
              <Badge variant="secondary">{rooms.length} phòng</Badge>
            </div>
            <Button size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Thêm phòng học')}>
              <Plus className="h-4 w-4" /> Thêm phòng
            </Button>
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tòa nhà</TableHead>
                  <TableHead>Tầng</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{room.type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{room.building}</TableCell>
                    <TableCell className="text-sm">{room.floor}</TableCell>
                    <TableCell className="text-sm">{room.capacity} người</TableCell>
                    <TableCell><RoomStatusBadge status={room.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 cursor-pointer" onClick={() => toast.info(`Sửa phòng ${room.name}`)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Thông tin trường */}
        <TabsContent value="thongtin" className="mt-6">
          <div className="max-w-lg space-y-6">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Thông tin cơ bản
              </h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Tên trường</Label>
                  <Input value={schoolName} onChange={e => setSchoolName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Năm học hiện tại</Label>
                  <Input value={schoolYear} onChange={e => setSchoolYear(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Địa chỉ</Label>
                  <Input defaultValue="12 Lê Lợi, TP. Huế, Thừa Thiên-Huế" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email liên hệ</Label>
                  <Input defaultValue="contact@quochoc.edu.vn" />
                </div>
                <div className="space-y-1.5">
                  <Label>Số điện thoại</Label>
                  <Input defaultValue="0234 3822 870" />
                </div>
              </div>
            </div>
            <Button
              className="cursor-pointer"
              onClick={async () => {
                setSaving(true)
                await new Promise(r => setTimeout(r, 600))
                setSaving(false)
                toast.success('Đã lưu thông tin trường')
              }}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
