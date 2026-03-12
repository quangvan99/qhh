'use client'

import { useRouter } from 'next/navigation'
import { Shield, Database, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AppBadge } from '@/components/base/app-badge'
import type { SemanticVariant } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { useGetIntegrations, useTestIntegration } from '../api/admin.api'
import type { Integration } from '../types/admin.types'
import { toast } from 'sonner'

const typeIcons: Record<string, React.ReactNode> = {
  sso: <Shield className="h-8 w-8 text-blue-600" />,
  lgsp: <Database className="h-8 w-8 text-green-600" />,
  email: <Mail className="h-8 w-8 text-amber-600" />,
  sms: <MessageSquare className="h-8 w-8 text-purple-600" />,
}

const statusVariant: Record<string, SemanticVariant> = {
  connected: 'success',
  disconnected: 'neutral',
  error: 'error',
}

const statusLabel: Record<string, string> = {
  connected: 'Đã kết nối',
  disconnected: 'Chưa kết nối',
  error: 'Lỗi',
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const router = useRouter()
  const testIntegration = useTestIntegration()

  const handleTest = () => {
    testIntegration.mutate(integration.id, {
      onSuccess: (data) => {
        const result = data as { success: boolean; message: string; latency?: number }
        if (result.success) {
          toast.success(`Kết nối thành công${result.latency ? ` (${result.latency}ms)` : ''}`)
        } else {
          toast.error(result.message)
        }
      },
      onError: () => toast.error('Không thể kiểm tra kết nối'),
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {typeIcons[integration.type] ?? <Database className="h-8 w-8" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{integration.name}</h3>
              <AppBadge
                semantic={statusVariant[integration.status] ?? 'neutral'}
                dot
                size="sm"
              >
                {statusLabel[integration.status] ?? integration.status}
              </AppBadge>
            </div>
            {integration.lastTestedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Kiểm tra lần cuối: {new Date(integration.lastTestedAt).toLocaleString('vi-VN')}
              </p>
            )}
            {integration.lastError && (
              <p className="text-xs text-destructive mt-1">{integration.lastError}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/integrations/${integration.id}`)}
            className="cursor-pointer"
          >
            Cấu hình
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testIntegration.isPending}
            className="cursor-pointer"
          >
            {testIntegration.isPending ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function IntegrationList() {
  const { data: integrations, isLoading } = useGetIntegrations()

  return (
    <div>
      <PageHeader
        title="Tích hợp & API"
        subtitle="Quản lý kết nối với các hệ thống bên ngoài"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/integrations' },
          { label: 'Tích hợp' },
        ]}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(integrations ?? []).map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      )}
    </div>
  )
}
