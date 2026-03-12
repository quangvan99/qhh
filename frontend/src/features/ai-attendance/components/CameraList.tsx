'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Wifi } from 'lucide-react'
import { toast } from 'sonner'
import { CrudPage } from '@/components/patterns'
import { AppButton } from '@/components/base'
import { useGetCameras, useDeleteCamera, useTestCameraConnection } from '../api/attendance.api'
import { CameraStatusBadge } from './CameraStatusBadge'
import type { Camera } from '../types/attendance.types'

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.floor(hours / 24)} ngày trước`
}

export function CameraList() {
  const router = useRouter()
  const { data: cameras = [], isLoading } = useGetCameras()
  const deleteCamera = useDeleteCamera()
  const testConnection = useTestCameraConnection()
  const [testingId, setTestingId] = useState<string | null>(null)

  const handleTest = async (camera: Camera) => {
    setTestingId(camera.id)
    try {
      const result = await testConnection.mutateAsync({
        ipAddress: camera.ipAddress,
        rtspUrl: camera.rtspUrl,
      })
      if (result.success) {
        toast.success(`Kết nối thành công (${result.latency}ms)`)
      } else {
        toast.error('Kết nối thất bại')
      }
    } catch {
      toast.error('Không thể kết nối đến camera')
    } finally {
      setTestingId(null)
    }
  }

  const columns: ColumnDef<Camera, unknown>[] = [
    { accessorKey: 'name', header: 'Tên camera' },
    { accessorKey: 'ipAddress', header: 'Địa chỉ IP' },
    { accessorKey: 'location', header: 'Địa điểm' },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => <CameraStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lastSeen',
      header: 'Lần cuối online',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatRelativeTime(row.original.lastSeen)}</span>,
    },
    {
      id: 'test',
      header: '',
      cell: ({ row }) => (
        <AppButton
          variant="outline"
          size="sm"
          module="ai"
          loading={testingId === row.original.id}
          onClick={() => void handleTest(row.original)}
          leftIcon={<Wifi className="h-3.5 w-3.5" />}
        >
          Test
        </AppButton>
      ),
      enableSorting: false,
      size: 100,
    },
  ]

  return (
    <CrudPage<Camera>
      title="Quản lý Camera"
      subtitle="Danh sách camera điểm danh AI"
      breadcrumbs={[
        { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
        { label: 'Camera' },
      ]}
      data={cameras}
      columns={columns}
      loading={isLoading}
      onCreate={() => router.push('/ai-attendance/cameras/new')}
      onEdit={(camera) => router.push(`/ai-attendance/cameras/${camera.id}/edit`)}
      onDelete={(camera) => deleteCamera.mutate(camera.id)}
      searchPlaceholder="Tìm camera..."
    />
  )
}
