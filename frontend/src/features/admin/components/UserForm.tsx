'use client'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { AppSelect } from '@/components/base/app-select'
import { useCreateUser, useUpdateUser, useGetUser } from '../api/admin.api'
import { toast } from 'sonner'

const createSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  username: z.string().min(3, 'Tối thiểu 3 ký tự').regex(/^\S+$/, 'Không chứa khoảng trắng'),
  email: z.string().email('Email không hợp lệ'),
  role: z.string().min(1, 'Vai trò là bắt buộc'),
  unitId: z.string().optional(),
  password: z.string().min(8, 'Tối thiểu 8 ký tự'),
})

const editSchema = createSchema.extend({
  password: z.string().min(8, 'Tối thiểu 8 ký tự').or(z.literal('')).optional(),
})

type CreateFormValues = z.infer<typeof createSchema>
type EditFormValues = z.infer<typeof editSchema>

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'student', label: 'Học sinh' },
  { value: 'principal', label: 'Ban giám hiệu' },
  { value: 'librarian', label: 'Thủ thư' },
  { value: 'staff', label: 'Nhân viên' },
]

interface UserFormProps {
  userId?: string
}

export function UserForm({ userId }: UserFormProps) {
  const router = useRouter()
  const isEdit = !!userId
  const { data: user } = useGetUser(userId ?? '')
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const methods = useForm<CreateFormValues | EditFormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    values: isEdit && user ? {
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      unitId: user.unitId ?? '',
      password: '',
    } : undefined,
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods

  const onSubmit = handleSubmit((data) => {
    if (isEdit && userId) {
      const payload: Record<string, unknown> = { id: userId, ...data }
      if (!data.password) delete payload.password
      updateUser.mutate(payload as Parameters<typeof updateUser.mutate>[0], {
        onSuccess: () => {
          toast.success('Cập nhật người dùng thành công')
          router.push('/admin/users')
        },
      })
    } else {
      createUser.mutate(data as Parameters<typeof createUser.mutate>[0], {
        onSuccess: () => {
          toast.success('Thêm người dùng thành công')
          router.push('/admin/users')
        },
      })
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <PageHeader
          title={isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          breadcrumbs={[
            { label: 'Quản trị', href: '/admin/users' },
            { label: 'Người dùng', href: '/admin/users' },
            { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' },
          ]}
          actions={[
            { label: 'Hủy', onClick: () => router.push('/admin/users') },
          ]}
        />

        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader><CardTitle>Thông tin cơ bản</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField name="fullName" label="Họ tên" required>
                <Input id="fullName" {...register('fullName')} placeholder="Nguyễn Văn A" />
              </FormField>
              <FormField name="username" label="Tên đăng nhập" required>
                <Input id="username" {...register('username')} placeholder="nguyenvana" />
              </FormField>
              <FormField name="email" label="Email" required>
                <Input id="email" type="email" {...register('email')} placeholder="email@example.com" />
              </FormField>
              <FormField name="role" label="Vai trò" required>
                <AppSelect
                  options={roleOptions}
                  value={watch('role')}
                  onChange={(v) => setValue('role', v, { shouldValidate: true })}
                  placeholder="Chọn vai trò"
                  error={errors.role?.message}
                />
              </FormField>
              <FormField name="password" label="Mật khẩu" required={!isEdit}>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={isEdit ? 'Để trống nếu không đổi' : 'Tối thiểu 8 ký tự'}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={createUser.isPending || updateUser.isPending} className="cursor-pointer">
              {createUser.isPending || updateUser.isPending ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm người dùng'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/users')} className="cursor-pointer">
              Hủy
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
