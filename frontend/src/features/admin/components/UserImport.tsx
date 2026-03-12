'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'

export function UserImport() {
  const router = useRouter()

  const handleUpload = async (_file: File): Promise<ImportPreviewData> => {
    // Client-side preview - parse headers from file name for now
    // Real implementation would use xlsx library
    return {
      headers: ['Họ tên', 'Username', 'Email', 'Vai trò', 'Mã đơn vị'],
      rows: [],
      totalRows: 0,
    }
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    // The actual import is handled by the API via file upload
    // This is a simplified version
    return { success: data.totalRows, failed: 0 }
  }

  return (
    <div>
      <PageHeader
        title="Import người dùng"
        subtitle="Nhập danh sách người dùng từ file Excel"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/users' },
          { label: 'Người dùng', href: '/admin/users' },
          { label: 'Import' },
        ]}
      />
      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/admin/users')}
        templateUrl="/templates/user-import-template.xlsx"
        className="max-w-3xl"
      />
    </div>
  )
}
