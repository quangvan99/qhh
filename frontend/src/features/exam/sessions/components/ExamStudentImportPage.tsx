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
interface ImportStudentRow {
  row: number
  studentCode: string
  studentName: string
  className: string
  registrationNumber: string
  room: string
  seatNumber: string
  valid: boolean
  error?: string
}

// ── Mock preview 5 students ──
const mockPreviewRows: ImportStudentRow[] = [
  { row: 1, studentCode: 'HS0001', studentName: 'Nguyễn Văn An', className: '12A1', registrationNumber: '001', room: 'P.101', seatNumber: '1', valid: true },
  { row: 2, studentCode: 'HS0002', studentName: 'Trần Thị Bình', className: '12A1', registrationNumber: '002', room: 'P.101', seatNumber: '2', valid: true },
  { row: 3, studentCode: 'HS0003', studentName: 'Lê Hoàng Cường', className: '12A2', registrationNumber: '003', room: 'P.101', seatNumber: '3', valid: true },
  { row: 4, studentCode: 'HS9999', studentName: 'Phạm Thị Dung', className: '12A2', registrationNumber: '004', room: 'P.102', seatNumber: '1', valid: false, error: 'Mã HS không tồn tại' },
  { row: 5, studentCode: 'HS0005', studentName: 'Hoàng Văn Em', className: '12A3', registrationNumber: '005', room: 'P.102', seatNumber: '2', valid: true },
]

const steps = ['Upload file', 'Xem trước dữ liệu', 'Xác nhận import']

export function ExamStudentImportPage({ sessionId, examId }: { sessionId: string; examId: string }) {
  const [step, setStep] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  const validCount = mockPreviewRows.filter((r) => r.valid).length
  const errorCount = mockPreviewRows.filter((r) => !r.valid).length

  const handleFileSelect = useCallback(() => {
    setFileName('ds_hocsinh_ca1.xlsx')
    toast.success('Đã tải file lên thành công')
    setTimeout(() => setStep(1), 500)
  }, [])

  const handleImport = useCallback(() => {
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setDone(true)
      setStep(2)
      toast.success(`Đã import ${validCount} học sinh thành công`)
    }, 1500)
  }, [validCount])

  const previewColumns: ColumnDef<ImportStudentRow, unknown>[] = [
    { accessorKey: 'row', header: '#', size: 50 },
    { accessorKey: 'studentCode', header: 'Mã HS' },
    { accessorKey: 'studentName', header: 'Họ tên' },
    { accessorKey: 'className', header: 'Lớp' },
    { accessorKey: 'registrationNumber', header: 'SBD' },
    { accessorKey: 'room', header: 'Phòng' },
    { accessorKey: 'seatNumber', header: 'Số ghế' },
    {
      id: 'status', header: 'Trạng thái', size: 150,
      cell: ({ row }) => row.original.valid
        ? <AppBadge semantic="success" size="sm">Hợp lệ</AppBadge>
        : <AppBadge semantic="error" size="sm">{row.original.error}</AppBadge>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Import học sinh vào ca thi"
        breadcrumbs={[
          { label: 'Tổ chức thi', href: '/exam/sessions' },
          { label: 'Ca thi', href: `/exam/sessions/${sessionId}/exams` },
          { label: 'Học sinh', href: `/exam/sessions/${sessionId}/exams/${examId}/students` },
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
                Tải lên file Excel chứa danh sách học sinh. File cần có các cột: Mã HS, Họ tên, Lớp, SBD, Phòng, Số ghế.
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
              {importing ? 'Đang import...' : `Import ${validCount} học sinh`}
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
            <p className="text-sm text-muted-foreground mb-1">Đã import {validCount} học sinh vào ca thi.</p>
            {errorCount > 0 && <p className="text-sm text-destructive mb-4">{errorCount} dòng bị bỏ qua do lỗi.</p>}
            <Link href={`/exam/sessions/${sessionId}/exams/${examId}/students`}><Button className="cursor-pointer mt-4">Về danh sách học sinh</Button></Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
