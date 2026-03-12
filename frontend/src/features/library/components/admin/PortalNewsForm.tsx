'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetPortalNewsItem, useCreatePortalNews, useUpdatePortalNews } from '@/features/library/api/library.api'
import { PageHeader } from '@/components/composite'
import { FormField } from '@/components/composite'
import { AppInput, AppSelect, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const newsSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  slug: z.string().min(1, 'Slug không được để trống'),
  category: z.enum(['news', 'event', 'announcement'], {
    message: 'Vui lòng chọn danh mục',
  }),
  publishDate: z.string().min(1, 'Vui lòng chọn ngày đăng'),
  author: z.string().default(''),
  summary: z.string().default(''),
  content: z.string().min(1, 'Vui lòng nhập nội dung'),
  thumbnailUrl: z.string().default(''),
  status: z.enum(['draft', 'published']),
})

type NewsFormValues = z.infer<typeof newsSchema>

const categoryOptions = [
  { value: 'news', label: 'Tin tức' },
  { value: 'event', label: 'Sự kiện' },
  { value: 'announcement', label: 'Thông báo' },
]

const statusOptions = [
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Đã đăng' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface PortalNewsFormProps {
  newsId?: string
}

export function PortalNewsForm({ newsId }: PortalNewsFormProps) {
  const router = useRouter()
  const isEdit = !!newsId
  const { data: existing } = useGetPortalNewsItem(newsId ?? '')
  const createMut = useCreatePortalNews()
  const updateMut = useUpdatePortalNews()

  const methods = useForm<NewsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      category: 'news',
      publishDate: new Date().toISOString().split('T')[0],
      author: '',
      summary: '',
      content: '',
      thumbnailUrl: '',
      status: 'draft',
    },
  })

  useEffect(() => {
    if (existing && isEdit) {
      methods.reset({
        title: existing.title,
        slug: existing.slug,
        category: existing.category,
        publishDate: existing.publishDate,
        author: existing.author,
        summary: existing.summary,
        content: existing.content,
        thumbnailUrl: existing.thumbnailUrl ?? '',
        status: existing.status,
      })
    }
  }, [existing, isEdit, methods])

  const watchTitle = methods.watch('title')

  useEffect(() => {
    if (!isEdit && watchTitle) {
      methods.setValue('slug', generateSlug(watchTitle))
    }
  }, [watchTitle, isEdit, methods])

  const onSubmit = async (values: NewsFormValues) => {
    try {
      if (isEdit && existing) {
        await updateMut.mutateAsync({ ...existing, ...values })
        toast.success('Đã cập nhật tin tức')
      } else {
        await createMut.mutateAsync(values)
        toast.success('Đã tạo tin tức mới')
      }
      router.push('/library/portal-news')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa tin tức' : 'Thêm tin tức mới'}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Portal CMS', href: '/library/portal-news' },
          { label: isEdit ? 'Sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <FormField name="title" label="Tiêu đề" required>
                <AppInput
                  placeholder="Nhập tiêu đề tin tức..."
                  error={methods.formState.errors.title?.message}
                  {...methods.register('title')}
                />
              </FormField>

              <FormField name="slug" label="Slug (URL)">
                <AppInput
                  placeholder="tu-dong-tao-tu-tieu-de"
                  {...methods.register('slug')}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField name="category" label="Danh mục" required>
                  <AppSelect
                    options={categoryOptions}
                    value={methods.watch('category')}
                    onChange={(v) => methods.setValue('category', v as NewsFormValues['category'], { shouldValidate: true })}
                    placeholder="Chọn danh mục..."
                    error={methods.formState.errors.category?.message}
                  />
                </FormField>
                <FormField name="publishDate" label="Ngày đăng" required>
                  <AppInput
                    type="date"
                    {...methods.register('publishDate')}
                  />
                </FormField>
                <FormField name="status" label="Trạng thái">
                  <AppSelect
                    options={statusOptions}
                    value={methods.watch('status')}
                    onChange={(v) => methods.setValue('status', v as NewsFormValues['status'])}
                    placeholder="Chọn trạng thái..."
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="author" label="Tác giả">
                  <AppInput
                    placeholder="Nhập tên tác giả..."
                    {...methods.register('author')}
                  />
                </FormField>
                <FormField name="thumbnailUrl" label="Ảnh thumbnail (URL)">
                  <AppInput
                    placeholder="https://..."
                    {...methods.register('thumbnailUrl')}
                  />
                </FormField>
              </div>

              <FormField name="summary" label="Tóm tắt">
                <AppTextarea
                  placeholder="Tóm tắt ngắn gọn nội dung..."
                  value={methods.watch('summary') ?? ''}
                  onChange={(e) => methods.setValue('summary', e.target.value)}
                  minRows={2}
                />
              </FormField>

              <FormField name="content" label="Nội dung" required>
                <AppTextarea
                  placeholder="Nhập nội dung chi tiết..."
                  value={methods.watch('content')}
                  onChange={(e) => methods.setValue('content', e.target.value)}
                  minRows={10}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/library/portal-news')}
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
