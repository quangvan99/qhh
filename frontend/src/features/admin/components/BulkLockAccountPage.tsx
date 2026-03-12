'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'
import { AlertTriangle } from 'lucide-react'

export function BulkLockAccountPage() {
  const router = useRouter()

  const handleUpload = async (_file: File): Promise<ImportPreviewData> => {
    return {
      headers: ['Username', 'Hành động'],
      rows: [
        ['nguyenvana', 'lock'],
        ['tranthibinh', 'lock'],
        ['lehoangcuong', 'unlock'],
        ['phamminhduc', 'lock'],
        ['hoangthihoa', 'unlock'],
      ],
      totalRows: 5,
    }
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    return { success: data.totalRows, failed: 0 }
  }

  return (
    <div>
      <PageHeader
        title="Khóa/Mở khóa tài khoản hàng loạt"
        subtitle="Khóa hoặc mở khóa nhiều tài khoản từ file Excel"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/users' },
          { label: 'Người dùng', href: '/admin/users' },
          { label: 'Khóa/Mở khóa hàng loạt' },
        ]}
      />

      {/* Warning Banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Lưu ý</p>
          <p className="text-sm text-amber-700 mt-1">
            File Excel phải chứa 2 cột: <strong>username</strong> và <strong>action</strong> (lock / unlock).
            Tài khoản bị khóa sẽ không thể đăng nhập cho đến khi được mở khóa.
          </p>
        </div>
      </div>

      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/admin/users')}
        templateUrl="/templates/bulk-lock-template.xlsx"
        className="max-w-3xl"
      />
    </div>
  )
}
