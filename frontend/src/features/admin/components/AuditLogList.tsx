'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/composite/page-header'
import { SearchBar } from '@/components/composite/search-bar'
import { DataTable } from '@/components/patterns/data-table'
import { useGetAuditLogs } from '../api/admin.api'
import type { AuditLog } from '../types/admin.types'
import { AuditLogDetail } from './AuditLogDetail'

const moduleOptions = [
  { value: '', label: 'Tất cả module' },
  { value: 'lms', label: 'LMS' },
  { value: 'exam', label: 'Thi & Kiểm tra' },
  { value: 'ai-attendance', label: 'AI Điểm danh' },
  { value: 'library', label: 'Thư viện' },
  { value: 'admin', label: 'Quản trị' },
  { value: 'system', label: 'Hệ thống' },
]

export function AuditLogList() {
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const { data, isLoading } = useGetAuditLogs({
    userId: search || undefined,
    module: moduleFilter || undefined,
    action: actionFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const logs = data?.data ?? []

  const columns: ColumnDef<AuditLog, unknown>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Thời gian',
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      accessorKey: 'userName',
      header: 'Người dùng',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar name={row.original.userName} size="xs" />
          <span className="text-sm">{row.original.userName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Hành động',
      cell: ({ row }) => <AppBadge semantic="info" size="sm">{row.original.action}</AppBadge>,
    },
    {
      accessorKey: 'module',
      header: 'Module',
      cell: ({ row }) => <AppBadge semantic="neutral" size="sm">{row.original.module}</AppBadge>,
    },
    { accessorKey: 'resourceType', header: 'Đối tượng' },
    {
      accessorKey: 'ipAddress',
      header: 'Địa chỉ IP',
      cell: ({ row }) => <code className="text-xs">{row.original.ipAddress}</code>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Nhật ký hệ thống"
        subtitle="Theo dõi các hoạt động trong hệ thống"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/audit-log' },
          { label: 'Nhật ký' },
        ]}
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo người dùng..." className="max-w-xs" />
        <AppSelect options={moduleOptions} value={moduleFilter} onChange={setModuleFilter} placeholder="Module" className="w-40" />
        <Input value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} placeholder="Hành động" className="w-36" />
        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
      </div>

      <DataTable
        data={logs}
        columns={[
          ...columns,
          {
            id: 'detail',
            header: '',
            cell: ({ row }) => (
              <button
                type="button"
                className="text-xs text-primary hover:underline cursor-pointer"
                onClick={() => setSelectedLog(row.original)}
              >
                Chi tiết
              </button>
            ),
            enableSorting: false,
            size: 60,
          },
        ]}
        loading={isLoading}
      />

      {selectedLog && (
        <AuditLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  )
}
