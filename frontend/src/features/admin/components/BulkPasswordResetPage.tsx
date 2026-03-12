'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/composite/page-header'
import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'
import { AlertTriangle } from 'lucide-react'

export function BulkPasswordResetPage() {
  const router = useRouter()

  const handleUpload = async (_file: File): Promise<ImportPreviewData> => {
    return {
      headers: ['Username', 'Mật khẩu mới'],
      rows: [
        ['nguyenvana', '********'],
        ['tranthibinh', '********'],
        ['lehoangcuong', '********'],
      ],
      totalRows: 3,
    }
  }

  const handleConfirm = async (data: ImportPreviewData): Promise<ImportResult> => {
    return { success: data.totalRows, failed: 0 }
  }

  return (
    <div>
      <PageHeader
        title="Đổi mật khẩu hàng loạt"
        subtitle="Đổi mật khẩu nhiều tài khoản từ file Excel"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/users' },
          { label: 'Người dùng', href: '/admin/users' },
          { label: 'Đổi mật khẩu hàng loạt' },
        ]}
      />

      {/* Warning Banner */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-800">Cảnh báo bảo mật</p>
          <p className="text-sm text-red-700 mt-1">
            Thao tác này sẽ đổi mật khẩu cho tất cả tài khoản trong file Excel.
            Người dùng sẽ cần sử dụng mật khẩu mới để đăng nhập.
            Hãy đảm bảo thông báo cho người dùng bị ảnh hưởng.
          </p>
        </div>
      </div>

      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/admin/users')}
        templateUrl="/templates/bulk-password-template.xlsx"
        className="max-w-3xl"
      />
    </div>
  )
}
