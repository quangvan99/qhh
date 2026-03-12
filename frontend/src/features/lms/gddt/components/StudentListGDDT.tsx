'use client'

import { useParams, useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeft, Download, ClipboardEdit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/composite/page-header'
import { DataTable } from '@/components/patterns/data-table'
import { useGetGDDTStudents, useExportStudents } from '../api/gddt.api'
import type { GDDTStudent } from '../types/gddt.types'
import { toast } from 'sonner'

const genderMap: Record<string, string> = { male: 'Nam', female: 'Nữ' }
const conductMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  excellent: { label: 'Tốt', variant: 'default' },
  good: { label: 'Khá', variant: 'secondary' },
  average: { label: 'TB', variant: 'outline' },
  weak: { label: 'Yếu', variant: 'destructive' },
}

export function StudentListGDDT() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string

  const { data, isLoading } = useGetGDDTStudents(classId)
  const exportMutation = useExportStudents()

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(classId)
      toast.success('Xuất Excel thành công')
    } catch {
      toast.error('Xuất Excel thất bại')
    }
  }

  const columns: ColumnDef<GDDTStudent, unknown>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      size: 50,
    },
    { accessorKey: 'code', header: 'Mã HS', enableSorting: true },
    { accessorKey: 'name', header: 'Họ tên' },
    {
      accessorKey: 'dob',
      header: 'Ngày sinh',
      cell: ({ getValue }) => {
        const val = getValue() as string
        if (!val) return '—'
        return new Date(val).toLocaleDateString('vi-VN')
      },
    },
    {
      accessorKey: 'gender',
      header: 'Giới tính',
      cell: ({ getValue }) => {
        const val = getValue() as string
        return <Badge variant="outline">{genderMap[val] ?? val}</Badge>
      },
    },
    {
      accessorKey: 'conduct',
      header: 'Hạnh kiểm',
      cell: ({ getValue }) => {
        const val = getValue() as string
        const config = conductMap[val]
        if (!config) return val
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'avgScore',
      header: 'Điểm TB',
      cell: ({ getValue }) => {
        const val = getValue() as number
        return val?.toFixed(1) ?? '—'
      },
    },
    {
      accessorKey: 'conductScore',
      header: 'Điểm RL',
      cell: ({ getValue }) => {
        const val = getValue() as number | undefined
        return val !== undefined ? val : '—'
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => router.push(`/gddt/conduct-score/input/${row.original.id}`)}
        >
          <ClipboardEdit className="h-4 w-4 mr-1" />
          Nhập điểm RL
        </Button>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Học sinh"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Lớp học', href: '/gddt/classes' },
          { label: 'Học sinh' },
        ]}
        actions={[
          {
            label: 'Quay lại',
            onClick: () => router.back(),
            variant: 'outline',
            icon: <ArrowLeft className="h-4 w-4" />,
          },
          {
            label: 'Xuất Excel',
            onClick: handleExport,
            icon: <Download className="h-4 w-4" />,
            loading: exportMutation.isPending,
          },
        ]}
      />

      {/* Class info card */}
      {data && data.data.length > 0 && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap gap-6 py-3 text-sm">
            <div>
              <span className="text-muted-foreground">Sĩ số:</span>{' '}
              <span className="font-medium">{data.total}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm học sinh..."
      />
    </div>
  )
}
