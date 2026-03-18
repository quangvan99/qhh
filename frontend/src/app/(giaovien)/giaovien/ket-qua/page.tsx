'use client'

import { useQuery } from '@tanstack/react-query'
import { teacherMockApi } from '@/lib/mock'
import { mockStudents } from '@/lib/mock/data'
import { HeatmapGrid } from '@/components/shared'
import { useClassStore } from '@/stores/class.store'
import { toast } from 'sonner'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart2, AlertTriangle, TrendingUp, MessageCircle, Download, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ScoreData = {
  studentId: string
  name: string
  kt1: number | null
  kt2: number | null
  kt3: number | null
  giuaKy: number | null
  cuoiKy: number | null
  avg: number | null
}

function calcAvg(scores: (number | null)[]) {
  const valid = scores.filter(s => s !== null) as number[]
  if (valid.length === 0) return null
  return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1))
}

function getRank(avg: number | null) {
  if (avg === null) return '—'
  if (avg >= 8.5) return 'Giỏi'
  if (avg >= 6.5) return 'Khá'
  if (avg >= 5) return 'TB'
  return 'Yếu'
}

function getRankColor(avg: number | null) {
  if (avg === null) return 'text-muted-foreground'
  if (avg >= 8.5) return 'text-green-600'
  if (avg >= 6.5) return 'text-blue-600'
  if (avg >= 5) return 'text-yellow-600'
  return 'text-red-600'
}

// Generate mock scores for a student
function generateScores(studentId: string): ScoreData {
  const seed = parseInt(studentId.replace('hs-', ''), 10)
  const base = 4 + (seed % 6)
  function s(offset: number) {
    return Math.min(10, Math.max(0, parseFloat((base + offset + (seed % 3) * 0.5).toFixed(1))))
  }
  const kt1 = s(0)
  const kt2 = s(0.5)
  const kt3 = seed % 5 === 0 ? null : s(-0.5)
  const giuaKy = s(0.5)
  const cuoiKy = seed % 7 === 0 ? null : s(1)

  const scores = [kt1, kt2, kt3, giuaKy, cuoiKy]
  const avg = calcAvg(scores)
  return { studentId, name: '', kt1, kt2, kt3, giuaKy, cuoiKy, avg }
}

function EditableCell({ value, onSave }: { value: number | null; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')

  if (editing) {
    return (
      <input
        type="number"
        min={0}
        max={10}
        step={0.5}
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={() => {
          const n = parseFloat(val)
          if (!isNaN(n)) onSave(Math.min(10, Math.max(0, n)))
          setEditing(false)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') { const n = parseFloat(val); if (!isNaN(n)) onSave(n); setEditing(false) }
          if (e.key === 'Escape') setEditing(false)
        }}
        className="w-14 h-6 text-center text-xs border rounded bg-blue-50 dark:bg-blue-950/30 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    )
  }

  return (
    <button
      onClick={() => { setEditing(true); setVal(value?.toString() ?? '') }}
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium min-w-[2.5rem] text-center transition-colors hover:bg-muted',
        value === null ? 'text-muted-foreground' : ''
      )}
    >
      {value ?? '—'}
    </button>
  )
}

// Simple sparkline component
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 80, h = 28
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  const trend = (values[values.length - 1] ?? 0) - (values[0] ?? 0)

  return (
    <div className="flex items-center gap-1.5">
      <svg width={w} height={h} className="shrink-0">
        <polyline points={points} fill="none" stroke={trend >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
        {values.map((v, i) => {
          const x = (i / (values.length - 1)) * w
          const y = h - ((v - min) / range) * (h - 4) - 2
          return <circle key={i} cx={x} cy={y} r="2" fill={trend >= 0 ? '#22c55e' : '#ef4444'} />
        })}
      </svg>
      <span className={cn('text-[10px] font-medium', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}
      </span>
    </div>
  )
}

export default function KetQuaPage() {
  const { currentClassId } = useClassStore()
  const [scoreData, setScoreData] = useState<Record<string, ScoreData>>({})

  const classStudents = mockStudents.filter(s => s.classId === currentClassId).slice(0, 25)

  const getScore = (studentId: string): ScoreData => {
    if (scoreData[studentId]) return scoreData[studentId]
    const generated = generateScores(studentId)
    const student = mockStudents.find(s => s.id === studentId)
    return { ...generated, name: student?.name ?? '' }
  }

  function updateScore(studentId: string, field: keyof ScoreData, value: number) {
    setScoreData(prev => {
      const existing = getScore(studentId)
      const updated = { ...existing, [field]: value }
      const scores = [updated.kt1, updated.kt2, updated.kt3, updated.giuaKy, updated.cuoiKy]
      updated.avg = calcAvg(scores)
      return { ...prev, [studentId]: updated }
    })
    toast.success(`Đã lưu điểm`)
  }

  const { data: heatmapData, isLoading: loadingHeatmap } = useQuery({
    queryKey: ['gv', 'heatmap', currentClassId],
    queryFn: () => teacherMockApi.getAttendanceHeatmap(currentClassId ?? ''),
    enabled: !!currentClassId,
  })

  if (!currentClassId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <BarChart2 className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chưa chọn lớp</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn lớp để xem kết quả</p>
      </div>
    )
  }

  const allScores = classStudents.map(s => getScore(s.id))
  const validAvgs = allScores.map(s => s.avg).filter(a => a !== null) as number[]
  const classAvg = validAvgs.length ? parseFloat((validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1)) : 0
  const passRate = validAvgs.length ? Math.round((validAvgs.filter(a => a >= 5).length / validAvgs.length) * 100) : 0
  const maxScore = validAvgs.length ? Math.max(...validAvgs) : 0
  const minScore = validAvgs.length ? Math.min(...validAvgs) : 0

  // Early warning groups
  const dangerous = allScores.filter(s => (s.avg ?? 10) < 5)
  const watching = allScores.filter(s => (s.avg ?? 0) >= 5 && (s.avg ?? 0) < 6.5)
  const good = allScores.filter(s => (s.avg ?? 0) >= 7)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Kết quả học tập</h1>
        <Button size="sm" variant="outline" onClick={() => toast.success('Đã xuất Excel')}>
          <Download className="h-4 w-4 mr-1.5" />
          Xuất Excel
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Điểm TB lớp', value: classAvg, color: 'text-blue-600' },
          { label: '% Đạt (≥5)', value: `${passRate}%`, color: passRate >= 90 ? 'text-green-600' : 'text-yellow-600' },
          { label: 'Cao nhất', value: maxScore, color: 'text-green-600' },
          { label: 'Thấp nhất', value: minScore, color: 'text-red-600' },
        ].map(card => (
          <div key={card.label} className="rounded-lg border bg-card p-3 text-center">
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="bang-diem">
        <TabsList>
          <TabsTrigger value="bang-diem">Bảng điểm</TabsTrigger>
          <TabsTrigger value="tien-do">Tiến độ E-learning</TabsTrigger>
          <TabsTrigger value="canh-bao" className="gap-1.5">
            Cảnh báo sớm
            {dangerous.length > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] h-4 px-1">{dangerous.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB BẢNG ĐIỂM */}
        <TabsContent value="bang-diem" className="mt-4">
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 sticky left-0 bg-background">#</TableHead>
                  <TableHead className="min-w-[160px] sticky left-8 bg-background">Họ tên</TableHead>
                  <TableHead className="text-center w-20">KT 1</TableHead>
                  <TableHead className="text-center w-20">KT 2</TableHead>
                  <TableHead className="text-center w-20">KT 3</TableHead>
                  <TableHead className="text-center w-24">Giữa kỳ</TableHead>
                  <TableHead className="text-center w-24">Cuối kỳ</TableHead>
                  <TableHead className="text-center w-20 font-bold">ĐTB</TableHead>
                  <TableHead className="text-center w-20">Xếp loại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student, i) => {
                  const scores = getScore(student.id)
                  const rank = getRank(scores.avg)
                  return (
                    <TableRow key={student.id} className={cn(scores.avg !== null && scores.avg < 5 && 'bg-red-50/50 dark:bg-red-950/10')}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium text-sm">{student.name}</TableCell>
                      <TableCell className="text-center p-1">
                        <EditableCell value={scores.kt1} onSave={v => updateScore(student.id, 'kt1', v)} />
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <EditableCell value={scores.kt2} onSave={v => updateScore(student.id, 'kt2', v)} />
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <EditableCell value={scores.kt3} onSave={v => updateScore(student.id, 'kt3', v)} />
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <EditableCell value={scores.giuaKy} onSave={v => updateScore(student.id, 'giuaKy', v)} />
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <EditableCell value={scores.cuoiKy} onSave={v => updateScore(student.id, 'cuoiKy', v)} />
                      </TableCell>
                      <TableCell className={cn('text-center font-bold text-sm', getRankColor(scores.avg))}>
                        {scores.avg ?? '—'}
                      </TableCell>
                      <TableCell className={cn('text-center text-xs font-medium', getRankColor(scores.avg))}>
                        {rank}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">💡 Click vào ô điểm để chỉnh sửa trực tiếp</p>
        </TabsContent>

        {/* TAB TIẾN ĐỘ */}
        <TabsContent value="tien-do" className="mt-4">
          {loadingHeatmap ? (
            <Skeleton className="h-64 w-full" />
          ) : heatmapData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Hoàn thành bài học theo học sinh</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-green-500 inline-block" />Hoàn thành</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-200 inline-block" />Chưa học</span>
                </div>
              </div>
              <HeatmapGrid
                rows={heatmapData.rows.map(r => ({ id: r.id, label: r.label.split(' ').slice(-1)[0] ?? r.label }))}
                cols={heatmapData.cols.map(c => ({ id: c.id ?? '', label: `B${c.label}` }))}
                data={heatmapData.data.map(d => ({ ...d, colId: d.colId ?? '' }))}
                mode="progress"
                cellSize="sm"
                rowLabelWidth={80}
              />
            </div>
          ) : null}
        </TabsContent>

        {/* TAB CẢNH BÁO SỚM */}
        <TabsContent value="canh-bao" className="mt-4">
          <div className="space-y-4">
            {/* Nguy hiểm */}
            {dangerous.length > 0 && (
              <div className="rounded-lg border-2 border-red-200 dark:border-red-900 overflow-hidden">
                <div className="bg-red-50 dark:bg-red-950/30 px-4 py-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                    🔴 Nguy hiểm — ĐTB &lt; 5.0 ({dangerous.length} HS)
                  </p>
                </div>
                <div className="divide-y">
                  {dangerous.map(s => {
                    const student = classStudents.find(st => st.id === s.studentId)
                    const trendValues = [s.kt1, s.kt2, s.kt3, s.giuaKy].filter(v => v !== null) as number[]
                    return (
                      <div key={s.studentId} className="px-4 py-3 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{student?.name ?? s.name}</p>
                          <p className="text-xs text-muted-foreground">ĐTB: <span className="text-red-600 font-bold">{s.avg}</span></p>
                        </div>
                        {trendValues.length >= 2 && <Sparkline values={trendValues} />}
                        <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={() => toast.info(`Đã nhắn tin cho ${student?.name}`)}>
                          <MessageCircle className="h-3 w-3 mr-1" />Nhắn tin
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Theo dõi */}
            {watching.length > 0 && (
              <div className="rounded-lg border-2 border-yellow-200 dark:border-yellow-900 overflow-hidden">
                <div className="bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">
                    🟡 Theo dõi — ĐTB 5.0 - 6.5 ({watching.length} HS)
                  </p>
                </div>
                <div className="divide-y">
                  {watching.map(s => {
                    const student = classStudents.find(st => st.id === s.studentId)
                    const trendValues = [s.kt1, s.kt2, s.kt3, s.giuaKy].filter(v => v !== null) as number[]
                    return (
                      <div key={s.studentId} className="px-4 py-3 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{student?.name ?? s.name}</p>
                          <p className="text-xs text-muted-foreground">ĐTB: <span className="text-yellow-600 font-bold">{s.avg}</span></p>
                        </div>
                        {trendValues.length >= 2 && <Sparkline values={trendValues} />}
                        <Button size="sm" variant="ghost" className="h-7 text-xs shrink-0" onClick={() => toast.info(`Xem chi tiết ${student?.name}`)}>
                          Xem
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tốt */}
            {good.length > 0 && (
              <div className="rounded-lg border-2 border-green-200 dark:border-green-900 overflow-hidden">
                <div className="bg-green-50 dark:bg-green-950/30 px-4 py-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="font-semibold text-green-700 dark:text-green-400 text-sm">
                    🟢 Tốt — ĐTB ≥ 7.0 ({good.length} HS)
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {good.map(s => {
                      const student = classStudents.find(st => st.id === s.studentId)
                      return (
                        <div key={s.studentId} className="flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/20 border border-green-200 px-3 py-1">
                          <span className="text-xs font-medium">{student?.name.split(' ').slice(-2).join(' ')}</span>
                          <Badge className="bg-green-500 text-white text-[10px] h-4 px-1">{s.avg}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {dangerous.length === 0 && watching.length === 0 && (
              <div className="text-center py-10">
                <TrendingUp className="h-10 w-10 mx-auto mb-3 text-green-500" />
                <p className="font-medium text-green-600">Tất cả học sinh đều đạt yêu cầu!</p>
                <p className="text-sm text-muted-foreground mt-1">Không có học sinh nào cần cảnh báo</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
