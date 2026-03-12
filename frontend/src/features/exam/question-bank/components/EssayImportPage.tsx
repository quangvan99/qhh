'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AppBadge } from '@/components/base/app-badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type Step = 'upload' | 'preview' | 'confirm'

const mockPreviewRows = [
  { content: 'Phân tích vai trò của nhân vật Mị trong tác phẩm "Vợ chồng A Phủ"', category: 'Ngữ văn', difficulty: 'Khó', maxScore: '5', rubric: '3 tiêu chí' },
  { content: 'Trình bày nguyên nhân và hệ quả của Cách mạng tháng Tám', category: 'Lịch sử', difficulty: 'TB', maxScore: '4', rubric: '2 tiêu chí' },
  { content: 'So sánh cấu trúc tế bào động vật và thực vật', category: 'Sinh học', difficulty: 'Dễ', maxScore: '3', rubric: '2 tiêu chí' },
  { content: 'Giải thích hiện tượng quang hợp và vai trò đối với sự sống', category: 'Sinh học', difficulty: 'TB', maxScore: '4', rubric: '3 tiêu chí' },
  { content: 'Viết đoạn văn nghị luận về ý nghĩa của việc đọc sách', category: 'Ngữ văn', difficulty: 'Dễ', maxScore: '3', rubric: '2 tiêu chí' },
]

export function EssayImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const steps: { key: Step; label: string }[] = [
    { key: 'upload', label: '1. Tải file' },
    { key: 'preview', label: '2. Xem trước dữ liệu' },
    { key: 'confirm', label: '3. Xác nhận import' },
  ]

  const currentIndex = steps.findIndex((s) => s.key === step)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setStep('preview')
    toast.info(`Đã tải file: ${selectedFile.name}`)
  }

  const handleConfirmImport = () => {
    setImporting(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setImporting(false)
          setDone(true)
          toast.success('Import thành công!', { description: `Đã nhập ${mockPreviewRows.length} câu hỏi tự luận` })
          return 100
        }
        return p + 20
      })
    }, 400)
  }

  return (
    <div>
      <PageHeader
        title="Import câu hỏi tự luận"
        breadcrumbs={[
          { label: 'Ngân hàng câu hỏi', href: '/exam/question-bank' },
          { label: 'Import tự luận' },
        ]}
      />

      <div className="max-w-3xl">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={cn('h-px w-8', i <= currentIndex ? 'bg-primary' : 'bg-muted')} />}
              <div className={cn(
                'flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full',
                i < currentIndex ? 'bg-primary/10 text-primary' : i === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById('essay-import-input')?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => {
                  e.preventDefault()
                  const droppedFile = e.dataTransfer.files[0]
                  if (droppedFile) handleFileSelect(droppedFile)
                }}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Kéo thả file Excel hoặc <span className="text-primary font-medium">chọn file</span></p>
                <p className="text-xs text-muted-foreground mt-1">Hỗ trợ: .xlsx, .xls, .csv</p>
                <input
                  id="essay-import-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFileSelect(f)
                  }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <a href="/templates/essay-questions-template.xlsx" download className="text-primary hover:underline cursor-pointer">
                  Tải mẫu Excel câu hỏi tự luận
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>File: <span className="font-medium">{file?.name ?? 'essay-questions.xlsx'}</span></span>
                <AppBadge semantic="info">{mockPreviewRows.length} câu hỏi</AppBadge>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                <AlertTriangle className="h-4 w-4 inline mr-1 text-amber-600" />
                <span className="text-amber-800">Vui lòng kiểm tra dữ liệu trước khi import</span>
              </div>

              <div className="max-h-80 overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Độ khó</TableHead>
                      <TableHead>Điểm tối đa</TableHead>
                      <TableHead>Rubric</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPreviewRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="max-w-xs truncate">{row.content}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.difficulty}</TableCell>
                        <TableCell>{row.maxScore}</TableCell>
                        <TableCell>{row.rubric}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => { setStep('upload'); setFile(null) }} className="cursor-pointer">
                  <ArrowLeft className="h-3 w-3 mr-1" /> Chọn lại file
                </Button>
                <Button onClick={() => setStep('confirm')} className="cursor-pointer">
                  Tiếp tục <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && !done && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {!importing ? (
                <>
                  <div className="text-center py-6">
                    <p className="text-lg font-semibold mb-2">Xác nhận import</p>
                    <p className="text-sm text-muted-foreground">
                      Sẽ nhập <strong>{mockPreviewRows.length}</strong> câu hỏi tự luận vào ngân hàng câu hỏi.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setStep('preview')} className="cursor-pointer">
                      <ArrowLeft className="h-3 w-3 mr-1" /> Quay lại
                    </Button>
                    <Button onClick={handleConfirmImport} className="cursor-pointer">
                      Xác nhận import
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8 space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">Đang nhập dữ liệu...</p>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">{progress}%</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Done */}
        {done && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                <div>
                  <p className="text-lg font-semibold">Import thành công!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Đã nhập <span className="text-green-600 font-medium">{mockPreviewRows.length}</span> câu hỏi tự luận
                  </p>
                </div>
                <Button onClick={() => router.push('/exam/question-bank')} className="cursor-pointer">
                  Về ngân hàng câu hỏi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
