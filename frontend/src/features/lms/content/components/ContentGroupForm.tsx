"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppButton } from "@/components/base/app-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ContentGroup } from "../types/content.types"

const groupSchema = z.object({
  name: z.string().min(1, "Tên nhóm không được trống").max(200),
  description: z.string().optional(),
  visible: z.boolean(),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface ContentGroupFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: GroupFormValues & { groupId?: string }) => void
  initialData?: ContentGroup
  loading?: boolean
}

export function ContentGroupForm({ open, onOpenChange, onSubmit, initialData, loading }: ContentGroupFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      visible: initialData?.visible ?? true,
    },
  })

  const onFormSubmit = (data: GroupFormValues) => {
    onSubmit({ ...data, groupId: initialData?.id })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa nhóm nội dung" : "Thêm nhóm nội dung"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <AppInput label="Tên nhóm" required error={errors.name?.message} {...register("name")} placeholder="Nhập tên nhóm..." />
          <AppTextarea label="Mô tả" {...register("description")} placeholder="Mô tả nhóm nội dung..." minRows={2} />
          <div className="flex items-center gap-3">
            <Switch checked={watch("visible")} onCheckedChange={(v) => setValue("visible", !!v)} id="visible" />
            <Label htmlFor="visible" className="cursor-pointer">Hiển thị cho học sinh</Label>
          </div>
          <DialogFooter>
            <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
            <AppButton type="submit" module="lms" loading={loading}>
              {initialData ? "Cập nhật" : "Thêm nhóm"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
