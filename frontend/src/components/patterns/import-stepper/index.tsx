'use client'
import { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface ImportStepperProps {
  onUpload: (file: File) => Promise<ImportPreviewData>
  onConfirm: (data: ImportPreviewData) => Promise<ImportResult>
  onClose: () => void
  templateUrl?: string
  accept?: string
  className?: string
}

export interface ImportPreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
  errors?: { row: number; message: string }[]
}

export interface ImportResult {
  success: number
  failed: number
  errors?: { row: number; message: string }[]
}

type Step = 'upload' | 'preview' | 'importing' | 'result'

export function ImportStepper({ onUpload, onConfirm, onClose, templateUrl, accept = '.xlsx,.xls,.csv', className }: ImportStepperProps) {
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreviewData | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    try {
      const data = await onUpload(selectedFile)
      setPreview(data)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi đọc file')
    }
  }

  const handleConfirm = async () => {
    if (!preview) return
    setStep('importing')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90))
    }, 300)
    try {
      const res = await onConfirm(preview)
      clearInterval(interval)
      setProgress(100)
      setResult(res)
      setStep('result')
    } catch (err) {
      clearInterval(interval)
      setError(err instanceof Error ? err.message : 'Lỗi khi import')
      setStep('preview')
    }
  }

  const steps = [
    { key: 'upload', label: '1. Tải file' },
    { key: 'preview', label: '2. Xem trước' },
    { key: 'importing', label: '3. Nhập dữ liệu' },
    { key: 'result', label: '4. Kết quả' },
  ]

  const currentIndex = steps.findIndex((s) => s.key === step)

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Nhập dữ liệu từ Excel</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={cn('h-px w-8', i <= currentIndex ? 'bg-primary' : 'bg-muted')} />}
              <span className={cn(
                'text-xs font-medium',
                i <= currentIndex ? 'text-primary' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('import-file-input')?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
              onDrop={(e) => {
                e.preventDefault()
                const droppedFile = e.dataTransfer.files[0]
                if (droppedFile) handleFileSelect(droppedFile)
              }}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Kéo thả file hoặc <span className="text-primary font-medium">chọn file</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Hỗ trợ: .xlsx, .xls, .csv</p>
              <input
                id="import-file-input"
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                }}
              />
            </div>
            {templateUrl && (
              <div className="flex items-center gap-2 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <a href={templateUrl} download className="text-primary hover:underline cursor-pointer">
                  Tải mẫu Excel
                </a>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'preview' && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>File: <span className="font-medium">{file?.name}</span></span>
              <span>{preview.totalRows} dòng dữ liệu</span>
            </div>
            {preview.errors && preview.errors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm space-y-1">
                <p className="font-medium text-amber-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  {preview.errors.length} lỗi phát hiện
                </p>
                {preview.errors.slice(0, 5).map((err, i) => (
                  <p key={i} className="text-amber-700">Dòng {err.row}: {err.message}</p>
                ))}
              </div>
            )}
            <div className="max-h-64 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {preview.headers.map((h, i) => (
                      <TableHead key={i}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.rows.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => { setStep('upload'); setPreview(null); setFile(null) }} className="cursor-pointer">
                Chọn lại
              </Button>
              <Button onClick={handleConfirm} className="cursor-pointer">
                Xác nhận nhập
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="py-8 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Đang nhập dữ liệu...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        )}

        {step === 'result' && result && (
          <div className="py-8 space-y-4 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <div className="space-y-1">
              <p className="text-lg font-semibold">Hoàn tất!</p>
              <p className="text-sm text-muted-foreground">
                Thành công: <span className="text-green-600 font-medium">{result.success}</span> |
                Thất bại: <span className="text-red-600 font-medium">{result.failed}</span>
              </p>
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="text-left bg-red-50 border border-red-200 rounded-md p-3 text-sm space-y-1 max-h-32 overflow-auto">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-red-700">Dòng {err.row}: {err.message}</p>
                ))}
              </div>
            )}
            <Button onClick={onClose} className="cursor-pointer">Đóng</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
