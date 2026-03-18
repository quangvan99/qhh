'use client'

import { useState } from 'react'
import { mockClasses } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  BarChart3, TrendingUp, Trophy, Library, Calendar,
  Download, FileText, Filter, ChevronRight,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'

// Mock report data
const attendanceWeekData = [
  { day: 'Thứ 2', present: 895, absent: 65, rate: 93.2 },
  { day: 'Thứ 3', present: 910, absent: 50, rate: 94.8 },
  { day: 'Thứ 4', present: 872, absent: 88, rate: 90.8 },
  { day: 'Thứ 5', present: 930, absent: 30, rate: 96.9 },
  { day: 'Thứ 6', present: 842, absent: 118, rate: 87.7 },
]

const learningProgressData = [
  { month: 'T9', avgProgress: 20 },
  { month: 'T10', avgProgress: 38 },
  { month: 'T11', avgProgress: 52 },
  { month: 'T12', avgProgress: 67 },
  { month: 'T1', avgProgress: 78 },
  { month: 'T2', avgProgress: 85 },
]

const examResultsData = [
  { subject: 'Toán', avg: 7.8, highest: 10, lowest: 4.5 },
  { subject: 'Vật lý', avg: 7.2, highest: 9.5, lowest: 4.0 },
  { subject: 'Hóa học', avg: 8.1, highest: 10, lowest: 5.0 },
  { subject: 'Ngữ văn', avg: 7.5, highest: 9.0, lowest: 5.5 },
  { subject: 'Tiếng Anh', avg: 8.3, highest: 10, lowest: 5.0 },
]

const libraryData = [
  { category: 'Toán học', borrows: 45 },
  { category: 'Vật lý', borrows: 32 },
  { category: 'Văn học', borrows: 28 },
  { category: 'Ngoại ngữ', borrows: 38 },
  { category: 'Hóa học', borrows: 25 },
  { category: 'Khác', borrows: 42 },
]

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

const reportTemplates = [
  {
    id: 'attendance',
    icon: BarChart3,
    label: 'Điểm danh tuần này',
    description: 'Thống kê điểm danh theo ngày và lớp',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 'progress',
    icon: TrendingUp,
    label: 'Tiến độ học tập',
    description: 'Theo dõi tiến độ hoàn thành chương trình',
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 'exams',
    icon: Trophy,
    label: 'Kết quả thi',
    description: 'Phân tích điểm thi theo môn và lớp',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    id: 'library',
    icon: Library,
    label: 'Thư viện tháng này',
    description: 'Báo cáo mượn trả sách và thể loại phổ biến',
    color: 'text-orange-600 bg-orange-100',
  },
]

function AttendanceReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Tỷ lệ TB tuần" value="92.7%" color="text-green-600" />
        <SummaryCard label="Ngày cao nhất" value="Thứ 5 (96.9%)" color="text-blue-600" />
        <SummaryCard label="Ngày thấp nhất" value="Thứ 6 (87.7%)" color="text-orange-600" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-medium mb-4 text-sm">Điểm danh theo ngày</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={attendanceWeekData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar yAxisId="left" dataKey="present" name="Có mặt" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="left" dataKey="absent" name="Vắng" fill="#ef4444" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#6366f1" dot={false} name="Tỷ lệ %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <AttendanceSummaryTable />
    </div>
  )
}

function AttendanceSummaryTable() {
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Ngày</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Có mặt</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Vắng</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Tỷ lệ</th>
          </tr>
        </thead>
        <tbody>
          {attendanceWeekData.map(d => (
            <tr key={d.day} className="border-t">
              <td className="px-4 py-2 font-medium">{d.day}</td>
              <td className="px-4 py-2 text-right text-green-600">{d.present}</td>
              <td className="px-4 py-2 text-right text-red-500">{d.absent}</td>
              <td className="px-4 py-2 text-right font-medium">{d.rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProgressReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Tiến độ hiện tại" value="78%" color="text-blue-600" />
        <SummaryCard label="Tăng so với tháng trước" value="+11%" color="text-green-600" />
        <SummaryCard label="Dự kiến hoàn thành" value="Tháng 5/2025" color="text-purple-600" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-medium mb-4 text-sm">Tiến độ hoàn thành chương trình</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={learningProgressData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip formatter={(v) => [String(v) + '%', 'Tiến độ TB']} />
            <Line type="monotone" dataKey="avgProgress" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Tiến độ TB" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ExamsReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Điểm TB toàn trường" value="7.78" color="text-blue-600" />
        <SummaryCard label="Môn điểm cao nhất" value="Hóa học (8.1)" color="text-green-600" />
        <SummaryCard label="Kỳ thi đã tổ chức" value="5" color="text-purple-600" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-medium mb-4 text-sm">Điểm TB theo môn</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={examResultsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="avg" name="Điểm TB" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function LibraryReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Tổng lượt mượn" value="210" color="text-blue-600" />
        <SummaryCard label="Sách quá hạn" value="5" color="text-red-600" />
        <SummaryCard label="Thể loại phổ biến" value="Toán học" color="text-green-600" />
      </div>
      <div className="flex gap-6">
        <div className="flex-1 rounded-xl border bg-card p-4">
          <h3 className="font-medium mb-4 text-sm">Lượt mượn theo thể loại</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={libraryData} dataKey="borrows" cx="50%" cy="50%" outerRadius={90} paddingAngle={2}>
                {libraryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [String(v) + ' lượt', n as string]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <p className={cn('text-xl font-bold', color)}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

export default function ReportPage() {
  const [activeReport, setActiveReport] = useState('attendance')

  const renderReport = () => {
    switch (activeReport) {
      case 'attendance': return <AttendanceReport />
      case 'progress': return <ProgressReport />
      case 'exams': return <ExamsReport />
      case 'library': return <LibraryReport />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo cáo</h1>
        <p className="text-sm text-muted-foreground">Phân tích và xuất báo cáo hệ thống</p>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar - report templates */}
        <div className="w-60 shrink-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-3 mb-2">Mẫu báo cáo</p>
          {reportTemplates.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setActiveReport(t.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                  activeReport === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <div className={cn('rounded-lg p-1.5 shrink-0', activeReport === t.id ? 'bg-primary-foreground/20' : t.color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-medium truncate', activeReport === t.id ? 'text-primary-foreground' : 'text-foreground')}>{t.label}</p>
                  <p className={cn('text-[10px] truncate', activeReport === t.id ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{t.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filter bar + export */}
          <div className="flex items-center gap-3 flex-wrap">
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tất cả lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {mockClasses.slice(0, 8).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tuần này" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="semester">Học kỳ 1</SelectItem>
                <SelectItem value="year">Năm học</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer"
                onClick={() => toast.info('Đang xuất Excel...')}>
                <Download className="h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer"
                onClick={() => toast.info('Đang tạo PDF...')}>
                <FileText className="h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          {/* Report content */}
          {renderReport()}
        </div>
      </div>
    </div>
  )
}
