'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/composite'
import { FormField } from '@/components/composite'
import { AppInput, AppButton, AppSelect } from '@/components/base'
import { useCreateCamera, useUpdateCamera } from '../api/attendance.api'
import type { Camera } from '../types/attendance.types'

const cameraSchema = z.object({
  name: z.string().min(2, 'Tên camera tối thiểu 2 ký tự'),
  ipAddress: z.string().min(1, 'Địa chỉ IP là bắt buộc'),
  rtspUrl: z.string().optional(),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  classId: z.string().optional(),
  manufacturer: z.string().optional(),
})

type CameraFormValues = z.infer<typeof cameraSchema>

interface CameraFormProps {
  camera?: Camera
}

export function CameraForm({ camera }: CameraFormProps) {
  const router = useRouter()
  const createCamera = useCreateCamera()
  const updateCamera = useUpdateCamera()
  const isEdit = !!camera

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: camera?.name ?? '',
      ipAddress: camera?.ipAddress ?? '',
      rtspUrl: camera?.rtspUrl ?? '',
      location: camera?.location ?? '',
      classId: camera?.classId ?? '',
      manufacturer: camera?.manufacturer ?? '',
    },
  })

  const onSubmit = async (values: CameraFormValues) => {
    try {
      if (isEdit && camera) {
        await updateCamera.mutateAsync({ ...camera, ...values })
        toast.success('Cập nhật camera thành công')
      } else {
        await createCamera.mutateAsync(values)
        toast.success('Thêm camera thành công')
      }
      router.push('/ai-attendance/cameras')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const classOptions = [
    { value: 'c1', label: 'Lớp 10A1' },
    { value: 'c2', label: 'Lớp 10A2' },
    { value: 'c3', label: 'Lớp 11B1' },
  ]

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa camera' : 'Thêm camera mới'}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Camera', href: '/ai-attendance/cameras' },
          { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin camera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField name="name" label="Tên camera" required>
                <AppInput
                  {...form.register('name')}
                  placeholder="VD: Camera Cổng chính"
                  error={form.formState.errors.name?.message}
                />
              </FormField>
              <FormField name="ipAddress" label="Địa chỉ IP" required>
                <AppInput
                  {...form.register('ipAddress')}
                  placeholder="VD: 192.168.1.100"
                  error={form.formState.errors.ipAddress?.message}
                />
              </FormField>
              <FormField name="rtspUrl" label="RTSP URL">
                <AppInput
                  {...form.register('rtspUrl')}
                  placeholder="rtsp://..."
                />
              </FormField>
              <FormField name="location" label="Địa điểm" required>
                <AppInput
                  {...form.register('location')}
                  placeholder="VD: Cổng chính, Phòng 10A1"
                  error={form.formState.errors.location?.message}
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
              <FormField name="manufacturer" label="Nhà sản xuất">
                <AppInput
                  {...form.register('manufacturer')}
                  placeholder="VD: Hikvision, Dahua"
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => router.push('/ai-attendance/cameras')}
            >
              Hủy
            </AppButton>
            <AppButton
              type="submit"
              module="ai"
              loading={createCamera.isPending || updateCamera.isPending}
            >
              {isEdit ? 'Cập nhật' : 'Thêm camera'}
            </AppButton>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
