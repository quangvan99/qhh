'use client'

import { useState, useCallback } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import Link from 'next/link'

// ── Types ──
interface ImportExceptionRow {
  row: number
  studentCode: string
  studentName: string
  exceptionType: string
  extraMinutes: number | null
  note: string
  valid: boolean
  error?: string
}

// ── Mock preview ──
const mockPreviewRows: ImportExceptionRow[] = [
  { row: 1, studentCode: 'HS0001', studentName: 'Nguyễn Văn An', exceptionType: 'Thêm giờ', extraMinutes: 15, note: 'Khuyết tật vận động', valid: true },
  { row: 2, studentCode: 'HS0002', studentName: 'Trần Thị Bình', exceptionType: 'Phòng riêng', extraMinutes: null, note: 'Cần phòng yên tĩnh', valid: true },
  { row: 3, studentCode: 'HS0003', studentName: 'Lê Hoàng Cường', exceptionType: 'Hỗ trợ đặc biệt', extraMinutes: null, note: 'Cần người đọc đề', valid: true },
  { row: 4, studentCode: 'HS0004', studentName: 'Phạm Thị Dung', exceptionType: 'Thêm giờ', extraMinutes: 30, note: 'Khiếm thị', valid: true },
  { row: 5, studentCode: 'HS9999', studentName: '', exceptionType: 'Thêm giờ', extraMinutes: 10, note: '', valid: false, error: 'Mã HS không tồn tại' },
]

const steps = ['Upload file', 'Xem trước dữ liệu', 'Xác nhận import']

export function ExceptionImportPage({ sessionId, examId }: { sessionId: string; examId: string }) {
  const [step, setStep] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  const validCount = mockPreviewRows.filter((r) => r.valid).length
  const errorCount = mockPreviewRows.filter((r) => !r.valid).length

  const handleFileSelect = useCallback(() => {
    setFileName('ngoai_le_ca1.xlsx')
    toast.success('Đã tải file lên thành công')
    setTimeout(() => setStep(1), 500)
  }, [])

  const handleImport = useCallback(() => {
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setDone(true)
      setStep(2)
      toast.success(`Đã import ${validCount} ngoại lệ thành công`)
    }, 1500)
  }, [validCount])

  const previewColumns: ColumnDef<ImportExceptionRow, unknown>[] = [
    { accessorKey: 'row', header: '#', size: 50 },
    { accessorKey: 'studentCode', header: 'Mã HS' },
    { accessorKey: 'studentName', header: 'Họ tên' },
    {
      accessorKey: 'exceptionType', header: 'Loại ngoại lệ',
      cell: ({ row }) => {
        const type = row.original.exceptionType
        const variant = type === 'Thêm giờ' ? 'warning' : type === 'Phòng riêng' ? 'info' : 'neutral'
        return <AppBadge semantic={variant} size="sm">{type}</AppBadge>
      },
    },
    {
      accessorKey: 'extraMinutes', header: 'Phút thêm', size: 80,
      cell: ({ row }) => row.original.extraMinutes ? `+${row.original.extraMinutes}` : '—',
    },
    { accessorKey: 'note', header: 'Ghi chú' },
    {
      id: 'status', header: 'Trạng thái', size: 160,
      cell: ({ row }) => row.original.valid
        ? <AppBadge semantic="success" size="sm">Hợp lệ</AppBadge>
        : <AppBadge semantic="error" size="sm">{row.original.error}</AppBadge>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Import ngoại lệ từ Excel"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh', href: `/exam/sessions/${sessionId}/exams/${examId}/students` },
          { label: 'Import ngoại lệ' },
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
              <h3 className="font-semibold text-lg mb-2">Upload file ngoại lệ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tải lên file Excel chứa danh sách ngoại lệ. File cần có các cột: Mã HS, Loại ngoại lệ, Phút thêm, Ghi chú.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Loại ngoại lệ: <strong>Thêm giờ</strong>, <strong>Phòng riêng</strong>, <strong>Hỗ trợ đặc biệt</strong>
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
              {importing ? 'Đang import...' : `Import ${validCount} ngoại lệ`}
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
            <p className="text-sm text-muted-foreground mb-1">Đã import {validCount} ngoại lệ cho ca thi.</p>
            {errorCount > 0 && <p className="text-sm text-destructive mb-4">{errorCount} dòng bị bỏ qua do lỗi.</p>}
            <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students`}><Button className="cursor-pointer mt-4">Về danh sách học sinh</Button></Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
