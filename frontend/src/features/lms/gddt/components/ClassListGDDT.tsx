'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { RefreshCw, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/composite/page-header'
import { SearchBar } from '@/components/composite/search-bar'
import { DataTable } from '@/components/patterns/data-table'
import { useGetGDDTClasses, useSyncGDDTClasses } from '../api/gddt.api'
import type { GDDTClass } from '../types/gddt.types'
import { toast } from 'sonner'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i
  return `${y}-${y + 1}`
})

const syncStatusMap: Record<GDDTClass['syncStatus'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  synced: { label: 'Đã sync', variant: 'default' },
  pending: { label: 'Chưa sync', variant: 'secondary' },
  error: { label: 'Lỗi', variant: 'destructive' },
}

export function ClassListGDDT() {
  const router = useRouter()
  const [year, setYear] = useState(yearOptions[0] ?? '')
  const [grade, setGrade] = useState<string>('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetGDDTClasses({ year, grade: grade || undefined, q: search || undefined })
  const syncMutation = useSyncGDDTClasses()

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync()
      toast.success('Đồng bộ thành công')
    } catch {
      toast.error('Đồng bộ thất bại')
    }
  }

  const columns: ColumnDef<GDDTClass, unknown>[] = [
    { accessorKey: 'code', header: 'Mã lớp', enableSorting: true },
    { accessorKey: 'name', header: 'Tên lớp' },
    { accessorKey: 'grade', header: 'Khối' },
    { accessorKey: 'teacher', header: 'GVCN' },
    { accessorKey: 'studentCount', header: 'Sĩ số', enableSorting: true },
    {
      accessorKey: 'syncStatus',
      header: 'Trạng thái',
      cell: ({ getValue }) => {
        const status = getValue() as GDDTClass['syncStatus']
        const config = syncStatusMap[status]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'lastSyncAt',
      header: 'Lần cuối sync',
      cell: ({ getValue }) => {
        const val = getValue() as string
        if (!val) return '—'
        return new Date(val).toLocaleString('vi-VN')
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
          onClick={() => router.push(`/gddt/classes/${row.original.id}/students`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Xem HS
        </Button>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Lớp học – GDĐT"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Lớp học' },
        ]}
        actions={[
          {
            label: 'Đồng bộ GDĐT',
            onClick: handleSync,
            icon: <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />,
            loading: syncMutation.isPending,
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={year} onValueChange={(v) => setYear(v ?? '')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Năm học" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={grade} onValueChange={(v) => setGrade(v ?? '')}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tất cả khối" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="10">Khối 10</SelectItem>
            <SelectItem value="11">Khối 11</SelectItem>
            <SelectItem value="12">Khối 12</SelectItem>
          </SelectContent>
        </Select>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm lớp..."
          className="max-w-xs"
        />
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        searchable={false}
      />
    </div>
  )
}
