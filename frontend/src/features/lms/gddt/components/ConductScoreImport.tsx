'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'
import { useImportConductScores } from '../api/gddt.api'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export function ConductScoreImport() {
  const router = useRouter()
  const importMutation = useImportConductScores()

  const handleUpload = async (file: File): Promise<ImportPreviewData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          if (!sheetName) {
            reject(new Error('File không có sheet nào'))
            return
          }
          const sheet = workbook.Sheets[sheetName]
          if (!sheet) {
            reject(new Error('Không đọc được sheet'))
            return
          }
          const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })
          const headers = (jsonData[0] ?? []).map(String)
          const rows = jsonData.slice(1).map((row) => row.map(String))
          const errors: { row: number; message: string }[] = []

          // Basic validation
          rows.forEach((row, i) => {
            if (!row[0]) {
              errors.push({ row: i + 2, message: 'Thiếu mã học sinh' })
            }
          })

          resolve({
            headers,
            rows,
            totalRows: rows.length,
            errors: errors.length > 0 ? errors : undefined,
          })
        } catch {
          reject(new Error('Không thể đọc file Excel'))
        }
      }
      reader.onerror = () => reject(new Error('Lỗi đọc file'))
      reader.readAsBinaryString(file)
    })
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    try {
      // Create a temporary file from preview data for the API
      const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const file = new File([buffer], 'import.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const result = await importMutation.mutateAsync(file)
      toast.success(`Import thành công: ${result.imported} dòng`)
      return {
        success: result.imported,
        failed: result.errors?.length ?? 0,
        errors: result.errors,
      }
    } catch {
      throw new Error('Lỗi import dữ liệu')
    }
  }

  return (
    <div>
      <PageHeader
        title="Import điểm rèn luyện từ Excel"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Điểm rèn luyện', href: '/gddt/conduct-score' },
          { label: 'Import Excel' },
        ]}
      />
      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/gddt/conduct-score')}
        templateUrl="/templates/conduct-score-template.xlsx"
      />
    </div>
  )
}
