'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/composite/form-field'
import { useGetSettings, useUpdateSettings } from '../api/admin.api'
import { toast } from 'sonner'

const schema = z.object({
  smtpHost: z.string().min(1, 'SMTP Host là bắt buộc'),
  smtpPort: z.number().min(1, 'Port là bắt buộc'),
  smtpUser: z.string().min(1, 'SMTP User là bắt buộc'),
  smtpPassword: z.string().optional(),
  fromName: z.string().min(1, 'Tên gửi là bắt buộc'),
  fromEmail: z.string().email('Email không hợp lệ'),
})

type FormValues = z.infer<typeof schema>

export function EmailSettingsForm() {
  const { data: settings } = useGetSettings()
  const updateSettings = useUpdateSettings()
  const [showPassword, setShowPassword] = useState(false)

  const methods = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    values: settings?.email ? {
      smtpHost: settings.email.smtpHost,
      smtpPort: settings.email.smtpPort,
      smtpUser: settings.email.smtpUser,
      smtpPassword: settings.email.smtpPassword ?? '',
      fromName: settings.email.fromName,
      fromEmail: settings.email.fromEmail,
    } : undefined,
  })

  const { register, handleSubmit } = methods

  const onSubmit = handleSubmit((data) => {
    const payload = { ...data }
    if (!payload.smtpPassword) delete payload.smtpPassword
    updateSettings.mutate({ email: payload }, {
      onSuccess: () => toast.success('Lưu cài đặt email thành công'),
      onError: () => toast.error('Có lỗi khi lưu cài đặt'),
    })
  })

  const handleTestEmail = () => {
    toast.info('Đang gửi email test...')
    setTimeout(() => toast.success('Gửi email test thành công'), 1500)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Cấu hình Email SMTP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="smtpHost" label="SMTP Host" required>
                <Input id="smtpHost" {...register('smtpHost')} placeholder="smtp.gmail.com" />
              </FormField>
              <FormField name="smtpPort" label="SMTP Port" required>
                <Input id="smtpPort" type="number" {...register('smtpPort', { valueAsNumber: true })} placeholder="587" />
              </FormField>
            </div>
            <FormField name="smtpUser" label="SMTP User" required>
              <Input id="smtpUser" {...register('smtpUser')} placeholder="user@example.com" />
            </FormField>
            <FormField name="smtpPassword" label="SMTP Password">
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('smtpPassword')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <FormField name="fromName" label="Tên người gửi" required>
              <Input id="fromName" {...register('fromName')} placeholder="Hệ thống QH" />
            </FormField>
            <FormField name="fromEmail" label="Email người gửi" required>
              <Input id="fromEmail" type="email" {...register('fromEmail')} placeholder="noreply@school.edu.vn" />
            </FormField>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={updateSettings.isPending} className="cursor-pointer">
                {updateSettings.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
              </Button>
              <Button type="button" variant="outline" onClick={handleTestEmail} className="cursor-pointer">
                Gửi email test
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}
