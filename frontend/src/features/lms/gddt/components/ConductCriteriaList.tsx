'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CrudPage } from '@/components/patterns/crud-page'
import {
  useGetConductCriteria,
  useDeleteConductCriteria,
  useBulkDeleteConductCriteria,
} from '../api/gddt.api'
import type { ConductCriteria } from '../types/gddt.types'
import { toast } from 'sonner'

const groupLabels: Record<string, string> = {
  study: 'Học tập',
  activity: 'Hoạt động',
  lifestyle: 'Nếp sống',
  labor: 'Lao động',
  other: 'Khác',
}

export function ConductCriteriaList() {
  const router = useRouter()
  const { data, isLoading } = useGetConductCriteria()
  const deleteMutation = useDeleteConductCriteria()
  const bulkDeleteMutation = useBulkDeleteConductCriteria()

  const columns: ColumnDef<ConductCriteria, unknown>[] = [
    { accessorKey: 'code', header: 'Mã tiêu chí' },
    { accessorKey: 'name', header: 'Tên tiêu chí' },
    { accessorKey: 'maxScore', header: 'Điểm tối đa' },
    {
      accessorKey: 'group',
      header: 'Nhóm tiêu chí',
      cell: ({ getValue }) => {
        const val = getValue() as string
        return <Badge variant="outline">{groupLabels[val] ?? val}</Badge>
      },
    },
    {
      accessorKey: 'grades',
      header: 'Áp dụng cho khối',
      cell: ({ getValue }) => {
        const grades = getValue() as string[]
        return grades.length === 3 ? 'Tất cả' : grades.map((g) => `K${g}`).join(', ')
      },
    },
    {
      accessorKey: 'active',
      header: 'Trạng thái',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'default' : 'secondary'}>
          {getValue() ? 'Đang dùng' : 'Tạm dừng'}
        </Badge>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Thứ tự',
      enableSorting: true,
    },
  ]

  const handleDelete = async (row: ConductCriteria) => {
    try {
      await deleteMutation.mutateAsync(row.id)
      toast.success('Xóa tiêu chí thành công')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const handleBulkDelete = async (rows: ConductCriteria[]) => {
    try {
      await bulkDeleteMutation.mutateAsync(rows.map((r) => r.id))
      toast.success(`Xóa ${rows.length} tiêu chí thành công`)
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <CrudPage
      title="Cấu hình điểm rèn luyện"
      breadcrumbs={[
        { label: 'GDĐT', href: '/gddt/classes' },
        { label: 'Điểm rèn luyện' },
      ]}
      data={data ?? []}
      columns={columns}
      loading={isLoading}
      onCreate={() => router.push('/gddt/conduct-score/new')}
      onEdit={(row) => router.push(`/gddt/conduct-score/${row.id}/edit`)}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      searchPlaceholder="Tìm tiêu chí..."
      extraActions={[
        {
          label: 'Import Excel',
          onClick: () => router.push('/gddt/conduct-score/import'),
          variant: 'outline',
          icon: <Upload className="h-4 w-4" />,
        },
      ]}
    />
  )
}
