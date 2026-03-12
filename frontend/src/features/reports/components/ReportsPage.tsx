'use client'

import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Users, Camera, GraduationCap, Library, Activity,
  Download, Filter,
} from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { StatGrid } from '@/components/patterns/stat-grid'
import { DataTable } from '@/components/patterns/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ExportModal } from './ExportModal'
import { ReportCard } from './ReportCard'
import { useReportData, useReportClasses, REPORT_META } from '../hooks'
import type {
  ReportType,
  ReportFilter,
  DateRange,
  StudentReportRow,
  AttendanceReportRow,
  LearningReportRow,
  LibraryReportRow,
  ActivityReportRow,
} from '../types'
import type { StatCardProps } from '@/components/composite/stat-card'

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="h-5 w-5" />,
  Camera: <Camera className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Library: <Library className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
}

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm nay' },
  { value: 'custom', label: 'Tuỳ chỉnh' },
]

// ── Column definitions ──

const studentColumns: ColumnDef<StudentReportRow, unknown>[] = [
  { accessorKey: 'code', header: 'Mã HS' },
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'className', header: 'Lớp' },
  {
    accessorKey: 'avgScore',
    header: 'Điểm TB',
    cell: ({ getValue }) => {
      const v = getValue() as number | null
      return v !== null ? v.toFixed(1) : '—'
    },
  },
  {
    accessorKey: 'rank',
    header: 'Xếp loại',
    cell: ({ getValue }) => {
      const rank = getValue() as string
      const colorMap: Record<string, string> = {
        'Giỏi': 'bg-emerald-100 text-emerald-700',
        'Khá': 'bg-blue-100 text-blue-700',
        'Trung bình': 'bg-amber-100 text-amber-700',
        'Yếu': 'bg-red-100 text-red-700',
      }
      return <Badge className={colorMap[rank] ?? ''}>{rank}</Badge>
    },
  },
  {
    accessorKey: 'attendance',
    header: 'Chuyên cần (%)',
    cell: ({ getValue }) => `${getValue()}%`,
  },
]

const attendanceColumns: ColumnDef<AttendanceReportRow, unknown>[] = [
  { accessorKey: 'date', header: 'Ngày' },
  { accessorKey: 'className', header: 'Lớp' },
  { accessorKey: 'total', header: 'Sĩ số' },
  { accessorKey: 'present', header: 'Có mặt' },
  { accessorKey: 'absent', header: 'Vắng' },
  {
    accessorKey: 'rate',
    header: 'Tỷ lệ (%)',
    cell: ({ getValue }) => `${getValue()}%`,
  },
]

const learningColumns: ColumnDef<LearningReportRow, unknown>[] = [
  { accessorKey: 'studentCode', header: 'Mã HS' },
  { accessorKey: 'studentName', header: 'Họ tên' },
  { accessorKey: 'className', header: 'Lớp' },
  { accessorKey: 'subject', header: 'Môn' },
  {
    accessorKey: 'assignmentAvg',
    header: 'TB bài tập',
    cell: ({ getValue }) => {
      const v = getValue() as number | null
      return v !== null ? v.toFixed(1) : '—'
    },
  },
  {
    accessorKey: 'examScore',
    header: 'Điểm thi',
    cell: ({ getValue }) => {
      const v = getValue() as number | null
      return v !== null ? v.toFixed(1) : '—'
    },
  },
  {
    accessorKey: 'finalScore',
    header: 'Tổng kết',
    cell: ({ getValue }) => {
      const v = getValue() as number | null
      return v !== null ? v.toFixed(1) : '—'
    },
  },
]

const libraryColumns: ColumnDef<LibraryReportRow, unknown>[] = [
  { accessorKey: 'bookTitle', header: 'Tên sách' },
  { accessorKey: 'category', header: 'Danh mục' },
  { accessorKey: 'borrowCount', header: 'Lượt mượn' },
  { accessorKey: 'returnedCount', header: 'Đã trả' },
  {
    accessorKey: 'overdueCount',
    header: 'Quá hạn',
    cell: ({ getValue }) => {
      const v = getValue() as number
      return v > 0 ? <span className="text-red-600 font-medium">{v}</span> : '0'
    },
  },
]

const activityColumns: ColumnDef<ActivityReportRow, unknown>[] = [
  { accessorKey: 'userName', header: 'Người dùng' },
  { accessorKey: 'action', header: 'Hành động' },
  { accessorKey: 'detail', header: 'Chi tiết' },
  { accessorKey: 'module', header: 'Module' },
  {
    accessorKey: 'timestamp',
    header: 'Thời gian',
    cell: ({ getValue }) => {
      const d = new Date(getValue() as string)
      return `${d.toLocaleDateString('vi')} ${d.toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' })}`
    },
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COLUMNS_MAP: Record<ReportType, ColumnDef<any, unknown>[]> = {
  students: studentColumns,
  attendance: attendanceColumns,
  learning: learningColumns,
  library: libraryColumns,
  activity: activityColumns,
}

// ── Stats helpers ──
function getStudentStats(data: StudentReportRow[]): StatCardProps[] {
  const total = data.length
  const avgScore = total ? +(data.reduce((s, r) => s + (r.avgScore ?? 0), 0) / total).toFixed(1) : 0
  const avgAttendance = total ? +(data.reduce((s, r) => s + r.attendance, 0) / total).toFixed(1) : 0
  return [
    { title: 'Tổng học sinh', value: total, icon: <Users className="h-5 w-5" />, module: 'lms' },
    { title: 'Điểm TB chung', value: avgScore, icon: <GraduationCap className="h-5 w-5" />, module: 'lms' },
    { title: 'Chuyên cần TB', value: avgAttendance, unit: '%', icon: <Camera className="h-5 w-5" />, module: 'ai' },
  ]
}

function getAttendanceStats(data: AttendanceReportRow[]): StatCardProps[] {
  const totalRecords = data.length
  const avgRate = totalRecords ? +(data.reduce((s, r) => s + r.rate, 0) / totalRecords).toFixed(1) : 0
  const totalAbsent = data.reduce((s, r) => s + r.absent, 0)
  return [
    { title: 'Số bản ghi', value: totalRecords, icon: <Camera className="h-5 w-5" />, module: 'ai' },
    { title: 'Tỷ lệ TB', value: avgRate, unit: '%', icon: <Camera className="h-5 w-5" />, module: 'ai' },
    { title: 'Tổng vắng', value: totalAbsent, icon: <Users className="h-5 w-5" />, module: 'exam' },
  ]
}

function getLearningStats(data: LearningReportRow[]): StatCardProps[] {
  const total = data.length
  const avgFinal = total ? +(data.reduce((s, r) => s + (r.finalScore ?? 0), 0) / total).toFixed(1) : 0
  const passCount = data.filter((r) => (r.finalScore ?? 0) >= 5).length
  return [
    { title: 'Tổng bản ghi', value: total, icon: <GraduationCap className="h-5 w-5" />, module: 'lms' },
    { title: 'Điểm TK TB', value: avgFinal, icon: <GraduationCap className="h-5 w-5" />, module: 'lms' },
    { title: 'Đạt yêu cầu', value: passCount, icon: <Users className="h-5 w-5" />, module: 'lms' },
  ]
}

function getLibraryStats(data: LibraryReportRow[]): StatCardProps[] {
  const totalBorrow = data.reduce((s, r) => s + r.borrowCount, 0)
  const totalOverdue = data.reduce((s, r) => s + r.overdueCount, 0)
  const totalBooks = data.length
  return [
    { title: 'Tổng đầu sách', value: totalBooks, icon: <Library className="h-5 w-5" />, module: 'library' },
    { title: 'Tổng lượt mượn', value: totalBorrow, icon: <Library className="h-5 w-5" />, module: 'library' },
    { title: 'Đang quá hạn', value: totalOverdue, icon: <Library className="h-5 w-5" />, module: 'library' },
  ]
}

function getActivityStats(data: ActivityReportRow[]): StatCardProps[] {
  const total = data.length
  const modules = new Set(data.map((r) => r.module))
  const users = new Set(data.map((r) => r.userName))
  return [
    { title: 'Tổng hoạt động', value: total, icon: <Activity className="h-5 w-5" />, module: 'admin' },
    { title: 'Số module', value: modules.size, icon: <Activity className="h-5 w-5" />, module: 'admin' },
    { title: 'Số người dùng', value: users.size, icon: <Users className="h-5 w-5" />, module: 'admin' },
  ]
}

const STATS_FN: Record<ReportType, (data: never[]) => StatCardProps[]> = {
  students: getStudentStats as (data: never[]) => StatCardProps[],
  attendance: getAttendanceStats as (data: never[]) => StatCardProps[],
  learning: getLearningStats as (data: never[]) => StatCardProps[],
  library: getLibraryStats as (data: never[]) => StatCardProps[],
  activity: getActivityStats as (data: never[]) => StatCardProps[],
}

// ── Main component ──
export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>('students')
  const [filter, setFilter] = useState<ReportFilter>({ dateRange: 'month' })
  const [pendingFilter, setPendingFilter] = useState<ReportFilter>({ dateRange: 'month' })
  const [exportOpen, setExportOpen] = useState(false)

  const { data: classes } = useReportClasses()
  const { data: reportData, isLoading } = useReportData(activeTab, filter)

  const currentMeta = REPORT_META.find((m) => m.id === activeTab)!

  const stats = useMemo(() => {
    if (!reportData) return []
    const fn = STATS_FN[activeTab]
    return fn(reportData as never[])
  }, [reportData, activeTab])

  const handleApplyFilter = () => {
    setFilter({ ...pendingFilter })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Xuất báo cáo"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Báo cáo' },
        ]}
      />

      {/* Filter Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Khoảng thời gian</Label>
              <Select
                value={pendingFilter.dateRange}
                onValueChange={(v) => setPendingFilter((p) => ({ ...p, dateRange: v as DateRange }))}
              >
                <SelectTrigger className="w-[160px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {pendingFilter.dateRange === 'custom' && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm">Từ ngày</Label>
                  <Input
                    type="date"
                    value={pendingFilter.dateFrom ?? ''}
                    onChange={(e) => setPendingFilter((p) => ({ ...p, dateFrom: e.target.value }))}
                    className="w-[160px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Đến ngày</Label>
                  <Input
                    type="date"
                    value={pendingFilter.dateTo ?? ''}
                    onChange={(e) => setPendingFilter((p) => ({ ...p, dateTo: e.target.value }))}
                    className="w-[160px]"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm">Lớp</Label>
              <Select
                value={pendingFilter.classId ?? '__all'}
                onValueChange={(v) => setPendingFilter((p) => ({ ...p, classId: v === '__all' ? undefined : v as string }))}
              >
                <SelectTrigger className="w-[160px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all" className="cursor-pointer">Tất cả lớp</SelectItem>
                  {(classes ?? []).map((cls) => (
                    <SelectItem key={cls.id} value={cls.id} className="cursor-pointer">
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleApplyFilter} className="cursor-pointer">
              <Filter className="mr-2 h-4 w-4" />
              Áp dụng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {REPORT_META.map((meta) => (
          <ReportCard
            key={meta.id}
            meta={meta}
            onSelect={() => setActiveTab(meta.id)}
            onExport={() => {
              setActiveTab(meta.id)
              setExportOpen(true)
            }}
          />
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReportType)}>
        <TabsList>
          {REPORT_META.map((meta) => (
            <TabsTrigger key={meta.id} value={meta.id} className="cursor-pointer gap-1.5">
              {ICON_MAP[meta.icon] && <span className="hidden sm:inline-flex">{ICON_MAP[meta.icon]}</span>}
              {meta.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {REPORT_META.map((meta) => (
          <TabsContent key={meta.id} value={meta.id}>
            <div className="space-y-4">
              {/* Summary stats */}
              <StatGrid stats={stats} cols={3} />

              {/* Data table */}
              <DataTable
                data={((reportData ?? []) as unknown as Record<string, unknown>[])}
                columns={COLUMNS_MAP[meta.id]}
                loading={isLoading}
                searchable
                searchPlaceholder={`Tìm trong báo cáo ${meta.title.toLowerCase()}...`}
                onExport={() => setExportOpen(true)}
              />

              {/* Export button */}
              <div className="flex justify-end">
                <Button onClick={() => setExportOpen(true)} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo này
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        reportTitle={currentMeta.title}
        data={(reportData ?? []) as unknown as Record<string, unknown>[]}
      />
    </div>
  )
}
