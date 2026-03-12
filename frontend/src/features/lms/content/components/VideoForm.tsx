"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { AppButton } from "@/components/base/app-button"
import { Progress } from "@/components/ui/progress"
import type { VideoItem } from "../types/content.types"

const videoUploadSchema = z.object({
  title: z.string().min(1, "Tên video không được trống"),
  description: z.string().optional(),
})

const videoEmbedSchema = z.object({
  title: z.string().min(1, "Tên video không được trống"),
  url: z.string().url("URL không hợp lệ"),
  description: z.string().optional(),
})

interface VideoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  initialData?: VideoItem
  loading?: boolean
}

export function VideoForm({ open, onOpenChange, onSubmit, initialData, loading }: VideoFormProps) {
  const [tab, setTab] = useState<string>(initialData?.sourceType ?? "upload")
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadForm = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: { title: initialData?.title ?? "", description: "" },
  })

  const embedForm = useForm<z.infer<typeof videoEmbedSchema>>({
    resolver: zodResolver(videoEmbedSchema),
    defaultValues: { title: initialData?.title ?? "", url: initialData?.url ?? "", description: "" },
  })

  const handleUploadSubmit = (data: z.infer<typeof videoUploadSchema>) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("sourceType", "upload")
    if (data.description) formData.append("description", data.description)
    if (file) formData.append("file", file)
    setUploadProgress(50)
    onSubmit(formData)
  }

  const handleEmbedSubmit = (data: z.infer<typeof videoEmbedSchema>) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("sourceType", "embed")
    formData.append("url", data.url)
    if (data.description) formData.append("description", data.description)
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa video" : "Thêm video"}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="cursor-pointer flex-1">Upload video</TabsTrigger>
            <TabsTrigger value="embed" className="cursor-pointer flex-1">Embed URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <form onSubmit={uploadForm.handleSubmit(handleUploadSubmit)} className="space-y-4">
              <AppInput label="Tên" required error={uploadForm.formState.errors.title?.message} {...uploadForm.register("title")} />
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
              >
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{file ? file.name : "Kéo thả video hoặc bấm để chọn (max 500MB)"}</p>
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
              </div>
              {uploadProgress > 0 && <Progress value={uploadProgress} className="h-1.5" />}
              <AppTextarea label="Mô tả" {...uploadForm.register("description")} minRows={2} />
              <DialogFooter>
                <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
                <AppButton type="submit" module="lms" loading={loading} disabled={!file && !initialData}>Upload</AppButton>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="embed">
            <form onSubmit={embedForm.handleSubmit(handleEmbedSubmit)} className="space-y-4">
              <AppInput label="Tên" required error={embedForm.formState.errors.title?.message} {...embedForm.register("title")} />
              <AppInput label="URL" required error={embedForm.formState.errors.url?.message} {...embedForm.register("url")} placeholder="https://youtube.com/watch?v=..." />
              <AppTextarea label="Mô tả" {...embedForm.register("description")} minRows={2} />
              <DialogFooter>
                <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
                <AppButton type="submit" module="lms" loading={loading}>Thêm</AppButton>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
