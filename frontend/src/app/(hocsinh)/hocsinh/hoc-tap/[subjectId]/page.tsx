'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Lock, CheckCircle2, PlayCircle, FileText, Video, HelpCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import { ProgressRing } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const SUBJECT_GRADIENTS: Record<string, string> = {
  'Toán học': 'from-blue-400 to-blue-600',
  'Vật lý': 'from-purple-400 to-purple-600',
  'Ngữ văn': 'from-orange-400 to-orange-600',
  'Tiếng Anh': 'from-yellow-400 to-yellow-600',
  'Hóa học': 'from-green-400 to-green-600',
  'Lịch sử': 'from-red-400 to-red-600',
  'Địa lý': 'from-teal-400 to-teal-600',
}

// Mock curriculum data
function getMockChapters(subjectId: string) {
  return [
    {
      id: 'ch1', title: 'Chương 1: Đại số', totalLessons: 5, completedLessons: 4,
      lessons: [
        { id: 'l1', title: 'Hàm số bậc nhất', status: 'done', resources: 3 },
        { id: 'l2', title: 'Hàm số bậc hai', status: 'done', resources: 3 },
        { id: 'l3', title: 'Đạo hàm', status: 'active', resources: 3, completedResources: 2 },
        { id: 'l4', title: 'Tích phân', status: 'locked', resources: 2 },
        { id: 'l5', title: 'Phương trình vi phân', status: 'locked', resources: 2 },
      ]
    },
    {
      id: 'ch2', title: 'Chương 2: Hình học', totalLessons: 5, completedLessons: 2,
      lessons: [
        { id: 'l6', title: 'Vector trong không gian', status: 'done', resources: 2 },
        { id: 'l7', title: 'Phương trình mặt phẳng', status: 'done', resources: 3 },
        { id: 'l8', title: 'Đường thẳng trong không gian', status: 'active', resources: 3, completedResources: 1 },
        { id: 'l9', title: 'Hình chiếu và góc', status: 'locked', resources: 2 },
        { id: 'l10', title: 'Thể tích khối đa diện', status: 'locked', resources: 3 },
      ]
    },
    {
      id: 'ch3', title: 'Chương 3: Xác suất thống kê', totalLessons: 4, completedLessons: 0,
      lessons: [
        { id: 'l11', title: 'Quy tắc đếm', status: 'locked', resources: 2 },
        { id: 'l12', title: 'Hoán vị, Chỉnh hợp, Tổ hợp', status: 'locked', resources: 3 },
        { id: 'l13', title: 'Xác suất', status: 'locked', resources: 3 },
        { id: 'l14', title: 'Biến ngẫu nhiên', status: 'locked', resources: 2 },
      ]
    },
  ]
}

function getMockResources(lessonId: string) {
  return [
    { id: 'r1', type: 'video', title: `Bài giảng ${lessonId}`, done: true },
    { id: 'r2', type: 'document', title: `Lý thuyết ${lessonId}.pdf`, done: true },
    { id: 'r3', type: 'quiz', title: 'Quiz 5 câu', done: false },
  ]
}

function LessonStatusIcon({ status }: { status: string }) {
  if (status === 'done') return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
  if (status === 'active') return <PlayCircle className="h-5 w-5 text-blue-500 shrink-0 animate-pulse" />
  return <Lock className="h-5 w-5 text-muted-foreground/50 shrink-0" />
}

function ResourceIcon({ type }: { type: string }) {
  if (type === 'video') return <Video className="h-4 w-4 text-red-500" />
  if (type === 'document') return <FileText className="h-4 w-4 text-blue-500" />
  return <HelpCircle className="h-4 w-4 text-purple-500" />
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}
    </div>
  )
}

export default function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ 'ch1': true })
  const [selectedLesson, setSelectedLesson] = useState<{ id: string; title: string } | null>(null)

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['hs', 'subjects', 'hs-001'],
    queryFn: () => studentMockApi.getMySubjects('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const subject = subjects?.find(s => s.id === subjectId) ?? subjects?.[0]
  if (!subject) return <div className="p-4 text-center text-muted-foreground">Không tìm thấy môn học</div>

  const gradient = SUBJECT_GRADIENTS[subject.name] ?? 'from-gray-400 to-gray-600'
  const chapters = getMockChapters(subjectId)
  const resources = selectedLesson ? getMockResources(selectedLesson.id) : []

  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Header with gradient */}
      <div className={cn('bg-gradient-to-br px-4 pt-4 pb-6', gradient)}>
        <Link href="/hocsinh/hoc-tap" className="flex items-center gap-1 text-white/80 text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Môn học
        </Link>
        <div className="flex items-center gap-4">
          <ProgressRing
            value={subject.progress}
            size={72}
            strokeWidth={6}
            color="white"
            trackColor="rgba(255,255,255,0.3)"
            showValue={true}
            animate={true}
          />
          <div>
            <h1 className="text-white font-bold text-xl">{subject.name}</h1>
            <p className="text-white/80 text-sm">GV: {subject.teacher}</p>
            <p className="text-white/70 text-xs mt-1">{subject.completedLessons}/{subject.totalLessons} bài hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Chapters accordion */}
      <div className="px-4 pt-4 space-y-3">
        {chapters.map(chapter => {
          const isOpen = expandedChapters[chapter.id] ?? false
          return (
            <div key={chapter.id} className="rounded-2xl bg-card border shadow-sm overflow-hidden">
              {/* Chapter header */}
              <button
                className="w-full flex items-center justify-between p-4"
                onClick={() => setExpandedChapters(prev => ({ ...prev, [chapter.id]: !isOpen }))}
              >
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{chapter.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {chapter.completedLessons}/{chapter.totalLessons} bài
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <Progress value={(chapter.completedLessons / chapter.totalLessons) * 100} className="h-1.5" />
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="border-t">
                  {chapter.lessons.map(lesson => {
                    const canOpen = lesson.status !== 'locked'
                    const LessonWrapper = canOpen ? Sheet : 'div'
                    const triggerProps = canOpen ? {} : {}

                    return canOpen ? (
                      <Sheet key={lesson.id}>
                        <SheetTrigger
                          key={lesson.id}
                          render={<button className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors" />}
                        >
                            <LessonStatusIcon status={lesson.status} />
                            <div className="flex-1 text-left">
                              <p className={cn('text-sm', lesson.status === 'locked' && 'text-muted-foreground')}>
                                {lesson.title}
                              </p>
                              {lesson.status === 'active' && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-xs text-blue-600 font-medium">Đang học</span>
                                  <span className="text-xs text-muted-foreground">— {(lesson as any).completedResources}/{lesson.resources} tài nguyên</span>
                                </div>
                              )}
                            </div>
                            {lesson.status !== 'locked' && (
                              <Badge variant="outline" className="text-[10px]">{lesson.resources} mục</Badge>
                            )}
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
                          <div className="py-2 pb-6">
                            <div className="flex items-center gap-2 mb-4">
                              <LessonStatusIcon status={lesson.status} />
                              <h3 className="font-bold text-base">{lesson.title}</h3>
                            </div>
                            {(lesson as any).completedResources !== undefined && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                                <p className="text-sm text-blue-700 font-medium">
                                  Tiến độ: {(lesson as any).completedResources}/{lesson.resources} tài nguyên hoàn thành
                                </p>
                                <Progress
                                  value={((lesson as any).completedResources / lesson.resources) * 100}
                                  className="h-1.5 mt-2"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              {getMockResources(lesson.id).map(r => (
                                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                                  <ResourceIcon type={r.type} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{r.title}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{r.type === 'video' ? 'Video bài giảng' : r.type === 'document' ? 'Tài liệu PDF' : 'Bài tập kiểm tra'}</p>
                                  </div>
                                  {r.done && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
                                  <Button size="sm" variant={r.done ? 'outline' : 'default'} className="shrink-0 min-h-[36px]">
                                    {r.type === 'video' ? 'Xem' : r.type === 'document' ? (<><Download className="h-3.5 w-3.5 mr-1" />Tải</>) : 'Làm ngay'}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ) : (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 opacity-50">
                        <LessonStatusIcon status={lesson.status} />
                        <p className="text-sm text-muted-foreground">{lesson.title}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
