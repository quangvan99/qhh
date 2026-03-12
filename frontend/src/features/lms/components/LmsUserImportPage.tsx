'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'

export function LmsUserImportPage() {
  const router = useRouter()

  const handleUpload = async (_file: File): Promise<ImportPreviewData> => {
    return {
      headers: ['Họ tên', 'Username', 'Email', 'Vai trò LMS', 'Đơn vị'],
      rows: [],
      totalRows: 0,
    }
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    return { success: data.totalRows, failed: 0 }
  }

  return (
    <div>
      <PageHeader
        title="Import người dùng LMS"
        subtitle="Nhập danh sách người dùng LMS từ file Excel"
        breadcrumbs={[
          { label: 'LMS', href: '/lms/users' },
          { label: 'Người dùng', href: '/lms/users' },
          { label: 'Import' },
        ]}
      />
      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/lms/users')}
        templateUrl="/templates/lms-user-import-template.xlsx"
        className="max-w-3xl"
      />
    </div>
  )
}
