'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, FormField } from '@/components/composite'
import { AppInput, AppButton, AppSelect } from '@/components/base'
import { useCreateDevice, useUpdateDevice } from '../api/attendance.api'
import type { AttendanceDevice } from '../types/attendance.types'

const deviceSchema = z.object({
  deviceId: z.string().min(1, 'Mã thiết bị là bắt buộc'),
  model: z.string().min(1, 'Model là bắt buộc'),
  firmware: z.string().min(1, 'Firmware là bắt buộc'),
  classId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type DeviceFormValues = z.infer<typeof deviceSchema>

interface DeviceFormProps {
  device?: AttendanceDevice
}

export function DeviceForm({ device }: DeviceFormProps) {
  const router = useRouter()
  const createDevice = useCreateDevice()
  const updateDevice = useUpdateDevice()
  const isEdit = !!device

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      deviceId: device?.deviceId ?? '',
      model: device?.model ?? '',
      firmware: device?.firmware ?? '',
      classId: device?.classId ?? '',
      status: device?.status ?? 'active',
    },
  })

  const onSubmit = async (values: DeviceFormValues) => {
    try {
      if (isEdit && device) {
        await updateDevice.mutateAsync({ ...device, ...values })
        toast.success('Cập nhật thiết bị thành công')
      } else {
        await createDevice.mutateAsync(values)
        toast.success('Thêm thiết bị thành công')
      }
      router.push('/ai-attendance/devices')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const classOptions = [
    { value: 'c1', label: 'Lớp 10A1' },
    { value: 'c2', label: 'Lớp 10A2' },
    { value: 'c3', label: 'Lớp 11B1' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
  ]

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Máy điểm danh', href: '/ai-attendance/devices' },
          { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin thiết bị</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField name="deviceId" label="Mã thiết bị" required>
                <AppInput
                  {...form.register('deviceId')}
                  placeholder="VD: DEV-001"
                  error={form.formState.errors.deviceId?.message}
                />
              </FormField>
              <FormField name="model" label="Model" required>
                <AppInput
                  {...form.register('model')}
                  placeholder="VD: ZKTeco SpeedFace V5L"
                  error={form.formState.errors.model?.message}
                />
              </FormField>
              <FormField name="firmware" label="Firmware" required>
                <AppInput
                  {...form.register('firmware')}
                  placeholder="VD: v2.1.3"
                  error={form.formState.errors.firmware?.message}
                />
              </FormField>
              <FormField name="classId" label="Lớp học (tùy chọn)">
                <AppSelect
                  options={classOptions}
                  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch
                  value={form.watch('classId')}
                  onChange={(v) => form.setValue('classId', v)}
                  placeholder="Chọn lớp..."
                  searchable
                />
              </FormField>
              <FormField name="status" label="Trạng thái" required>
                <AppSelect
                  options={statusOptions}
                  value={form.watch('status')}
                  onChange={(v) => form.setValue('status', v as 'active' | 'inactive')}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => router.push('/ai-attendance/devices')}
            >
              Hủy
            </AppButton>
            <AppButton
              type="submit"
              module="ai"
              loading={createDevice.isPending || updateDevice.isPending}
            >
              {isEdit ? 'Cập nhật' : 'Thêm thiết bị'}
            </AppButton>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
