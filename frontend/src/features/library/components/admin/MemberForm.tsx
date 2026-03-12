'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetMember, useCreateMember, useUpdateMember } from '@/features/library/api/library.api'
import { PageHeader, FormField } from '@/components/composite'
import { AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const memberSchema = z.object({
  memberCode: z.string().optional(),
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  memberType: z.enum(['student', 'teacher', 'staff'], { error: 'Vui lòng chọn loại' }),
  cardExpiry: z.string().min(1, 'Vui lòng chọn ngày hết hạn'),
  userId: z.string().optional(),
  status: z.enum(['active', 'suspended', 'expired']).optional(),
})

type MemberFormValues = z.infer<typeof memberSchema>

interface MemberFormProps {
  memberId?: string
}

const memberTypeOptions = [
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'staff', label: 'Nhân viên' },
]

export function MemberForm({ memberId }: MemberFormProps) {
  const router = useRouter()
  const isEdit = !!memberId
  const { data: member } = useGetMember(memberId ?? '')
  const createMut = useCreateMember()
  const updateMut = useUpdateMember()

  const methods = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      memberCode: '',
      fullName: '',
      email: '',
      memberType: 'student',
      cardExpiry: '',
      userId: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (member && isEdit) {
      methods.reset({
        memberCode: member.memberCode,
        fullName: member.fullName,
        email: member.email ?? '',
        memberType: member.memberType,
        cardExpiry: member.cardExpiry.split('T')[0] ?? member.cardExpiry,
        userId: member.userId ?? '',
        status: member.status,
      })
    }
  }, [member, isEdit, methods])

  const onSubmit = async (values: MemberFormValues) => {
    try {
      if (isEdit && member) {
        await updateMut.mutateAsync({
          ...member,
          ...values,
          email: values.email || undefined,
          memberCode: values.memberCode ?? member.memberCode,
        })
        toast.success('Đã cập nhật thành viên')
      } else {
        await createMut.mutateAsync({
          ...values,
          memberCode: values.memberCode ?? '',
          email: values.email || undefined,
          status: 'active',
        })
        toast.success('Đã thêm thành viên mới')
      }
      router.push('/library/members')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa thành viên' : 'Thêm thành viên'}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Bạn đọc', href: '/library/members' },
          { label: isEdit ? 'Sửa' : 'Thêm mới' },
        ]}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="memberCode" label="Mã thẻ">
                  <AppInput
                    placeholder="Tự động hoặc nhập tay..."
                    {...methods.register('memberCode')}
                  />
                </FormField>
                <FormField name="fullName" label="Họ tên" required>
                  <AppInput
                    placeholder="Nhập họ tên..."
                    error={methods.formState.errors.fullName?.message}
                    {...methods.register('fullName')}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="email" label="Email">
                  <AppInput
                    type="email"
                    placeholder="Nhập email..."
                    error={methods.formState.errors.email?.message}
                    {...methods.register('email')}
                  />
                </FormField>
                <FormField name="memberType" label="Loại thành viên" required>
                  <AppSelect
                    options={memberTypeOptions}
                    value={methods.watch('memberType')}
                    onChange={(v) => methods.setValue('memberType', v as 'student' | 'teacher' | 'staff', { shouldValidate: true })}
                    error={methods.formState.errors.memberType?.message}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="cardExpiry" label="Ngày hết hạn thẻ" required>
                  <AppInput
                    type="date"
                    error={methods.formState.errors.cardExpiry?.message}
                    {...methods.register('cardExpiry')}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/library/members')}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMut.isPending || updateMut.isPending}
              className="cursor-pointer"
            >
              {isEdit ? 'Cập nhật' : 'Thêm thành viên'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
