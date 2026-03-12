"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ChevronDown, ChevronRight, Pencil, Trash2, Plus, FileVideo, FileText, File, ClipboardList, MapPin, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AppBadge } from "@/components/base/app-badge"
import { ConfirmDialog } from "@/components/composite/confirm-dialog"
import { cn } from "@/lib/utils"
import type { ContentGroup, ContentItemType } from "../types/content.types"

interface ContentGroupListProps {
  groups: ContentGroup[]
  classId: string
  onReorder: (groupIds: string[]) => void
  onEdit: (group: ContentGroup) => void
  onDelete: (groupId: string) => void
  onAddItem: (groupId: string, type: ContentItemType) => void
}

const contentTypeIcons: Record<ContentItemType, React.ReactNode> = {
  scorm: <Package className="h-4 w-4" />,
  video: <FileVideo className="h-4 w-4" />,
  text: <FileText className="h-4 w-4" />,
  file: <File className="h-4 w-4" />,
  survey: <ClipboardList className="h-4 w-4" />,
  offline: <MapPin className="h-4 w-4" />,
}

const contentTypeLabels: Record<ContentItemType, string> = {
  scorm: "SCORM",
  video: "Video",
  text: "Văn bản",
  file: "Tài liệu",
  survey: "Khảo sát",
  offline: "Buổi offline",
}

function SortableGroupCard({ group, classId, onEdit, onDelete, onAddItem }: {
  group: ContentGroup
  classId: string
  onEdit: () => void
  onDelete: () => void
  onAddItem: (type: ContentItemType) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} className={cn("transition-shadow", isDragging && "shadow-lg opacity-80")}>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-3">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground" aria-label="Kéo để sắp xếp">
            <GripVertical className="h-4 w-4" />
          </button>

          <Collapsible open={expanded} onOpenChange={setExpanded} className="flex-1">
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors">
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-medium text-sm">{group.name}</span>
                <AppBadge semantic="neutral" size="sm">{group.itemCount} mục</AppBadge>
              </CollapsibleTrigger>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={onEdit} className="cursor-pointer h-7 w-7 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="cursor-pointer h-7 w-7 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 text-sm">
                    {contentTypeIcons[item.type]}
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(contentTypeIcons) as ContentItemType[]).map((type) => (
                  <Button key={type} variant="outline" size="sm" onClick={() => onAddItem(type)} className="cursor-pointer text-xs h-7">
                    <Plus className="h-3 w-3 mr-1" />{contentTypeLabels[type]}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}

export function ContentGroupList({ groups, classId, onReorder, onEdit, onDelete, onAddItem }: ContentGroupListProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id)
      const newIndex = groups.findIndex((g) => g.id === over.id)
      const reordered = arrayMove(groups, oldIndex, newIndex)
      onReorder(reordered.map((g) => g.id))
    }
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          {groups.map((group) => (
            <SortableGroupCard
              key={group.id}
              group={group}
              classId={classId}
              onEdit={() => onEdit(group)}
              onDelete={() => setDeleteTarget(group.id)}
              onAddItem={(type) => onAddItem(group.id, type)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }}
        title="Xóa nhóm nội dung"
        description="Bạn có chắc chắn muốn xóa nhóm này? Tất cả nội dung bên trong cũng sẽ bị xóa."
        variant="danger"
        confirmLabel="Xóa"
      />
    </div>
  )
}
