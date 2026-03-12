'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import {
  useCreateConductCriteria,
  useUpdateConductCriteria,
  useGetConductCriteriaById,
} from '../api/gddt.api'
import type { ConductCriteria } from '../types/gddt.types'
import { toast } from 'sonner'

const conductCriteriaSchema = z.object({
  code: z.string().min(1, 'Mã tiêu chí là bắt buộc').max(20),
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(200),
  group: z.string().min(1, 'Chọn nhóm tiêu chí'),
  maxScore: z.number().min(0).max(100),
  minScore: z.number().min(0).optional(),
  grades: z.array(z.enum(['10', '11', '12'])).min(1, 'Chọn ít nhất 1 khối'),
  order: z.number().int().positive('Thứ tự phải là số dương'),
  description: z.string().optional(),
  active: z.boolean(),
})

type FormValues = z.infer<typeof conductCriteriaSchema>

const groupOptions = [
  { label: 'Học tập', value: 'study' },
  { label: 'Hoạt động', value: 'activity' },
  { label: 'Nếp sống', value: 'lifestyle' },
  { label: 'Lao động', value: 'labor' },
  { label: 'Khác', value: 'other' },
]

export function ConductScoreForm({ editId }: { editId?: string }) {
  const router = useRouter()
  const isEdit = !!editId
  const { data: existing, isLoading: loadingExisting } = useGetConductCriteriaById(editId ?? '')
  const createMutation = useCreateConductCriteria()
  const updateMutation = useUpdateConductCriteria()

  const form = useForm<FormValues>({
    resolver: zodResolver(conductCriteriaSchema),
    defaultValues: {
      code: '',
      name: '',
      group: '',
      maxScore: 10,
      minScore: undefined,
      grades: ['10', '11', '12'],
      order: 1,
      description: '',
      active: true,
    },
    values: existing
      ? {
          code: existing.code,
          name: existing.name,
          group: existing.group,
          maxScore: existing.maxScore,
          minScore: existing.minScore,
          grades: existing.grades,
          order: existing.order,
          description: existing.description ?? '',
          active: existing.active,
        }
      : undefined,
  })

  const { register, handleSubmit, setValue, watch } = form
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && editId) {
        await updateMutation.mutateAsync({ id: editId, ...values } as ConductCriteria)
        toast.success('Cập nhật tiêu chí thành công')
      } else {
        await createMutation.mutateAsync(values as Omit<ConductCriteria, 'id'>)
        toast.success('Thêm tiêu chí thành công')
      }
      router.push('/gddt/conduct-score')
    } catch {
      toast.error('Lỗi khi lưu tiêu chí')
    }
  }

  if (isEdit && loadingExisting) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const selectedGrades = watch('grades')

  return (
    <FormProvider {...form}>
      <div>
        <PageHeader
          title={isEdit ? 'Sửa tiêu chí điểm rèn luyện' : 'Thêm tiêu chí điểm rèn luyện'}
          breadcrumbs={[
            { label: 'GDĐT', href: '/gddt/classes' },
            { label: 'Điểm rèn luyện', href: '/gddt/conduct-score' },
            { label: isEdit ? 'Sửa tiêu chí' : 'Thêm tiêu chí' },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tiêu chí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="code" label="Mã tiêu chí" required>
                  <Input id="code" {...register('code')} placeholder="VD: TC01" />
                </FormField>
                <FormField name="name" label="Tên tiêu chí" required>
                  <Input id="name" {...register('name')} placeholder="Tên tiêu chí" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField name="group" label="Nhóm tiêu chí" required>
                  <Select value={watch('group')} onValueChange={(v) => setValue('group', v ?? '')}>
                    <SelectTrigger id="group">
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField name="maxScore" label="Điểm tối đa" required>
                  <Input id="maxScore" type="number" {...register('maxScore', { valueAsNumber: true })} min={0} max={100} />
                </FormField>
                <FormField name="minScore" label="Điểm tối thiểu">
                  <Input id="minScore" type="number" {...register('minScore', { valueAsNumber: true })} min={0} />
                </FormField>
              </div>

              <FormField name="grades" label="Áp dụng cho khối" required>
                <div className="flex items-center gap-4">
                  {(['10', '11', '12'] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedGrades.includes(g)}
                        onCheckedChange={(checked) => {
                          const current = watch('grades')
                          if (checked) {
                            setValue('grades', [...current, g])
                          } else {
                            setValue('grades', current.filter((v) => v !== g))
                          }
                        }}
                      />
                      <span className="text-sm">Khối {g}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField name="order" label="Thứ tự hiển thị" required>
                <Input id="order" type="number" {...register('order', { valueAsNumber: true })} min={1} className="max-w-[120px]" />
              </FormField>

              <FormField name="description" label="Mô tả">
                <Textarea id="description" {...register('description')} rows={3} placeholder="Mô tả tiêu chí (tùy chọn)" />
              </FormField>

              <FormField name="active" label="Trạng thái">
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={watch('active')}
                    onCheckedChange={(v) => setValue('active', v)}
                  />
                  <span className="text-sm">{watch('active') ? 'Đang dùng' : 'Tạm dừng'}</span>
                </div>
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/gddt/conduct-score')}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Cập nhật' : 'Thêm tiêu chí'}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
