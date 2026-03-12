'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/composite/form-field'
import { AppSelect } from '@/components/base/app-select'
import { useGetSettings, useUpdateSettings } from '../api/admin.api'
import { toast } from 'sonner'

const schema = z.object({
  schoolName: z.string().min(1, 'Tên trường là bắt buộc'),
  logoUrl: z.string().optional(),
  timezone: z.string().min(1, 'Múi giờ là bắt buộc'),
  language: z.string().min(1, 'Ngôn ngữ là bắt buộc'),
})

type FormValues = z.infer<typeof schema>

const timezoneOptions = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Việt Nam (UTC+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (UTC+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
]

const languageOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]

export function GeneralSettingsForm() {
  const { data: settings } = useGetSettings()
  const updateSettings = useUpdateSettings()

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: settings?.general ? {
      schoolName: settings.general.schoolName,
      logoUrl: settings.general.logoUrl ?? '',
      timezone: settings.general.timezone,
      language: settings.general.language,
    } : undefined,
  })

  const { register, handleSubmit, watch, setValue } = methods

  const onSubmit = handleSubmit((data) => {
    updateSettings.mutate({ general: data }, {
      onSuccess: () => toast.success('Lưu cài đặt thành công'),
      onError: () => toast.error('Có lỗi khi lưu cài đặt'),
    })
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="schoolName" label="Tên trường" required>
              <Input id="schoolName" {...register('schoolName')} placeholder="VD: Trường THPT ABC" />
            </FormField>
            <FormField name="logoUrl" label="Logo URL">
              <Input id="logoUrl" {...register('logoUrl')} placeholder="https://..." />
            </FormField>
            <FormField name="timezone" label="Múi giờ" required>
              <AppSelect
                options={timezoneOptions}
                value={watch('timezone')}
                onChange={(v) => setValue('timezone', v, { shouldValidate: true })}
                placeholder="Chọn múi giờ"
              />
            </FormField>
            <FormField name="language" label="Ngôn ngữ" required>
              <AppSelect
                options={languageOptions}
                value={watch('language')}
                onChange={(v) => setValue('language', v, { shouldValidate: true })}
                placeholder="Chọn ngôn ngữ"
              />
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
