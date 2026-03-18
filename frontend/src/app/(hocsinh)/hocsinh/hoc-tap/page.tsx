'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const SUBJECT_GRADIENTS: Record<string, string> = {
  'Toán học': 'from-blue-400 to-blue-600',
  'Vật lý': 'from-purple-400 to-purple-600',
  'Ngữ văn': 'from-orange-400 to-orange-600',
  'Tiếng Anh': 'from-yellow-400 to-yellow-600',
  'Hóa học': 'from-green-400 to-green-600',
  'Lịch sử': 'from-red-400 to-red-600',
  'Địa lý': 'from-teal-400 to-teal-600',
  'Sinh học': 'from-lime-400 to-lime-600',
}

const SUBJECT_ICONS: Record<string, string> = {
  'Toán học': '📐', 'Vật lý': '🔬', 'Ngữ văn': '📗',
  'Tiếng Anh': '🌐', 'Hóa học': '⚗️', 'Lịch sử': '📜', 'Địa lý': '🗺️', 'Sinh học': '🧬',
}

const FILTERS = ['Tất cả', 'Đang học', 'Hoàn thành', 'Chưa bắt đầu'] as const
type Filter = typeof FILTERS[number]

function getStatus(progress: number): { label: string; status: Filter } {
  if (progress === 0) return { label: 'Chưa bắt đầu', status: 'Chưa bắt đầu' }
  if (progress === 100) return { label: 'Hoàn thành', status: 'Hoàn thành' }
  return { label: 'Đang học', status: 'Đang học' }
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-muted" />)}
      </div>
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}

export default function HocTapPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Tất cả')

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['hs', 'subjects', 'hs-001'],
    queryFn: () => studentMockApi.getMySubjects('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const filtered = (subjects ?? []).filter(s => {
    if (activeFilter === 'Tất cả') return true
    const { status } = getStatus(s.progress)
    return status === activeFilter
  })

  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-lg font-bold">Môn học</h1>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
              activeFilter === filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Subject cards */}
      <div className="space-y-4 px-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">Không có môn học nào</p>
          </div>
        ) : filtered.map(subject => {
          const gradient = SUBJECT_GRADIENTS[subject.name] ?? 'from-gray-400 to-gray-600'
          const icon = SUBJECT_ICONS[subject.name] ?? '📚'
          const { label, status } = getStatus(subject.progress)
          const isNew = status === 'Chưa bắt đầu'

          return (
            <div key={subject.id} className="w-full rounded-2xl bg-card border shadow-sm overflow-hidden">
              {/* Gradient header */}
              <div className={cn('bg-gradient-to-br h-20 p-4 flex items-center justify-between', gradient)}>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{subject.name}</p>
                  <p className="text-white/80 text-xs mt-0.5">GV: {subject.teacher}</p>
                </div>
                <span className="text-3xl">{icon}</span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {subject.completedLessons}/{subject.totalLessons} bài hoàn thành
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-1.5 py-0',
                        status === 'Hoàn thành' ? 'border-green-500 text-green-700' :
                        status === 'Đang học' ? 'border-blue-500 text-blue-700' : 'border-gray-300 text-gray-500'
                      )}
                    >
                      {label}
                    </Badge>
                    <span className="text-sm font-bold text-primary">{subject.progress}%</span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2 mb-4" />

                <Link href={`/hocsinh/hoc-tap/${subject.id}`}>
                  <Button className="w-full min-h-[48px] gap-2" variant={isNew ? 'outline' : 'default'}>
                    {isNew ? '▶ Bắt đầu học' : '▶ Tiếp tục học'}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
