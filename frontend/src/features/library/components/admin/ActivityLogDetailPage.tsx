'use client'

import { PageHeader } from '@/components/composite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppBadge } from '@/components/base'

interface ActivityLogDetailPageProps {
  logId: string
}

const mockLog = {
  id: '1',
  timestamp: '2026-03-12T10:30:00.000Z',
  userId: 'U100',
  userName: 'Nguyễn Văn An',
  userEmail: 'an.nguyen@qhlms.edu.vn',
  action: 'update',
  objectType: 'Book',
  objectName: 'Lập trình Python cơ bản',
  objectId: 'B001',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  dataBefore: JSON.stringify({ title: 'Lập trình Python', availableCopies: 3 }, null, 2),
  dataAfter: JSON.stringify({ title: 'Lập trình Python cơ bản', availableCopies: 5 }, null, 2),
}

const actionLabels: Record<string, string> = {
  create: 'Tạo mới',
  update: 'Cập nhật',
  delete: 'Xóa',
  borrow: 'Mượn sách',
  return: 'Trả sách',
}

const actionColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  create: 'success',
  update: 'warning',
  delete: 'error',
  borrow: 'info',
  return: 'neutral',
}

export function ActivityLogDetailPage({ logId }: ActivityLogDetailPageProps) {
  const log = { ...mockLog, id: logId }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Chi tiết nhật ký #${log.id}`}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Nhật ký sử dụng', href: '/library/activity-log' },
          { label: `Chi tiết #${log.id}` },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Tên" value={log.userName} />
            <InfoRow label="Email" value={log.userEmail} />
            <InfoRow label="User ID" value={log.userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin thao tác</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Thao tác</span>
              <AppBadge semantic={actionColors[log.action]}>
                {actionLabels[log.action] ?? log.action}
              </AppBadge>
            </div>
            <InfoRow label="Thời gian" value={new Date(log.timestamp).toLocaleString('vi-VN')} />
            <InfoRow label="Loại đối tượng" value={log.objectType} />
            <InfoRow label="Đối tượng" value={log.objectName} />
            <InfoRow label="Object ID" value={log.objectId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="IP Address" value={log.ipAddress} />
            <div>
              <span className="text-sm text-muted-foreground">User Agent</span>
              <p className="text-sm mt-1 break-all">{log.userAgent}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dữ liệu thay đổi (JSON Diff)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Trước</p>
                <pre className="text-xs bg-red-50 dark:bg-red-950/20 p-3 rounded-md overflow-auto max-h-48 border">
                  {log.dataBefore}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Sau</p>
                <pre className="text-xs bg-green-50 dark:bg-green-950/20 p-3 rounded-md overflow-auto max-h-48 border">
                  {log.dataAfter}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
