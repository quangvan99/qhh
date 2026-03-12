"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppButton } from "@/components/base/app-button"
import { Progress } from "@/components/ui/progress"
import type { ScormItem } from "../types/content.types"

const scormSchema = z.object({
  title: z.string().min(1, "Tên SCORM không được trống"),
  description: z.string().optional(),
  minScore: z.string().optional(),
})

type ScormFormValues = z.infer<typeof scormSchema>

interface ScormFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  initialData?: ScormItem
  loading?: boolean
}

export function ScormForm({ open, onOpenChange, onSubmit, initialData, loading }: ScormFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ScormFormValues>({
    resolver: zodResolver(scormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: "",
      minScore: initialData?.minScore != null ? String(initialData.minScore) : "",
    },
  })

  const onFormSubmit = (data: ScormFormValues) => {
    const formData = new FormData()
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    if (data.minScore) formData.append("minScore", data.minScore)
    if (file) formData.append("file", file)
    setUploadProgress(30)
    setTimeout(() => setUploadProgress(70), 500)
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa SCORM" : "Thêm SCORM"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <AppInput label="Tên SCORM" required error={errors.title?.message} {...register("title")} placeholder="Nhập tên SCORM..." />

          {!initialData && (
            <div>
              <p className="text-sm font-medium mb-1.5">Upload file <span className="text-destructive">*</span></p>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
              >
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Kéo thả file .zip hoặc bấm để chọn"}
                </p>
                <input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="mt-2 h-1.5" />}
            </div>
          )}

          <AppTextarea label="Mô tả" {...register("description")} placeholder="Mô tả SCORM..." minRows={2} />
          <AppInput label="Điểm hoàn thành" type="number" {...register("minScore")} placeholder="0-100" helper="Để trống nếu không yêu cầu điểm tối thiểu" />

          <DialogFooter>
            <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
            <AppButton type="submit" module="lms" loading={loading} disabled={!initialData && !file}>
              {initialData ? "Cập nhật" : "Upload"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
