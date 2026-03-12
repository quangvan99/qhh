'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetPortalContent, useCreatePortalContent, useUpdatePortalContent } from '@/features/library/api/library.api'
import { PageHeader } from '@/components/composite'
import { FormField } from '@/components/composite'
import { AppInput, AppSelect, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const contentSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  type: z.enum(['introduction', 'contact', 'regulation', 'schedule'], {
    message: 'Vui lòng chọn loại nội dung',
  }),
  content: z.string().min(1, 'Vui lòng nhập nội dung'),
  isActive: z.boolean(),
  displayOrder: z.number().min(0, 'Thứ tự phải >= 0'),
})

type ContentFormValues = z.infer<typeof contentSchema>

const typeOptions = [
  { value: 'introduction', label: 'Giới thiệu' },
  { value: 'contact', label: 'Liên hệ' },
  { value: 'regulation', label: 'Quy định' },
  { value: 'schedule', label: 'Lịch hoạt động' },
]

interface PortalContentFormProps {
  contentId?: string
}

export function PortalContentForm({ contentId }: PortalContentFormProps) {
  const router = useRouter()
  const isEdit = !!contentId
  const { data: existing } = useGetPortalContent(contentId ?? '')
  const createMut = useCreatePortalContent()
  const updateMut = useUpdatePortalContent()

  const methods = useForm<ContentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contentSchema) as any,
    defaultValues: {
      title: '',
      type: 'introduction',
      content: '',
      isActive: true,
      displayOrder: 0,
    },
  })

  useEffect(() => {
    if (existing && isEdit) {
      methods.reset({
        title: existing.title,
        type: existing.type,
        content: existing.content,
        isActive: existing.isActive,
        displayOrder: existing.displayOrder,
      })
    }
  }, [existing, isEdit, methods])

  const onSubmit = async (values: ContentFormValues) => {
    try {
      if (isEdit && existing) {
        await updateMut.mutateAsync({ ...existing, ...values })
        toast.success('Đã cập nhật nội dung')
      } else {
        await createMut.mutateAsync(values)
        toast.success('Đã tạo nội dung mới')
      }
      router.push('/library/portal-content')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa nội dung' : 'Thêm nội dung mới'}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Portal CMS', href: '/library/portal-content' },
          { label: isEdit ? 'Sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="title" label="Tiêu đề" required>
                  <AppInput
                    placeholder="Nhập tiêu đề..."
                    error={methods.formState.errors.title?.message}
                    {...methods.register('title')}
                  />
                </FormField>
                <FormField name="type" label="Loại nội dung" required>
                  <AppSelect
                    options={typeOptions}
                    value={methods.watch('type')}
                    onChange={(v) => methods.setValue('type', v as ContentFormValues['type'], { shouldValidate: true })}
                    placeholder="Chọn loại..."
                    error={methods.formState.errors.type?.message}
                  />
                </FormField>
              </div>

              <FormField name="content" label="Nội dung" required>
                <AppTextarea
                  placeholder="Nhập nội dung chi tiết..."
                  value={methods.watch('content')}
                  onChange={(e) => methods.setValue('content', e.target.value)}
                  minRows={8}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="displayOrder" label="Thứ tự hiển thị">
                  <AppInput
                    type="number"
                    placeholder="VD: 1"
                    {...methods.register('displayOrder', { valueAsNumber: true })}
                  />
                </FormField>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={methods.watch('isActive')}
                    onCheckedChange={(v) => methods.setValue('isActive', v)}
                  />
                  <Label>Kích hoạt hiển thị</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/library/portal-content')}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMut.isPending || updateMut.isPending}
              className="cursor-pointer"
            >
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
