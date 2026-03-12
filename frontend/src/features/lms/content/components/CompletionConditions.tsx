"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppInput } from "@/components/base/app-input"
import { AppButton } from "@/components/base/app-button"
import { Label } from "@/components/ui/label"

const conditionsSchema = z.object({
  completionType: z.enum(["tracking", "score", "manual"]),
  minScore: z.string().optional(),
  maxAttempts: z.string().optional(),
})

type ConditionsValues = z.infer<typeof conditionsSchema>

interface CompletionConditionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { completionType: "tracking" | "score" | "manual"; minScore?: number; maxAttempts?: number }) => void
  initialData?: { completionType?: "tracking" | "score" | "manual"; minScore?: number; maxAttempts?: number }
  loading?: boolean
}

export function CompletionConditions({ open, onOpenChange, onSubmit, initialData, loading }: CompletionConditionsProps) {
  const { register, handleSubmit, watch, setValue } = useForm<ConditionsValues>({
    resolver: zodResolver(conditionsSchema),
    defaultValues: {
      completionType: initialData?.completionType ?? "tracking",
      minScore: initialData?.minScore != null ? String(initialData.minScore) : "",
      maxAttempts: initialData?.maxAttempts != null ? String(initialData.maxAttempts) : "",
    },
  })

  const completionType = watch("completionType")

  const onFormSubmit = (data: ConditionsValues) => {
    onSubmit({
      completionType: data.completionType,
      minScore: data.minScore ? Number(data.minScore) : undefined,
      maxAttempts: data.maxAttempts ? Number(data.maxAttempts) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thiết lập điều kiện hoàn thành</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-3">
            {(["tracking", "score", "manual"] as const).map((type) => (
              <label key={type} className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted/50">
                <input
                  type="radio" value={type}
                  checked={completionType === type}
                  onChange={() => setValue("completionType", type)}
                  className="accent-emerald-600"
                />
                <span className="text-sm">
                  {type === "tracking" ? "Dựa theo SCORM (tracking)" : type === "score" ? "Dựa theo điểm" : "Thủ công"}
                </span>
              </label>
            ))}
          </div>

          {completionType === "score" && (
            <AppInput label="Điểm tối thiểu" type="number" {...register("minScore")} placeholder="0-100" />
          )}

          <AppInput label="Số lần thi lại tối đa" type="number" {...register("maxAttempts")} placeholder="Không giới hạn" />

          <DialogFooter>
            <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</AppButton>
            <AppButton type="submit" module="lms" loading={loading}>Lưu</AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
