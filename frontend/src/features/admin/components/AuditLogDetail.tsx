'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { AppBadge } from '@/components/base/app-badge'
import { AppAvatar } from '@/components/base/app-avatar'
import { Separator } from '@/components/ui/separator'
import type { AuditLog } from '../types/admin.types'

interface AuditLogDetailProps {
  log: AuditLog
  onClose: () => void
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  if (data === undefined || data === null) return null
  const formatted = JSON.stringify(data, null, 2)
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <pre className="rounded-lg bg-slate-950 p-4 text-xs text-slate-200 overflow-auto max-h-48">
        {formatted}
      </pre>
    </div>
  )
}

export function AuditLogDetail({ log, onClose }: AuditLogDetailProps) {
  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Chi tiết nhật ký</SheetTitle>
          <SheetDescription>
            Thông tin chi tiết về hoạt động hệ thống
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3">
            <AppAvatar name={log.userName} size="md" />
            <div>
              <p className="font-medium">{log.userName}</p>
              <p className="text-sm text-muted-foreground">ID: {log.userId}</p>
            </div>
          </div>

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Thời gian</p>
              <p className="font-medium">{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hành động</p>
              <AppBadge semantic="info" size="sm">{log.action}</AppBadge>
            </div>
            <div>
              <p className="text-muted-foreground">Module</p>
              <AppBadge semantic="neutral" size="sm">{log.module}</AppBadge>
            </div>
            <div>
              <p className="text-muted-foreground">Đối tượng</p>
              <p className="font-medium">{log.resourceType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Resource ID</p>
              <p className="font-medium font-mono text-xs">{log.resourceId ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">IP Address</p>
              <code className="text-xs">{log.ipAddress}</code>
            </div>
            {log.userAgent && (
              <div className="col-span-2">
                <p className="text-muted-foreground">User Agent</p>
                <p className="text-xs break-all">{log.userAgent}</p>
              </div>
            )}
          </div>

          {/* Before/After JSON diff */}
          {(log.before !== undefined || log.after !== undefined) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="font-medium">Thay đổi dữ liệu</p>
                <JsonBlock label="Trước" data={log.before} />
                <JsonBlock label="Sau" data={log.after} />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
