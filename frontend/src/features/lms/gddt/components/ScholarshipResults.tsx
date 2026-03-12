'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Download, Printer, Users, Banknote, Percent } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/composite/page-header'
import { SearchBar } from '@/components/composite/search-bar'
import { DataTable } from '@/components/patterns/data-table'
import { StatGrid } from '@/components/patterns/stat-grid'
import {
  useGetScholarshipResults,
  useGetScholarshipSessions,
  useGetScholarshipLevels,
  useExportScholarshipResults,
} from '../api/gddt.api'
import type { ScholarshipResult } from '../types/gddt.types'
import { toast } from 'sonner'

export function ScholarshipResults() {
  const [sessionId, setSessionId] = useState('')
  const [level, setLevel] = useState('')
  const [grade, setGrade] = useState('')
  const [search, setSearch] = useState('')

  const { data: sessions } = useGetScholarshipSessions()
  const { data: levels } = useGetScholarshipLevels()
  const { data, isLoading } = useGetScholarshipResults({
    sessionId: sessionId || undefined,
    level: level || undefined,
    grade: grade || undefined,
    q: search || undefined,
  })
  const exportMutation = useExportScholarshipResults()

  const handleExport = async () => {
    if (!sessionId) {
      toast.error('Chọn đợt xét tuyển trước')
      return
    }
    try {
      await exportMutation.mutateAsync({ sessionId, level: level || undefined, grade: grade || undefined })
      toast.success('Xuất Excel thành công')
    } catch {
      toast.error('Xuất Excel thất bại')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const columns: ColumnDef<ScholarshipResult, unknown>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      size: 50,
    },
    { accessorKey: 'studentCode', header: 'Mã HS' },
    { accessorKey: 'studentName', header: 'Họ tên' },
    { accessorKey: 'className', header: 'Lớp' },
    {
      accessorKey: 'avgScore',
      header: 'Điểm TB',
      cell: ({ getValue }) => (getValue() as number).toFixed(1),
    },
    { accessorKey: 'conduct', header: 'Hạnh kiểm' },
    { accessorKey: 'conductScore', header: 'Điểm RL' },
    {
      accessorKey: 'levelName',
      header: 'Mức học bổng',
      cell: ({ getValue }) => <Badge variant="default">{getValue() as string}</Badge>,
    },
    {
      accessorKey: 'scholarshipValue',
      header: 'Giá trị',
      cell: ({ getValue }) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getValue() as number),
    },
    { accessorKey: 'note', header: 'Ghi chú' },
  ]

  const summary = data?.summary

  return (
    <div>
      <PageHeader
        title="Kết quả học bổng"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Học bổng', href: '/gddt/scholarship/levels' },
          { label: 'Kết quả' },
        ]}
        actions={[
          {
            label: 'Xuất Excel',
            onClick: handleExport,
            icon: <Download className="h-4 w-4" />,
            loading: exportMutation.isPending,
          },
          {
            label: 'In danh sách',
            onClick: handlePrint,
            variant: 'outline',
            icon: <Printer className="h-4 w-4" />,
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={sessionId} onValueChange={(v) => setSessionId(v ?? '')}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Chọn đợt xét tuyển" />
          </SelectTrigger>
          <SelectContent>
            {(sessions ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={level} onValueChange={(v) => setLevel(v ?? '')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả mức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {(levels ?? []).map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
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
          placeholder="Tìm HS..."
          className="max-w-xs"
        />
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="mb-4">
          <StatGrid
            cols={3}
            stats={[
              {
                title: 'Tổng số HS đạt',
                value: summary.totalStudents,
                icon: <Users className="h-5 w-5" />,
                module: 'lms',
              },
              {
                title: 'Tổng giá trị học bổng',
                value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary.totalValue),
                icon: <Banknote className="h-5 w-5" />,
                module: 'lms',
              },
              {
                title: '% HS đạt / tổng HS',
                value: `${summary.percentage.toFixed(1)}%`,
                icon: <Percent className="h-5 w-5" />,
                module: 'lms',
              },
            ]}
          />
        </div>
      )}

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        searchable={false}
      />
    </div>
  )
}
