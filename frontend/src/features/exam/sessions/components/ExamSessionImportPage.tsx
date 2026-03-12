'use client'

import { useState, useCallback } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import Link from 'next/link'

// ── Types ──
interface ImportExamRow {
  row: number
  name: string
  examPaperName: string
  examDate: string
  startTime: string
  durationMinutes: number
  room: string
  maxStudents: number
  valid: boolean
  error?: string
}

// ── Mock preview data ──
const mockPreviewRows: ImportExamRow[] = [
  { row: 1, name: 'Ca 1 - Sáng', examPaperName: 'Đề thi Toán GK1', examDate: '2026-03-15', startTime: '07:30', durationMinutes: 45, room: 'P.101', maxStudents: 40, valid: true },
  { row: 2, name: 'Ca 2 - Sáng', examPaperName: 'Đề thi Văn GK1', examDate: '2026-03-15', startTime: '09:00', durationMinutes: 60, room: 'P.102', maxStudents: 35, valid: true },
  { row: 3, name: 'Ca 3 - Chiều', examPaperName: 'Đề thi Anh GK1', examDate: '2026-03-15', startTime: '13:30', durationMinutes: 45, room: 'P.103', maxStudents: 40, valid: true },
  { row: 4, name: '', examPaperName: 'Đề thi Lý GK1', examDate: '2026-03-16', startTime: '07:30', durationMinutes: 45, room: 'P.101', maxStudents: 40, valid: false, error: 'Thiếu tên ca thi' },
  { row: 5, name: 'Ca 5 - Sáng', examPaperName: 'Đề thi Hóa GK1', examDate: '2026-03-16', startTime: '09:00', durationMinutes: 45, room: 'P.104', maxStudents: 38, valid: true },
]

const steps = ['Upload file', 'Xem trước dữ liệu', 'Xác nhận import']

export function ExamSessionImportPage({ sessionId }: { sessionId: string }) {
  const [step, setStep] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  const validCount = mockPreviewRows.filter((r) => r.valid).length
  const errorCount = mockPreviewRows.filter((r) => !r.valid).length

  const handleFileSelect = useCallback(() => {
    setFileName('ca_thi_gk1_2026.xlsx')
    toast.success('Đã tải file lên thành công')
    setTimeout(() => setStep(1), 500)
  }, [])

  const handleImport = useCallback(() => {
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setDone(true)
      setStep(2)
      toast.success(`Đã import ${validCount} ca thi thành công`)
    }, 1500)
  }, [validCount])

  const previewColumns: ColumnDef<ImportExamRow, unknown>[] = [
    { accessorKey: 'row', header: '#', size: 50 },
    { accessorKey: 'name', header: 'Tên ca thi' },
    { accessorKey: 'examPaperName', header: 'Đề thi' },
    { accessorKey: 'examDate', header: 'Ngày thi' },
    { accessorKey: 'startTime', header: 'Giờ BĐ' },
    { accessorKey: 'durationMinutes', header: 'Phút', size: 60 },
    { accessorKey: 'room', header: 'Phòng' },
    { accessorKey: 'maxStudents', header: 'Max HS', size: 70 },
    {
      id: 'status', header: 'Trạng thái', size: 120,
      cell: ({ row }) => row.original.valid
        ? <AppBadge semantic="success" size="sm">Hợp lệ</AppBadge>
        : <AppBadge semantic="error" size="sm">{row.original.error}</AppBadge>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Import ca thi từ Excel"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Import' },
        ]}
      />

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              i === step ? 'bg-primary text-primary-foreground' :
              i < step || done ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <span className="font-medium">{i + 1}</span>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center max-w-md mx-auto">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">Upload file Excel</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tải lên file Excel chứa danh sách ca thi. File cần có các cột: Tên ca thi, Đề thi, Ngày thi, Giờ bắt đầu, Thời gian (phút), Phòng, Max HS.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" /> Tải template
                </Button>
                <Button className="cursor-pointer" onClick={handleFileSelect}>
                  <Upload className="h-4 w-4 mr-2" /> Chọn file Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Preview */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <AppBadge semantic="neutral" size="sm"><FileSpreadsheet className="h-3 w-3 mr-1" /> {fileName}</AppBadge>
            <AppBadge semantic="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-1" /> {validCount} hợp lệ</AppBadge>
            {errorCount > 0 && <AppBadge semantic="error" size="sm"><AlertCircle className="h-3 w-3 mr-1" /> {errorCount} lỗi</AppBadge>}
          </div>
          <DataTable data={mockPreviewRows} columns={previewColumns} pageSize={20} />
          <div className="flex justify-between">
            <Button variant="outline" className="cursor-pointer" onClick={() => setStep(0)}>Quay lại</Button>
            <Button className="cursor-pointer" onClick={handleImport} disabled={importing}>
              {importing ? 'Đang import...' : `Import ${validCount} ca thi`}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Done */}
      {step === 2 && done && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold text-lg mb-2">Import thành công!</h3>
            <p className="text-sm text-muted-foreground mb-1">Đã import {validCount} ca thi vào đợt thi.</p>
            {errorCount > 0 && <p className="text-sm text-destructive mb-4">{errorCount} dòng bị bỏ qua do lỗi.</p>}
            <Link href={`/exam/sessions/${sessionId}/exams`}><Button className="cursor-pointer mt-4">Về danh sách ca thi</Button></Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
