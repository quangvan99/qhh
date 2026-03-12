'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { useCreateRole, useUpdateRole, useGetRole } from '../api/admin.api'
import { PermissionMatrix } from './PermissionMatrix'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface RoleFormProps {
  roleId?: string
}

export function RoleForm({ roleId }: RoleFormProps) {
  const router = useRouter()
  const isEdit = !!roleId
  const { data: role } = useGetRole(roleId ?? '')
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: isEdit && role ? {
      name: role.name,
      description: role.description ?? '',
    } : undefined,
  })

  const { register, handleSubmit } = methods

  const onSubmit = handleSubmit((data) => {
    if (isEdit && roleId) {
      updateRole.mutate({ id: roleId, ...data }, {
        onSuccess: () => {
          toast.success('Cập nhật vai trò thành công')
          router.push('/admin/roles')
        },
      })
    } else {
      createRole.mutate(data, {
        onSuccess: () => {
          toast.success('Tạo vai trò thành công')
          router.push('/admin/roles')
        },
      })
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <PageHeader
          title={isEdit ? `Cấu hình vai trò: ${role?.name ?? ''}` : 'Tạo vai trò mới'}
          breadcrumbs={[
            { label: 'Quản trị', href: '/admin/roles' },
            { label: 'Vai trò', href: '/admin/roles' },
            { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
          ]}
          actions={[
            { label: 'Hủy', onClick: () => router.push('/admin/roles') },
          ]}
        />

        <div className="space-y-6">
          <Card className="max-w-2xl">
            <CardHeader><CardTitle>Thông tin vai trò</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField name="name" label="Tên vai trò" required>
                <Input id="name" {...register('name')} placeholder="VD: Giáo viên" />
              </FormField>
              <FormField name="description" label="Mô tả">
                <Textarea id="description" {...register('description')} placeholder="Mô tả vai trò..." rows={3} />
              </FormField>
            </CardContent>
          </Card>

          {roleId && (
            <Card>
              <CardHeader><CardTitle>Ma trận phân quyền</CardTitle></CardHeader>
              <CardContent>
                <PermissionMatrix roleId={roleId} />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={createRole.isPending || updateRole.isPending} className="cursor-pointer">
              {createRole.isPending || updateRole.isPending ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo vai trò'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/roles')} className="cursor-pointer">
              Hủy
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
