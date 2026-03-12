'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { AppBadge } from '@/components/base'
import { CrudPage } from '@/components/patterns'
import { useGetDevices, useDeleteDevice } from '../api/attendance.api'
import type { AttendanceDevice } from '../types/attendance.types'

export function DeviceList() {
  const router = useRouter()
  const { data: devices = [], isLoading } = useGetDevices()
  const deleteDevice = useDeleteDevice()

  const columns: ColumnDef<AttendanceDevice, unknown>[] = [
    { accessorKey: 'deviceId', header: 'Mã thiết bị' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'firmware', header: 'Firmware' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AppBadge
          semantic={row.original.status === 'active' ? 'success' : 'neutral'}
          dot={row.original.status === 'active'}
          size="sm"
        >
          {row.original.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </AppBadge>
      ),
    },
  ]

  return (
    <CrudPage<AttendanceDevice>
      title="Quản lý máy điểm danh"
      subtitle="Danh sách thiết bị điểm danh"
      breadcrumbs={[
        { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
        { label: 'Máy điểm danh' },
      ]}
      data={devices}
      columns={columns}
      loading={isLoading}
      onCreate={() => router.push('/ai-attendance/devices/new')}
      onEdit={(device) => router.push(`/ai-attendance/devices/${device.id}/edit`)}
      onDelete={(device) => deleteDevice.mutate(device.id)}
      searchPlaceholder="Tìm thiết bị..."
    />
  )
}
