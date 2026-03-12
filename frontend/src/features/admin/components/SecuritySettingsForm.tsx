'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/composite/form-field'
import { useGetSettings, useUpdateSettings } from '../api/admin.api'
import { toast } from 'sonner'

const schema = z.object({
  sessionTimeoutMinutes: z.number().min(1, 'Tối thiểu 1 phút'),
  passwordMinLength: z.number().min(6, 'Tối thiểu 6 ký tự'),
  passwordRequireUppercase: z.boolean(),
  passwordRequireNumber: z.boolean(),
  passwordRequireSymbol: z.boolean(),
  passwordExpiryDays: z.number().min(0, 'Tối thiểu 0 (không hết hạn)'),
})

type FormValues = z.infer<typeof schema>

export function SecuritySettingsForm() {
  const { data: settings } = useGetSettings()
  const updateSettings = useUpdateSettings()

  const methods = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    values: settings?.security ? {
      sessionTimeoutMinutes: settings.security.sessionTimeoutMinutes,
      passwordMinLength: settings.security.passwordMinLength,
      passwordRequireUppercase: settings.security.passwordRequireUppercase,
      passwordRequireNumber: settings.security.passwordRequireNumber,
      passwordRequireSymbol: settings.security.passwordRequireSymbol,
      passwordExpiryDays: settings.security.passwordExpiryDays,
    } : undefined,
  })

  const { register, handleSubmit, watch, setValue } = methods

  const onSubmit = handleSubmit((data) => {
    updateSettings.mutate({ security: data }, {
      onSuccess: () => toast.success('Lưu cài đặt bảo mật thành công'),
      onError: () => toast.error('Có lỗi khi lưu cài đặt'),
    })
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Cài đặt bảo mật</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="sessionTimeoutMinutes" label="Thời gian hết phiên (phút)" required>
                <Input id="sessionTimeoutMinutes" type="number" {...register('sessionTimeoutMinutes', { valueAsNumber: true })} placeholder="30" />
              </FormField>
              <FormField name="passwordMinLength" label="Độ dài mật khẩu tối thiểu" required>
                <Input id="passwordMinLength" type="number" {...register('passwordMinLength', { valueAsNumber: true })} placeholder="8" />
              </FormField>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Yêu cầu mật khẩu</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="passwordRequireUppercase"
                  checked={watch('passwordRequireUppercase')}
                  onCheckedChange={(val) => setValue('passwordRequireUppercase', !!val)}
                />
                <Label htmlFor="passwordRequireUppercase" className="text-sm font-normal">
                  Chữ hoa (A-Z)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="passwordRequireNumber"
                  checked={watch('passwordRequireNumber')}
                  onCheckedChange={(val) => setValue('passwordRequireNumber', !!val)}
                />
                <Label htmlFor="passwordRequireNumber" className="text-sm font-normal">
                  Chứa số (0-9)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="passwordRequireSymbol"
                  checked={watch('passwordRequireSymbol')}
                  onCheckedChange={(val) => setValue('passwordRequireSymbol', !!val)}
                />
                <Label htmlFor="passwordRequireSymbol" className="text-sm font-normal">
                  Ký tự đặc biệt (!@#$...)
                </Label>
              </div>
            </div>

            <FormField name="passwordExpiryDays" label="Hết hạn mật khẩu (ngày)" description="0 = Không bao giờ hết hạn">
              <Input id="passwordExpiryDays" type="number" {...register('passwordExpiryDays', { valueAsNumber: true })} placeholder="90" />
            </FormField>

            <Button type="submit" disabled={updateSettings.isPending} className="cursor-pointer">
              {updateSettings.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}
