"use client"

import { useState, useCallback } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Pencil, Trash2, CircleDot, CheckSquare, AlignLeft, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppInput } from "@/components/base/app-input"
import { AppTextarea } from "@/components/base/app-textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { SurveyQuestion, QuestionType, SurveyOption } from "../types/content.types"

interface SurveyBuilderProps {
  questions: SurveyQuestion[]
  onChange: (questions: SurveyQuestion[]) => void
}

const typeIcons: Record<QuestionType, React.ReactNode> = {
  radio: <CircleDot className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  text: <AlignLeft className="h-4 w-4" />,
  scale: <BarChart3 className="h-4 w-4" />,
  matrix: <BarChart3 className="h-4 w-4" />,
}

const typeLabels: Record<QuestionType, string> = {
  radio: "Trắc nghiệm 1 lựa chọn",
  checkbox: "Trắc nghiệm nhiều lựa chọn",
  text: "Văn bản tự do",
  scale: "Thang điểm",
  matrix: "Ma trận",
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function SortableQuestion({ question, isSelected, onSelect, onDelete }: {
  question: SurveyQuestion; isSelected: boolean; onSelect: () => void; onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={cn("flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors", isSelected && "ring-2 ring-emerald-500 bg-emerald-50", isDragging && "opacity-60")} onClick={onSelect}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground" aria-label="Kéo để sắp xếp">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="text-muted-foreground">{typeIcons[question.type]}</span>
      <span className="text-sm flex-1 truncate">{question.content || "Câu hỏi mới"}</span>
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete() }} className="h-6 w-6 p-0 text-destructive cursor-pointer">
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function SurveyBuilder({ questions, onChange }: SurveyBuilderProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const selected = questions.find((q) => q.id === selectedId)

  const addQuestion = useCallback((type: QuestionType) => {
    const newQ: SurveyQuestion = {
      id: generateId(),
      type,
      content: "",
      required: false,
      order: questions.length,
      options: type === "radio" || type === "checkbox" ? [{ id: generateId(), label: "Lựa chọn 1" }] : undefined,
      maxLength: type === "text" ? 500 : undefined,
    }
    onChange([...questions, newQ])
    setSelectedId(newQ.id)
  }, [questions, onChange])

  const updateQuestion = useCallback((id: string, updates: Partial<SurveyQuestion>) => {
    onChange(questions.map((q) => q.id === id ? { ...q, ...updates } : q))
  }, [questions, onChange])

  const deleteQuestion = useCallback((id: string) => {
    onChange(questions.filter((q) => q.id !== id))
    if (selectedId === id) setSelectedId(null)
  }, [questions, onChange, selectedId])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)
      onChange(arrayMove(questions, oldIndex, newIndex))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Question list */}
      <div className="space-y-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" className="cursor-pointer w-full" />}>
            <Plus className="h-4 w-4 mr-2" />Thêm câu hỏi
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(Object.keys(typeLabels) as QuestionType[]).map((type) => (
              <DropdownMenuItem key={type} onClick={() => addQuestion(type)} className="cursor-pointer">
                <span className="mr-2">{typeIcons[type]}</span>{typeLabels[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((q) => (
              <SortableQuestion key={q.id} question={q} isSelected={q.id === selectedId} onSelect={() => setSelectedId(q.id)} onDelete={() => deleteQuestion(q.id)} />
            ))}
          </SortableContext>
        </DndContext>

        {questions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">Chưa có câu hỏi. Bấm &ldquo;Thêm câu hỏi&rdquo; để bắt đầu.</p>
        )}
      </div>

      {/* Right: Editor panel */}
      <div>
        {selected ? (
          <Card>
            <CardContent className="p-4 space-y-4">
              <AppTextarea label="Nội dung câu hỏi" value={selected.content} onChange={(e) => updateQuestion(selected.id, { content: e.target.value })} minRows={2} />

              {(selected.type === "radio" || selected.type === "checkbox") && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lựa chọn</Label>
                  {selected.options?.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <AppInput value={opt.label} onChange={(e) => {
                        const newOpts = [...(selected.options ?? [])]
                        newOpts[idx] = { ...opt, label: e.target.value }
                        updateQuestion(selected.id, { options: newOpts })
                      }} className="flex-1" />
                      <Button variant="ghost" size="sm" onClick={() => {
                        updateQuestion(selected.id, { options: selected.options?.filter((o) => o.id !== opt.id) })
                      }} className="h-8 w-8 p-0 text-destructive cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    const newOpt: SurveyOption = { id: generateId(), label: `Lựa chọn ${(selected.options?.length ?? 0) + 1}` }
                    updateQuestion(selected.id, { options: [...(selected.options ?? []), newOpt] })
                  }} className="cursor-pointer">
                    <Plus className="h-3.5 w-3.5 mr-1" />Thêm lựa chọn
                  </Button>
                </div>
              )}

              {selected.type === "text" && (
                <AppInput label="Giới hạn ký tự" type="number" value={selected.maxLength ?? ""} onChange={(e) => updateQuestion(selected.id, { maxLength: Number(e.target.value) || undefined })} />
              )}

              {selected.type === "scale" && (
                <div className="flex gap-4">
                  <AppInput label="Giá trị min" type="number" value={selected.scaleMin ?? 1} onChange={(e) => updateQuestion(selected.id, { scaleMin: Number(e.target.value) })} />
                  <AppInput label="Giá trị max" type="number" value={selected.scaleMax ?? 5} onChange={(e) => updateQuestion(selected.id, { scaleMax: Number(e.target.value) })} />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Switch checked={selected.required} onCheckedChange={(v) => updateQuestion(selected.id, { required: !!v })} id={`req-${selected.id}`} />
                <Label htmlFor={`req-${selected.id}`} className="cursor-pointer">Bắt buộc</Label>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16 text-muted-foreground text-sm border rounded-lg">
            Chọn một câu hỏi để chỉnh sửa
          </div>
        )}
      </div>
    </div>
  )
}
