'use client'

import { useState } from 'react'
import { useClassStore } from '@/stores/class.store'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, BookOpen, Plus, Video, Upload, File, ChevronRight, GripVertical, Library, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock course structure
const COURSE_STRUCTURE = [
  {
    id: 'ch1',
    title: 'Chương 1: Giới hạn và Liên tục',
    lessons: [
      { id: 'l1', title: 'Bài 1: Giới hạn của dãy số', type: 'video', resources: 3 },
      { id: 'l2', title: 'Bài 2: Giới hạn hàm số', type: 'text', resources: 2 },
      { id: 'l3', title: 'Bài 3: Hàm số liên tục', type: 'scorm', resources: 4 },
      { id: 'l4', title: 'Bài 4: Bài tập chương 1', type: 'file', resources: 1 },
    ],
  },
  {
    id: 'ch2',
    title: 'Chương 2: Đạo hàm',
    lessons: [
      { id: 'l5', title: 'Bài 1: Khái niệm đạo hàm', type: 'video', resources: 3 },
      { id: 'l6', title: 'Bài 2: Quy tắc tính đạo hàm', type: 'text', resources: 5 },
      { id: 'l7', title: 'Bài 3: Đạo hàm hàm hợp', type: 'video', resources: 2 },
      { id: 'l8', title: 'Bài 4: Ứng dụng đạo hàm', type: 'scorm', resources: 4 },
      { id: 'l9', title: 'Bài 5: Kiểm tra chương 2', type: 'survey', resources: 1 },
    ],
  },
  {
    id: 'ch3',
    title: 'Chương 3: Nguyên hàm và Tích phân',
    lessons: [
      { id: 'l10', title: 'Bài 1: Nguyên hàm', type: 'video', resources: 3 },
      { id: 'l11', title: 'Bài 2: Bảng nguyên hàm', type: 'text', resources: 2 },
      { id: 'l12', title: 'Bài 3: Tích phân xác định', type: 'scorm', resources: 4 },
      { id: 'l13', title: 'Bài 4: Ứng dụng tích phân', type: 'file', resources: 3 },
    ],
  },
]

const CONTENT_LIBRARY = [
  { id: 'lib1', title: 'Video: Giới hạn hàm số (YouTube)', type: 'video', usedCount: 3 },
  { id: 'lib2', title: 'Tài liệu PDF: Công thức đạo hàm', type: 'file', usedCount: 5 },
  { id: 'lib3', title: 'SCORM: Luyện tập tích phân', type: 'scorm', usedCount: 2 },
  { id: 'lib4', title: 'Bài kiểm tra: Chương 1', type: 'survey', usedCount: 1 },
  { id: 'lib5', title: 'Video: Giải bài tập mẫu', type: 'video', usedCount: 4 },
]

const typeIcon: Record<string, React.ReactNode> = {
  video: <Video className="h-3.5 w-3.5 text-red-500" />,
  text: <FileText className="h-3.5 w-3.5 text-blue-500" />,
  scorm: <File className="h-3.5 w-3.5 text-purple-500" />,
  file: <File className="h-3.5 w-3.5 text-gray-500" />,
  survey: <FileText className="h-3.5 w-3.5 text-green-500" />,
}

const typeLabel: Record<string, string> = {
  video: 'Video',
  text: 'Văn bản',
  scorm: 'SCORM',
  file: 'Tệp',
  survey: 'Khảo sát',
}

// Mock resources for selected lesson
function getLessonResources(lessonId: string) {
  return [
    { id: `${lessonId}-r1`, name: 'Slide bài giảng.pdf', type: 'file', size: '2.3 MB' },
    { id: `${lessonId}-r2`, name: 'Video bài giảng', type: 'video', url: 'https://youtube.com/...' },
    { id: `${lessonId}-r3`, name: 'Bài tập thực hành', type: 'text', content: 'Thực hiện các bài tập...' },
  ]
}

export default function NoiDungPage() {
  const { currentClassId } = useClassStore()
  const [selectedLesson, setSelectedLesson] = useState<{ chId: string; lesson: typeof COURSE_STRUCTURE[0]['lessons'][0] } | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)

  const resources = selectedLesson ? getLessonResources(selectedLesson.lesson.id) : []
  const currentClass = currentClassId ? currentClassId.replace('lop-', '').toUpperCase() : '—'

  function handleAddResource(type: string) {
    toast.success(`Đã thêm tài nguyên loại ${type}`)
  }

  if (!currentClassId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="font-medium">Chưa chọn lớp</p>
        <p className="text-sm text-muted-foreground mt-1">Chọn lớp để quản lý nội dung</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-lg border">
      {/* LEFT — Course tree */}
      <aside className="w-70 shrink-0 border-r flex flex-col overflow-hidden" style={{ width: 280 }}>
        <div className="p-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Lớp {currentClass} — Toán</p>
              <p className="text-xs text-muted-foreground">{COURSE_STRUCTURE.reduce((s, c) => s + c.lessons.length, 0)} bài học</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <Accordion multiple defaultValue={['ch1', 'ch2']} className="space-y-1">
            {COURSE_STRUCTURE.map(chapter => (
              <AccordionItem key={chapter.id} value={chapter.id} className="border rounded-md overflow-hidden">
                <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
                  <span className="text-left flex-1 text-xs font-semibold truncate">{chapter.title}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="space-y-0.5 px-1">
                    {chapter.lessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson({ chId: chapter.id, lesson })}
                        className={cn(
                          'w-full flex items-center gap-2 rounded px-2 py-1.5 text-xs text-left transition-colors group',
                          selectedLesson?.lesson.id === lesson.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <GripVertical className="h-3 w-3 opacity-30 shrink-0 cursor-grab" />
                        <span className="shrink-0">{typeIcon[lesson.type]}</span>
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <Badge variant="outline" className={cn('text-[9px] h-4 px-1 shrink-0', selectedLesson?.lesson.id === lesson.id && 'border-primary-foreground/30 text-primary-foreground')}>
                          {lesson.resources}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-3 px-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-xs border-dashed"
              onClick={() => toast.info('Tính năng thêm bài học sẽ sớm có')}
            >
              <Plus className="h-3 w-3 mr-1" />
              Thêm bài học
            </Button>
          </div>
        </div>
      </aside>

      {/* RIGHT — Content editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedLesson ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Chọn bài học để xem nội dung</p>
            <p className="text-sm text-muted-foreground mt-1">Hoặc thêm bài học mới từ menu trái</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>{COURSE_STRUCTURE.find(c => c.id === selectedLesson.chId)?.title}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{selectedLesson.lesson.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {typeIcon[selectedLesson.lesson.type]}
                  <h2 className="font-semibold">{selectedLesson.lesson.title}</h2>
                  <Badge variant="outline" className="text-xs">
                    {typeLabel[selectedLesson.lesson.type]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setShowLibrary(!showLibrary)}
                  >
                    <Library className="h-3.5 w-3.5 mr-1" />
                    Thư viện nội dung
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                      Thêm tài nguyên
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddResource('video')}>
                        <Video className="h-4 w-4 mr-2 text-red-500" />
                        Video URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddResource('file')}>
                        <Upload className="h-4 w-4 mr-2 text-blue-500" />
                        Upload file
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddResource('text')}>
                        <FileText className="h-4 w-4 mr-2 text-green-500" />
                        Viết văn bản
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddResource('survey')}>
                        <File className="h-4 w-4 mr-2 text-purple-500" />
                        Khảo sát
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Resources list + library panel */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Tài nguyên ({resources.length})
                </h3>
                {resources.map(res => (
                  <div key={res.id} className="rounded-lg border p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                      {typeIcon[res.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{res.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {res.type === 'file' && res.size}
                        {res.type === 'video' && 'Liên kết video'}
                        {res.type === 'text' && 'Nội dung văn bản'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 text-xs">Sửa</Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-red-600">Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Library panel */}
              {showLibrary && (
                <aside className="w-64 border-l bg-muted/10 flex flex-col overflow-hidden">
                  <div className="p-3 border-b flex items-center justify-between">
                    <p className="text-sm font-medium">Tái sử dụng nội dung</p>
                    <button onClick={() => setShowLibrary(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {CONTENT_LIBRARY.map(item => (
                      <div key={item.id} className="rounded-md border bg-card p-2.5 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          {typeIcon[item.type]}
                          <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Đã dùng {item.usedCount} lần</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-5 text-[10px] px-1.5"
                            onClick={() => toast.success(`Đã thêm "${item.title}" vào bài`)}
                          >
                            Thêm
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
