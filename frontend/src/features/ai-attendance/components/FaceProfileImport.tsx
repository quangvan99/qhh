'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageHeader } from '@/components/composite'
import { ImportStepper } from '@/components/patterns'
import type { ImportPreviewData, ImportResult } from '@/components/patterns'

export function FaceProfileImport() {
  const router = useRouter()

  const handleUpload = async (file: File): Promise<ImportPreviewData> => {
    // In production, this would parse the ZIP/CSV and return preview data.
    // For now, return mock preview data based on file name.
    void file.name
    return {
      headers: ['Mã HS', 'Họ tên', 'Lớp', 'Số ảnh'],
      rows: [
        ['HS2024001', 'Nguyễn Văn An', '10A1', '5'],
        ['HS2024002', 'Trần Thị Bình', '10A1', '3'],
        ['HS2024003', 'Lê Hoàng Cường', '10A2', '4'],
        ['HS2024004', 'Phạm Minh Đức', '11B1', '6'],
        ['HS2024005', 'Hoàng Thị Em', '11B1', '2'],
      ],
      totalRows: 5,
    }
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    // In production, this calls useImportFaceProfiles
    void data.totalRows
    return { success: 5, failed: 0 }
  }

  const handleClose = () => {
    toast.info('Đóng trình nhập dữ liệu')
    router.push('/ai-attendance/faces')
  }

  return (
    <div>
      <PageHeader
        title="Nhập khuôn mặt hàng loạt"
        subtitle="Import danh sách ảnh khuôn mặt từ file ZIP hoặc CSV"
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Khuôn mặt', href: '/ai-attendance/faces' },
          { label: 'Nhập hàng loạt' },
        ]}
      />
      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={handleClose}
        accept=".zip,.csv,.xlsx"
        className="max-w-3xl"
      />
    </div>
  )
}
