'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressRing } from '@/components/shared'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function getGrade(score: number) {
  if (score >= 9) return { label: 'Xuất sắc', color: 'text-emerald-700', bg: 'bg-emerald-50', barColor: 'bg-emerald-500', border: 'border-emerald-200' }
  if (score >= 8) return { label: 'Giỏi', color: 'text-green-700', bg: 'bg-green-50', barColor: 'bg-green-500', border: 'border-green-200' }
  if (score >= 6.5) return { label: 'Khá', color: 'text-blue-700', bg: 'bg-blue-50', barColor: 'bg-blue-500', border: 'border-blue-200' }
  if (score >= 5) return { label: 'Trung bình', color: 'text-orange-700', bg: 'bg-orange-50', barColor: 'bg-orange-500', border: 'border-orange-200' }
  return { label: 'Yếu', color: 'text-red-700', bg: 'bg-red-50', barColor: 'bg-red-500', border: 'border-red-200' }
}

function getTrend(scores: number[]) {
  if (scores.length < 2) return 'stable'
  const last = scores[scores.length - 1] ?? 0
  const prev = scores[scores.length - 2] ?? 0
  if (last > prev + 0.3) return 'up'
  if (last < prev - 0.3) return 'down'
  return 'stable'
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

// Mini sparkline (inline SVG)
function Sparkline({ scores }: { scores: number[] }) {
  const w = 48, h = 20
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min || 1
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * w
    const y = h - ((s - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
      {scores.map((s, i) => {
        const x = (i / (scores.length - 1)) * w
        const y = h - ((s - min) / range) * (h - 4) - 2
        return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" className="text-blue-500" />
      })}
    </svg>
  )
}

const SUBJECT_ICONS: Record<string, string> = {
  'Toán': '📐', 'Vật lý': '🔬', 'Hóa học': '⚗️', 'Ngữ văn': '📗',
  'Tiếng Anh': '🌐', 'Lịch sử': '📜', 'Địa lý': '🗺️',
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />)}
      </div>
      {Array(5).fill(0).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
    </div>
  )
}

export default function KetQuaPage() {
  const { data: results, isLoading } = useQuery({
    queryKey: ['hs', 'results', 'hs-001'],
    queryFn: () => studentMockApi.getMyResults('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />
  if (!results) return null

  const gpaGrade = getGrade(results.gpa)
  const sortedSubjects = [...results.subjects].sort((a, b) => a.avg - b.avg)

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Kết quả học tập</h1>
      </div>

      {/* GPA Card */}
      <div className="px-4 pt-4 mb-4">
        <div className={cn('rounded-2xl border p-5 flex items-center gap-5', gpaGrade.bg, gpaGrade.border)}>
          <ProgressRing
            value={results.gpa * 10}
            size={80}
            strokeWidth={7}
            color="hsl(var(--primary))"
            showValue={false}
            animate
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Điểm TB chung</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black leading-none text-primary">{results.gpa}</span>
              <span className="text-lg text-muted-foreground pb-0.5">/10</span>
            </div>
            <Badge className={cn('mt-2 text-xs', gpaGrade.bg, gpaGrade.color, 'border', gpaGrade.border)}>
              {gpaGrade.label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{results.semester}</p>
            <p className="text-xs text-muted-foreground mt-1">Hạng</p>
            <p className="text-lg font-bold text-foreground">{results.rank}/{results.totalStudents}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subjects">
        <TabsList className="w-full rounded-none border-b bg-background h-11 px-4">
          <TabsTrigger value="subjects" className="flex-1 text-xs data-[state=active]:font-bold">Điểm các môn</TabsTrigger>
          <TabsTrigger value="tests" className="flex-1 text-xs data-[state=active]:font-bold">Bài kiểm tra</TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1 text-xs data-[state=active]:font-bold">Học bạ</TabsTrigger>
        </TabsList>

        {/* Tab: Điểm các môn */}
        <TabsContent value="subjects" className="px-4 pt-4 space-y-3">
          {sortedSubjects.map(subject => {
            const grade = getGrade(subject.avg)
            const trend = getTrend(subject.scores)
            return (
              <div key={subject.name} className={cn('rounded-xl border p-4', grade.bg, grade.border)}>
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{SUBJECT_ICONS[subject.name] ?? '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{subject.name}</p>
                      <TrendIcon trend={trend} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(subject.avg / 10) * 100} className="h-1.5 flex-1" />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-xl font-black leading-none', grade.color)}>{subject.avg.toFixed(1)}</p>
                    <Badge className={cn('mt-1 text-[10px] px-1.5', grade.bg, grade.color, 'border', grade.border)}>
                      {grade.label}
                    </Badge>
                  </div>
                  <Sparkline scores={subject.scores} />
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* Tab: Bài kiểm tra */}
        <TabsContent value="tests" className="px-4 pt-4">
          <div className="rounded-2xl bg-card border p-4 mb-4">
            <p className="text-sm font-semibold mb-3">Điểm kiểm tra theo môn</p>
            {results.subjects.map(subject => (
              <div key={subject.name} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{SUBJECT_ICONS[subject.name] ?? '📚'}</span>
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
                {/* Bar chart visual */}
                <div className="flex items-end gap-1 h-16">
                  {subject.scores.map((score, i) => {
                    const grade = getGrade(score)
                    const height = `${(score / 10) * 100}%`
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                        <span className="text-[9px] text-muted-foreground">{score}</span>
                        <div
                          className={cn('w-full rounded-t-sm', grade.barColor)}
                          style={{ height }}
                        />
                        <span className="text-[9px] text-muted-foreground">L{i + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Học bạ */}
        <TabsContent value="transcript" className="px-4 pt-4">
          {/* Student info card */}
          <div className="rounded-2xl bg-card border p-4 mb-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">NM</span>
            </div>
            <div>
              <p className="font-bold">Nguyễn Văn Minh</p>
              <p className="text-sm text-muted-foreground">Lớp 12A1 · Mã HS: HS-001</p>
              <p className="text-xs text-muted-foreground">{results.semester}</p>
            </div>
          </div>

          {/* Score table */}
          <div className="rounded-2xl bg-card border overflow-hidden mb-4">
            <div className="px-4 py-2 bg-muted/50 border-b">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">HỌC KỲ 1 · 2024-2025</p>
            </div>
            <div className="divide-y">
              <div className="flex items-center px-4 py-2 bg-muted/30">
                <span className="flex-1 text-xs font-semibold text-muted-foreground">Môn học</span>
                <span className="w-14 text-xs font-semibold text-muted-foreground text-center">ĐTB</span>
                <span className="w-20 text-xs font-semibold text-muted-foreground text-right">Xếp loại</span>
              </div>
              {results.subjects.map(subject => {
                const grade = getGrade(subject.avg)
                return (
                  <div key={subject.name} className="flex items-center px-4 py-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm">{SUBJECT_ICONS[subject.name] ?? '📚'}</span>
                      <span className="text-sm">{subject.name}</span>
                    </div>
                    <span className={cn('w-14 text-center font-bold text-sm', grade.color)}>
                      {subject.avg.toFixed(1)}
                    </span>
                    <div className="w-20 text-right">
                      <Badge className={cn('text-[10px] px-1.5', grade.bg, grade.color, 'border', grade.border)}>
                        {grade.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center px-4 py-3 bg-muted/30">
                <span className="flex-1 text-sm font-bold">ĐTB Chung</span>
                <span className={cn('w-14 text-center font-black text-base', gpaGrade.color)}>{results.gpa}</span>
                <div className="w-20 text-right">
                  <Badge className={cn('text-[10px] px-1.5', gpaGrade.bg, gpaGrade.color, 'border', gpaGrade.border)}>
                    {gpaGrade.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full min-h-[48px] gap-2"
            variant="outline"
            onClick={() => toast.info('Đang tạo file PDF... Chức năng mock')}
          >
            <Download className="h-4 w-4" />
            Tải học bạ PDF
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
