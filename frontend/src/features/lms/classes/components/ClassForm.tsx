"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AppButton } from "@/components/base/app-button"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppSelect } from "@/components/base/app-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ClassFormData, LMSClass } from "../types/class.types"

const classSchema = z.object({
  name: z.string().min(2, "Tên lớp tối thiểu 2 ký tự").max(200),
  code: z.string().min(2, "Mã lớp tối thiểu 2 ký tự").max(50),
  description: z.string().optional(),
  year: z.string().min(1, "Vui lòng chọn năm học"),
  term: z.enum(["HK1", "HK2", "full"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teacherId: z.string().min(1, "Vui lòng chọn giáo viên"),
  enrollmentType: z.enum(["open", "approval", "locked"]),
  maxStudents: z.string().optional(),
})

type FormValues = z.infer<typeof classSchema>

interface ClassFormProps {
  initialData?: LMSClass
  onSubmit: (data: ClassFormData) => void
  onCancel: () => void
  loading?: boolean
}

const yearOptions = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2026-2027", label: "2026-2027" },
]

const termOptions = [
  { value: "HK1", label: "Học kỳ 1" },
  { value: "HK2", label: "Học kỳ 2" },
  { value: "full", label: "Cả năm" },
]

const enrollmentOptions = [
  { value: "open", label: "Tự do" },
  { value: "approval", label: "Có phê duyệt" },
  { value: "locked", label: "Khóa" },
]

export function ClassForm({ initialData, onSubmit, onCancel, loading }: ClassFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      year: initialData?.year ?? "",
      term: initialData?.term ?? "HK1",
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      teacherId: initialData?.teacher?.id ?? "",
      enrollmentType: initialData?.enrollmentType ?? "open",
      maxStudents: initialData?.maxStudents != null ? String(initialData.maxStudents) : "",
    },
  })

  const onFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      maxStudents: data.maxStudents ? Number(data.maxStudents) : undefined,
    } as ClassFormData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput label="Tên lớp" required error={errors.name?.message} {...register("name")} placeholder="Nhập tên lớp..." />
          <AppInput label="Mã lớp" required error={errors.code?.message} {...register("code")} placeholder="VD: LOP-001" />
          <div className="md:col-span-2">
            <AppTextarea label="Mô tả" {...register("description")} placeholder="Mô tả về lớp học..." minRows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt lớp</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Năm học" required
            options={yearOptions}
            value={watch("year")}
            onChange={(v) => setValue("year", v)}
            error={errors.year?.message}
          />
          <AppSelect
            label="Học kỳ" required
            options={termOptions}
            value={watch("term")}
            onChange={(v) => setValue("term", v as "HK1" | "HK2" | "full")}
            error={errors.term?.message}
          />
          <AppInput label="Ngày khai giảng" type="date" {...register("startDate")} />
          <AppInput label="Ngày kết thúc" type="date" {...register("endDate")} />
          <AppSelect
            label="Giáo viên" required searchable
            options={[{ value: "t1", label: "Nguyễn Văn A" }, { value: "t2", label: "Trần Thị B" }]}
            value={watch("teacherId")}
            onChange={(v) => setValue("teacherId", v)}
            error={errors.teacherId?.message}
          />
          <AppSelect
            label="Phương thức đăng ký"
            options={enrollmentOptions}
            value={watch("enrollmentType")}
            onChange={(v) => setValue("enrollmentType", v as "open" | "approval" | "locked")}
          />
          <AppInput label="Số học sinh tối đa" type="number" {...register("maxStudents")} placeholder="Không giới hạn" />
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <AppButton type="button" variant="outline" onClick={onCancel}>Hủy</AppButton>
        <AppButton type="submit" module="lms" loading={loading}>
          {initialData ? "Cập nhật" : "Tạo lớp học"}
        </AppButton>
      </div>
    </form>
  )
}
