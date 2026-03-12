'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetPortalContents, useDeletePortalContent } from '@/features/library/api/library.api'
import type { PortalContent } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { toast } from 'sonner'

const typeLabel: Record<string, string> = {
  introduction: 'Giới thiệu',
  contact: 'Liên hệ',
  regulation: 'Quy định',
  schedule: 'Lịch hoạt động',
}

const mockData: PortalContent[] = [
  { id: '1', title: 'Giới thiệu thư viện', type: 'introduction', content: 'Thư viện THPT Quốc Học Huế...', isActive: true, displayOrder: 1, updatedAt: '2025-12-01T10:00:00Z' },
  { id: '2', title: 'Thông tin liên hệ', type: 'contact', content: 'Địa chỉ: 10 Lê Lợi, TP Huế...', isActive: true, displayOrder: 2, updatedAt: '2025-11-15T08:30:00Z' },
  { id: '3', title: 'Nội quy thư viện', type: 'regulation', content: 'Quy định sử dụng thư viện...', isActive: true, displayOrder: 3, updatedAt: '2025-10-20T14:00:00Z' },
  { id: '4', title: 'Lịch hoạt động thư viện', type: 'schedule', content: 'Thứ 2 - Thứ 6: 7:00 - 17:00...', isActive: true, displayOrder: 4, updatedAt: '2025-11-28T09:15:00Z' },
  { id: '5', title: 'Quy định mượn trả sách', type: 'regulation', content: 'Thời hạn mượn: 14 ngày...', isActive: false, displayOrder: 5, updatedAt: '2025-09-10T11:00:00Z' },
  { id: '6', title: 'Hướng dẫn sử dụng OPAC', type: 'introduction', content: 'Hướng dẫn tra cứu tài liệu...', isActive: true, displayOrder: 6, updatedAt: '2025-12-05T16:45:00Z' },
]

const columns: ColumnDef<PortalContent, unknown>[] = [
  { accessorKey: 'title', header: 'Tiêu đề' },
  {
    accessorKey: 'type',
    header: 'Loại',
    size: 150,
    cell: ({ getValue }) => typeLabel[getValue() as string] ?? getValue(),
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    size: 120,
    cell: ({ getValue }) => (
      <AppBadge semantic={getValue() ? 'success' : 'neutral'} size="sm">
        {getValue() ? 'Active' : 'Inactive'}
      </AppBadge>
    ),
  },
  {
    accessorKey: 'displayOrder',
    header: 'Thứ tự',
    size: 80,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Cập nhật lần cuối',
    size: 160,
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('vi-VN'),
  },
]

export function PortalContentListPage() {
  const { data: apiData, isLoading } = useGetPortalContents()
  const deleteMut = useDeletePortalContent()
  const router = useRouter()
  const [useMock] = useState(true)

  const data = useMemo(() => {
    if (useMock || !apiData) return mockData
    return apiData
  }, [apiData, useMock])

  const handleDelete = (row: PortalContent) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa nội dung'),
      onError: () => toast.error('Không thể xóa nội dung'),
    })
  }

  return (
    <CrudPage<PortalContent>
      title="Nội dung thông tin thư viện"
      subtitle="Quản lý nội dung tĩnh hiển thị trên portal thư viện"
      breadcrumbs={[
        { label: 'Thư viện', href: '/library/catalog' },
        { label: 'Portal CMS' },
        { label: 'Nội dung' },
      ]}
      data={data}
      columns={columns}
      loading={isLoading && !useMock}
      onCreate={() => router.push('/library/portal-content/new')}
      onEdit={(row) => router.push(`/library/portal-content/${row.id}/edit`)}
      onDelete={handleDelete}
      searchPlaceholder="Tìm nội dung..."
    />
  )
}
