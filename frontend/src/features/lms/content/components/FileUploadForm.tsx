"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, X, FileIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppButton } from "@/components/base/app-button"
import type { FileItem } from "../types/content.types"

const ACCEPTED = ".pdf,.docx,.xlsx,.pptx,.doc,.xls,.ppt"
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

const fileSchema = z.object({
  title: z.string().min(1, "Tên tài liệu không được trống"),
  description: z.string().optional(),
})

interface FileUploadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  initialData?: FileItem
  loading?: boolean
}

export function FileUploadForm({ open, onOpenChange, onSubmit, initialData, loading }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: { title: initialData?.title ?? "", description: initialData?.description ?? "" },
  })

  const handleFileSelect = (f: File) => {
    if (f.size > MAX_SIZE) {
      setFileError("File quá lớn (tối đa 50MB)")
      return
    }
    setFileError(null)
    setFile(f)
  }

  const onFormSubmit = (data: z.infer<typeof fileSchema>) => {
    const formData = new FormData()
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    if (file) formData.append("file", file)
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa tài liệu" : "Upload tài liệu"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <AppInput label="Tên tài liệu" required error={errors.title?.message} {...register("title")} />

          {!initialData && (
            <div>
              <p className="text-sm font-medium mb-1.5">Chọn file <span className="text-destructive">*</span></p>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f) }}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{file.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }} className="p-0.5 hover:bg-muted rounded cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Kéo thả file hoặc bấm để chọn</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, PowerPoint — max 50MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
              </div>
              {fileError && <p className="text-sm text-destructive mt-1">{fileError}</p>}
            </div>
          )}

          <AppTextarea label="Mô tả" {...register("description")} placeholder="Mô tả tài liệu..." minRows={2} />

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
