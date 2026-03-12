'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AppBadge } from '@/components/base/app-badge'
import type { SemanticVariant } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetIntegration, useUpdateIntegration, useTestIntegration } from '../api/admin.api'
import { toast } from 'sonner'

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

interface IntegrationConfigProps {
  integrationId: string
}

export function IntegrationConfig({ integrationId }: IntegrationConfigProps) {
  const router = useRouter()
  const { data: integration, isLoading } = useGetIntegration(integrationId)
  const updateIntegration = useUpdateIntegration()
  const testIntegration = useTestIntegration()

  const methods = useForm<Record<string, string>>({
    values: integration ? Object.fromEntries(
      Object.entries(integration.config).map(([k, v]) => [k, String(v ?? '')])
    ) : undefined,
  })

  const { register, handleSubmit } = methods

  const onSubmit = handleSubmit((data) => {
    if (!integration) return
    updateIntegration.mutate(
      { ...integration, config: data },
      {
        onSuccess: () => toast.success('Lưu cấu hình thành công'),
        onError: () => toast.error('Có lỗi khi lưu cấu hình'),
      }
    )
  })

  const handleTest = () => {
    testIntegration.mutate(integrationId, {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    )
  }

  if (!integration) {
    return <div className="text-center text-muted-foreground py-12">Không tìm thấy tích hợp</div>
  }

  const configKeys = Object.keys(integration.config)

  return (
    <div>
      <PageHeader
        title={`Cấu hình: ${integration.name}`}
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/integrations' },
          { label: 'Tích hợp', href: '/admin/integrations' },
          { label: integration.name },
        ]}
        actions={[
          { label: 'Quay lại', onClick: () => router.push('/admin/integrations') },
        ]}
      />

      <div className="flex items-center gap-2 mb-6">
        <AppBadge
          semantic={statusVariant[integration.status] ?? 'neutral'}
          dot
        >
          {statusLabel[integration.status] ?? integration.status}
        </AppBadge>
        {integration.lastTestedAt && (
          <span className="text-sm text-muted-foreground">
            Kiểm tra lần cuối: {new Date(integration.lastTestedAt).toLocaleString('vi-VN')}
          </span>
        )}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Card className="max-w-2xl">
            <CardHeader><CardTitle>Thông số cấu hình</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {configKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có thông số cấu hình</p>
              ) : (
                configKeys.map((key) => (
                  <FormField key={key} name={key} label={key}>
                    <Input
                      id={key}
                      {...register(key)}
                      type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') ? 'password' : 'text'}
                      placeholder={key}
                    />
                  </FormField>
                ))
              )}
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={updateIntegration.isPending} className="cursor-pointer">
                  {updateIntegration.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
                </Button>
                <Button type="button" variant="outline" onClick={handleTest} disabled={testIntegration.isPending} className="cursor-pointer">
                  {testIntegration.isPending ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  )
}
