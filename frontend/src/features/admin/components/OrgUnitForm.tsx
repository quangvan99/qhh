'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/composite/form-field'
import { AppSelect } from '@/components/base/app-select'
import { useCreateOrgUnit, useUpdateOrgUnit } from '../api/admin.api'
import type { OrgUnit } from '../types/admin.types'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1, 'Tên đơn vị là bắt buộc'),
  code: z.string().optional(),
  type: z.enum(['school', 'department', 'class', 'group']),
  parentId: z.string().optional(),
  order: z.number().default(0),
})

type FormValues = z.infer<typeof schema>

const typeOptions = [
  { value: 'school', label: 'Trường' },
  { value: 'department', label: 'Phòng ban' },
  { value: 'class', label: 'Lớp học' },
  { value: 'group', label: 'Nhóm' },
]

interface OrgUnitFormProps {
  unit?: OrgUnit | null
  parentId?: string
  onClose: () => void
}

export function OrgUnitForm({ unit, parentId, onClose }: OrgUnitFormProps) {
  const isEdit = !!unit
  const createOrgUnit = useCreateOrgUnit()
  const updateOrgUnit = useUpdateOrgUnit()

  const methods = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: unit?.name ?? '',
      code: unit?.code ?? '',
      type: unit?.type ?? 'department',
      parentId: unit?.parentId ?? parentId ?? '',
      order: unit?.order ?? 0,
    },
  })

  const { register, handleSubmit, watch, setValue } = methods

  const onSubmit = handleSubmit((data) => {
    if (isEdit && unit) {
      updateOrgUnit.mutate({ id: unit.id, ...data }, {
        onSuccess: () => {
          toast.success('Cập nhật đơn vị thành công')
          onClose()
        },
      })
    } else {
      createOrgUnit.mutate(data, {
        onSuccess: () => {
          toast.success('Thêm đơn vị thành công')
          onClose()
        },
      })
    }
  })

  return (
    <Dialog open onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa đơn vị' : 'Thêm đơn vị mới'}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField name="name" label="Tên đơn vị" required>
              <Input id="name" {...register('name')} placeholder="VD: Tổ Toán" />
            </FormField>
            <FormField name="code" label="Mã đơn vị">
              <Input id="code" {...register('code')} placeholder="VD: TO-TOAN" />
            </FormField>
            <FormField name="type" label="Loại đơn vị" required>
              <AppSelect
                options={typeOptions}
                value={watch('type')}
                onChange={(v) => setValue('type', v as FormValues['type'], { shouldValidate: true })}
                placeholder="Chọn loại"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">Hủy</Button>
              <Button type="submit" disabled={createOrgUnit.isPending || updateOrgUnit.isPending} className="cursor-pointer">
                {createOrgUnit.isPending || updateOrgUnit.isPending ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
