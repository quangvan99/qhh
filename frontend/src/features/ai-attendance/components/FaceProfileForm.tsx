'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, FormField } from '@/components/composite'
import { AppButton, AppSelect } from '@/components/base'
import { useCreateFaceProfile, useUpdateFaceProfile } from '../api/attendance.api'
import type { FaceProfile } from '../types/attendance.types'

const faceProfileSchema = z.object({
  studentId: z.string().min(1, 'Vui lòng chọn học sinh'),
  studentName: z.string().optional(),
})

type FaceProfileFormValues = z.infer<typeof faceProfileSchema>

interface FaceProfileFormProps {
  profile?: FaceProfile
}

export function FaceProfileForm({ profile }: FaceProfileFormProps) {
  const router = useRouter()
  const createProfile = useCreateFaceProfile()
  const updateProfile = useUpdateFaceProfile()
  const isEdit = !!profile
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)

  const form = useForm<FaceProfileFormValues>({
    resolver: zodResolver(faceProfileSchema),
    defaultValues: {
      studentId: profile?.studentId ?? '',
      studentName: profile?.studentName ?? '',
    },
  })

  const studentOptions = [
    { value: 's1', label: 'Nguyễn Văn An - HS2024001' },
    { value: 's2', label: 'Trần Thị Bình - HS2024002' },
    { value: 's3', label: 'Lê Hoàng Cường - HS2024003' },
    { value: 's4', label: 'Phạm Minh Đức - HS2024004' },
    { value: 's5', label: 'Hoàng Thị Em - HS2024005' },
  ]

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const validFiles = Array.from(selectedFiles).filter(f => {
      if (!['image/jpeg', 'image/png'].includes(f.type)) {
        toast.error(`${f.name}: Chỉ chấp nhận ảnh JPG/PNG`)
        return false
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: Ảnh phải nhỏ hơn 5MB`)
        return false
      }
      return true
    })
    setFiles(prev => {
      const next = [...prev, ...validFiles]
      if (next.length > 10) {
        toast.error('Tối đa 10 ảnh')
        return prev
      }
      return next
    })
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: FaceProfileFormValues) => {
    if (!isEdit && files.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh')
      return
    }
    try {
      if (isEdit && profile) {
        await updateProfile.mutateAsync({ ...profile, ...values })
        toast.success('Cập nhật khuôn mặt thành công')
      } else {
        const formData = new FormData()
        formData.append('studentId', values.studentId)
        files.forEach(f => formData.append('photos', f))
        await createProfile.mutateAsync(formData)
        toast.success('Đăng ký khuôn mặt thành công')
      }
      router.push('/ai-attendance/faces')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa khuôn mặt' : 'Đăng ký khuôn mặt'}
        breadcrumbs={[
          { label: 'AI Điểm danh', href: '/ai-attendance/cameras' },
          { label: 'Khuôn mặt', href: '/ai-attendance/faces' },
          { label: isEdit ? 'Chỉnh sửa' : 'Đăng ký mới' },
        ]}
      />
      <FormProvider {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chọn học sinh</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField name="studentId" label="Học sinh" required>
                <AppSelect
                  options={studentOptions}
                  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch
                  value={form.watch('studentId')}
                  onChange={(v) => form.setValue('studentId', v)}
                  placeholder="Tìm và chọn học sinh..."
                  searchable
                  error={form.formState.errors.studentId?.message}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ảnh khuôn mặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-muted-foreground/25 hover:border-blue-400'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.accept = '.jpg,.jpeg,.png'
                  input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files)
                  input.click()
                }}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Kéo thả ảnh hoặc <span className="text-blue-600 font-medium">chọn từ máy tính</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG — tối đa 10 ảnh, mỗi ảnh &lt; 5MB
                </p>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="px-1 py-0.5 text-xs text-muted-foreground truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => router.push('/ai-attendance/faces')}
            >
              Hủy
            </AppButton>
            <AppButton
              type="submit"
              module="ai"
              loading={createProfile.isPending || updateProfile.isPending}
              leftIcon={<ImageIcon className="h-4 w-4" />}
            >
              {isEdit ? 'Cập nhật' : `Đăng ký (${files.length} ảnh)`}
            </AppButton>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
