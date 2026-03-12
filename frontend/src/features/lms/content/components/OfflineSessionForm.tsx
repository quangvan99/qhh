"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppButton } from "@/components/base/app-button"
import type { OfflineSessionItem } from "../types/content.types"

const offlineSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được trống"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  startTime: z.string().min(1, "Vui lòng nhập giờ bắt đầu"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
}).refine(
  (data) => !data.endTime || data.endTime > data.startTime,
  { message: "Giờ kết thúc phải sau giờ bắt đầu", path: ["endTime"] }
)

type OfflineFormValues = z.infer<typeof offlineSchema>

interface OfflineSessionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OfflineFormValues & { itemId?: string }) => void
  initialData?: OfflineSessionItem
  loading?: boolean
}

export function OfflineSessionForm({ open, onOpenChange, onSubmit, initialData, loading }: OfflineSessionFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OfflineFormValues>({
    resolver: zodResolver(offlineSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      date: initialData?.date ?? "",
      startTime: initialData?.startTime ?? "",
      endTime: initialData?.endTime ?? "",
      location: initialData?.location ?? "",
      description: initialData?.description ?? "",
    },
  })

  const onFormSubmit = (data: OfflineFormValues) => {
    onSubmit({ ...data, itemId: initialData?.id })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa buổi học offline" : "Thêm buổi học offline"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <AppInput label="Tiêu đề" required error={errors.title?.message} {...register("title")} placeholder="Nhập tiêu đề..." />
          <AppInput label="Ngày" required type="date" error={errors.date?.message} {...register("date")} />
          <div className="grid grid-cols-2 gap-4">
            <AppInput label="Giờ bắt đầu" required type="time" error={errors.startTime?.message} {...register("startTime")} />
            <AppInput label="Giờ kết thúc" type="time" error={errors.endTime?.message} {...register("endTime")} />
          </div>
          <AppInput label="Địa điểm" {...register("location")} placeholder="VD: Phòng 101, Tòa A" />
          <AppTextarea label="Mô tả" {...register("description")} placeholder="Mô tả buổi học..." minRows={2} />
          <DialogFooter>
            <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
            <AppButton type="submit" module="lms" loading={loading}>
              {initialData ? "Cập nhật" : "Thêm buổi học"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
