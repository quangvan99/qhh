'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetBook, useCreateBook, useUpdateBook, useGetCategories, useGetLocations } from '@/features/library/api/library.api'
import { PageHeader } from '@/components/composite'
import { FormField } from '@/components/composite'
import { AppInput, AppSelect, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const bookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tên sách'),
  author: z.string().min(1, 'Vui lòng nhập tác giả'),
  publisher: z.string().optional(),
  publishYear: z.number().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  locationId: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
})

type BookFormValues = z.infer<typeof bookSchema>

interface BookFormProps {
  bookId?: string
}

export function BookForm({ bookId }: BookFormProps) {
  const router = useRouter()
  const isEdit = !!bookId
  const { data: book } = useGetBook(bookId ?? '')
  const { data: categories } = useGetCategories()
  const { data: locations } = useGetLocations()
  const createMut = useCreateBook()
  const updateMut = useUpdateBook()

  const methods = useForm<BookFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(bookSchema) as any,
    defaultValues: {
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      publishYear: undefined,
      categoryId: '',
      locationId: '',
      description: '',
      coverUrl: '',
    },
  })

  useEffect(() => {
    if (book && isEdit) {
      methods.reset({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher ?? '',
        publishYear: book.publishYear,
        categoryId: book.categoryId,
        locationId: book.locationId ?? '',
        description: book.description ?? '',
        coverUrl: book.coverUrl ?? '',
      })
    }
  }, [book, isEdit, methods])

  const categoryOptions = categories?.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })) ?? []
  const locationOptions = [
    { value: '', label: 'Không chọn' },
    ...(locations?.map((l: { id: string; name: string }) => ({ value: l.id, label: l.name })) ?? []),
  ]

  const onSubmit = async (values: BookFormValues) => {
    try {
      if (isEdit && book) {
        await updateMut.mutateAsync({
          ...book,
          ...values,
          isbn: values.isbn ?? '',
        })
        toast.success('Đã cập nhật sách')
      } else {
        await createMut.mutateAsync({
          ...values,
          isbn: values.isbn ?? '',
        })
        toast.success('Đã thêm sách mới')
      }
      router.push('/library/catalog')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa sách' : 'Thêm sách mới'}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Danh mục sách', href: '/library/catalog' },
          { label: isEdit ? 'Sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="isbn" label="ISBN">
                  <AppInput
                    placeholder="Nhập mã ISBN..."
                    {...methods.register('isbn')}
                  />
                </FormField>
                <FormField name="title" label="Tên sách" required>
                  <AppInput
                    placeholder="Nhập tên sách..."
                    error={methods.formState.errors.title?.message}
                    {...methods.register('title')}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="author" label="Tác giả" required>
                  <AppInput
                    placeholder="Nhập tên tác giả..."
                    error={methods.formState.errors.author?.message}
                    {...methods.register('author')}
                  />
                </FormField>
                <FormField name="publisher" label="Nhà xuất bản">
                  <AppInput
                    placeholder="Nhập NXB..."
                    {...methods.register('publisher')}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField name="publishYear" label="Năm xuất bản">
                  <AppInput
                    type="number"
                    placeholder="VD: 2024"
                    {...methods.register('publishYear', { valueAsNumber: true })}
                  />
                </FormField>
                <FormField name="categoryId" label="Danh mục" required>
                  <AppSelect
                    options={categoryOptions}
                    value={methods.watch('categoryId')}
                    onChange={(v) => methods.setValue('categoryId', v, { shouldValidate: true })}
                    placeholder="Chọn danh mục..."
                    error={methods.formState.errors.categoryId?.message}
                  />
                </FormField>
                <FormField name="locationId" label="Vị trí kho">
                  <AppSelect
                    options={locationOptions}
                    value={methods.watch('locationId') ?? ''}
                    onChange={(v) => methods.setValue('locationId', v)}
                    placeholder="Chọn vị trí..."
                  />
                </FormField>
              </div>
              <FormField name="coverUrl" label="Ảnh bìa (URL)">
                <AppInput
                  placeholder="https://..."
                  {...methods.register('coverUrl')}
                />
              </FormField>
              <FormField name="description" label="Mô tả">
                <AppTextarea
                  placeholder="Mô tả ngắn về sách..."
                  value={methods.watch('description') ?? ''}
                  onChange={(e) => methods.setValue('description', e.target.value)}
                  minRows={4}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/library/catalog')}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMut.isPending || updateMut.isPending}
              className="cursor-pointer"
            >
              {isEdit ? 'Cập nhật' : 'Thêm sách'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
