'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { useGetBorrows } from '@/features/library/api/library.api'
import type { BorrowRecord } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { DataTable } from '@/components/patterns'

const statusLabel: Record<string, string> = {
  borrowed: 'Đang mượn',
  returned: 'Đã trả',
  overdue: 'Quá hạn',
}

const statusSemantic: Record<string, 'info' | 'success' | 'error'> = {
  borrowed: 'info',
  returned: 'success',
  overdue: 'error',
}

interface BorrowListProps {
  status?: string
  title?: string
}

export function BorrowList({ status, title }: BorrowListProps) {
  const { data: borrowsData, isLoading } = useGetBorrows({
    status: status ?? '',
    overdue: status === 'overdue',
  })

  const columns: ColumnDef<BorrowRecord, unknown>[] = [
    { accessorKey: 'memberName', header: 'Người mượn' },
    { accessorKey: 'bookTitle', header: 'Tài liệu' },
    {
      accessorKey: 'borrowedAt',
      header: 'Ngày mượn',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'dueDate',
      header: 'Hạn trả',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        return (
          <AppBadge semantic={statusSemantic[val] ?? 'neutral'}>
            {statusLabel[val] ?? val}
          </AppBadge>
        )
      },
    },
    {
      accessorKey: 'fineAmount',
      header: 'Phí phạt',
      size: 100,
      cell: ({ getValue }) => {
        const val = getValue<number | undefined>()
        return val ? `${val.toLocaleString('vi-VN')}đ` : '—'
      },
    },
  ]

  const pageTitle = title ?? (status === 'overdue' ? 'Sách quá hạn' : status === 'borrowed' ? 'Sách đang mượn' : 'Lịch sử mượn trả')

  return (
    <div className="space-y-4">
      <PageHeader
        title={pageTitle}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Lưu thông' },
          { label: pageTitle },
        ]}
      />
      <DataTable<BorrowRecord>
        data={borrowsData?.data ?? []}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm theo tên người mượn, tài liệu..."
      />
    </div>
  )
}
