"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { SurveyQuestion } from "../types/content.types"

interface SurveyPreviewProps {
  title: string
  questions: SurveyQuestion[]
}

export function SurveyPreview({ title, questions }: SurveyPreviewProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {questions.map((q, idx) => (
        <Card key={q.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {idx + 1}. {q.content || "Câu hỏi chưa có nội dung"}
              {q.required && <span className="text-destructive ml-1">*</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {q.type === "radio" && q.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="radio" name={q.id} disabled className="accent-emerald-600" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
            {q.type === "checkbox" && q.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" disabled className="accent-emerald-600" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
            {q.type === "text" && (
              <textarea disabled placeholder={q.placeholder ?? "Nhập câu trả lời..."} className="w-full border rounded-md p-2 text-sm bg-muted/30 min-h-[60px]" />
            )}
            {q.type === "scale" && (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">{q.scaleMin ?? 1}</span>
                {Array.from({ length: (q.scaleMax ?? 5) - (q.scaleMin ?? 1) + 1 }, (_, i) => (
                  <label key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                    <input type="radio" name={q.id} disabled className="accent-emerald-600" />
                    <span className="text-xs">{(q.scaleMin ?? 1) + i}</span>
                  </label>
                ))}
                <span className="text-xs text-muted-foreground">{q.scaleMax ?? 5}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
