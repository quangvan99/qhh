'use client'

import { useQuery } from '@tanstack/react-query'
import { adminMockApi } from '@/lib/mock'
import { mockStudents } from '@/lib/mock/data'
import { HeatmapGrid } from '@/components/shared'
import { useClassStore } from '@/stores/class.store'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AlertTriangle, Users, TrendingDown, Clock, BookOpen } from 'lucide-react'
import { mockClasses } from '@/lib/mock/data'
import { teacherMockApi } from '@/lib/mock'
import { cn } from '@/lib/utils'

const MY_TEACHER_ID = 'gv-001'

// Mock score data per student
function mockScores(studentId: string) {
  const seed = parseInt(studentId.replace('hs-', ''), 10) || 1
  return {
    toan: parseFloat(((seed % 5) + 5.5).toFixed(1)),
    ly: parseFloat(((seed % 4) + 6.0).toFixed(1)),
    hoa: parseFloat(((seed % 6) + 4.5).toFixed(1)),
    van: parseFloat(((seed % 3) + 6.5).toFixed(1)),
    avg: parseFloat(((seed % 4) + 5.5).toFixed(1)),
  }
}

function StudentProfileSheet({
  studentId,
  open,
  onClose,
}: {
  studentId: string | null
  open: boolean
  onClose: () => void
}) {
  const student = mockStudents.find(s => s.id === studentId)
  if (!student) return null
  const scores = mockScores(student.id)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Hồ sơ học sinh</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10">
                {student.name.split(' ').map(n => n[0]).slice(-2).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.id}</p>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="mt-1 text-xs">
                {student.status === 'active' ? 'Đang học' : 'Nghỉ học'}
              </Badge>
            </div>
          </div>
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-sm font-medium">Điểm trung bình</p>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-muted-foreground">Toán:</span><span className="font-medium">{scores.toan}</span>
              <span className="text-muted-foreground">Vật lý:</span><span className="font-medium">{scores.ly}</span>
              <span className="text-muted-foreground">Hóa học:</span><span className="font-medium">{scores.hoa}</span>
              <span className="text-muted-foreground">Ngữ văn:</span><span className="font-medium">{scores.van}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">ĐTB:</span>
                <span className={cn('font-bold', scores.avg >= 7 ? 'text-green-600' : scores.avg >= 5 ? 'text-yellow-600' : 'text-red-600')}>
                  {scores.avg}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-3 space-y-1">
            <p className="text-sm font-medium">Thông tin khác</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Email: {student.email}</p>
              <p>ĐRL: {student.conductScore}</p>
              {student.scholarshipLevel && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  Học bổng {student.scholarshipLevel === 'loai1' ? 'loại 1' : 'loại 2'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function LopHocPage() {
  const { currentClassId } = useClassStore()
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const currentClass = mockClasses.find(c => c.id === currentClassId)
  const classStudents = mockStudents
    .filter(s => s.classId === currentClassId)
    .slice(0, 38)

  const { data: heatmapData, isLoading: loadingHeatmap } = useQuery({
    queryKey: ['gv', 'attendance-heatmap', currentClassId],
    queryFn: () => teacherMockApi.getAttendanceHeatmap(currentClassId ?? ''),
    enabled: !!currentClassId,
  })

  if (!currentClassId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chưa chọn lớp</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn lớp từ dropdown ở góc trên để xem thông tin</p>
      </div>
    )
  }

  // Mock alerts
  const absentAlerts = classStudents.filter((_, i) => i % 7 === 1).slice(0, 3)
  const lateAlerts = classStudents.filter((_, i) => i % 5 === 2).slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Lớp {currentClass?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {currentClass?.subject} · Phòng {currentClass?.room} · {classStudents.length} học sinh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {classStudents.length} HS
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="danh-sach">
        <TabsList>
          <TabsTrigger value="danh-sach">Danh sách HS</TabsTrigger>
          <TabsTrigger value="chuyen-can">Chuyên cần</TabsTrigger>
          <TabsTrigger value="ket-qua">Kết quả</TabsTrigger>
        </TabsList>

        {/* TAB DANH SÁCH */}
        <TabsContent value="danh-sach" className="mt-4">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-10">#</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Họ tên</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Mã HS</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">ĐRL</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Học bổng</th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Trạng thái</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {classStudents.map((student, i) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-[10px] bg-primary/10">
                            {student.name.split(' ').slice(-2).map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell font-mono text-xs">{student.id}</td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <span className={cn('font-medium', student.conductScore >= 80 ? 'text-green-600' : student.conductScore >= 65 ? 'text-yellow-600' : 'text-red-600')}>
                        {student.conductScore}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {student.scholarshipLevel === 'loai1' && <Badge className="bg-yellow-500 text-white text-[10px]">HB Loại 1</Badge>}
                      {student.scholarshipLevel === 'loai2' && <Badge className="bg-orange-400 text-white text-[10px]">HB Loại 2</Badge>}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                        {student.status === 'active' ? 'Đang học' : 'Nghỉ'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        Hồ sơ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB CHUYÊN CẦN */}
        <TabsContent value="chuyen-can" className="mt-4">
          <div className="grid lg:grid-cols-[1fr_280px] gap-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{absentAlerts.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Vắng nhiều nhất</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{classStudents.length - absentAlerts.length - lateAlerts.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Đi đúng giờ</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{lateAlerts.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Đi muộn</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-sm mb-3">Chuyên cần 20 ngày gần nhất</h3>
                {loadingHeatmap ? (
                  <Skeleton className="h-64 w-full" />
                ) : heatmapData ? (
                  <HeatmapGrid
                    rows={heatmapData.rows.map(r => ({ id: r.id, label: r.label.split(' ').slice(-1)[0] ?? r.label }))}
                    cols={heatmapData.cols.map(c => ({ id: c.id ?? '', label: c.label }))}
                    data={heatmapData.data.map(d => ({ ...d, colId: d.colId ?? '' }))}
                    mode="attendance"
                    cellSize="sm"
                    rowLabelWidth={80}
                    stickyFirstCol
                  />
                ) : null}
              </div>
            </div>

            {/* Smart Alert Sidebar */}
            <div className="space-y-3">
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                  <p className="text-xs font-semibold text-red-700">Vắng ≥ 3 buổi</p>
                </div>
                <div className="space-y-1.5">
                  {absentAlerts.map(s => (
                    <div key={s.id} className="text-xs flex items-center justify-between">
                      <span>{s.name}</span>
                      <Badge variant="destructive" className="text-[10px]">3+ vắng</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-3.5 w-3.5 text-yellow-600" />
                  <p className="text-xs font-semibold text-yellow-700">Muộn ≥ 5 buổi</p>
                </div>
                <div className="space-y-1.5">
                  {lateAlerts.map(s => (
                    <div key={s.id} className="text-xs flex items-center justify-between">
                      <span>{s.name}</span>
                      <Badge className="bg-yellow-500 text-white text-[10px]">5+ muộn</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB KẾT QUẢ */}
        <TabsContent value="ket-qua" className="mt-4">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Họ tên</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Toán</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Lý</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Hóa</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Văn</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">ĐTB</th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classStudents.slice(0, 20).map(student => {
                  const scores = mockScores(student.id)
                  const rank = scores.avg >= 8 ? 'Giỏi' : scores.avg >= 6.5 ? 'Khá' : scores.avg >= 5 ? 'TB' : 'Yếu'
                  const rankColor = scores.avg >= 8 ? 'text-green-600' : scores.avg >= 6.5 ? 'text-blue-600' : scores.avg >= 5 ? 'text-yellow-600' : 'text-red-600'
                  return (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2">{student.name}</td>
                      <td className="px-3 py-2 text-center">{scores.toan}</td>
                      <td className="px-3 py-2 text-center hidden sm:table-cell">{scores.ly}</td>
                      <td className="px-3 py-2 text-center hidden md:table-cell">{scores.hoa}</td>
                      <td className="px-3 py-2 text-center hidden md:table-cell">{scores.van}</td>
                      <td className="px-3 py-2 text-center font-bold">{scores.avg}</td>
                      <td className={cn('px-3 py-2 text-center font-medium text-xs', rankColor)}>{rank}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <StudentProfileSheet
        studentId={selectedStudent}
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  )
}
