'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, GripVertical, Plus, Pencil, Trash2, Building2, School, Users, BookOpen, MoreHorizontal, CopyPlus, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AppBadge } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { useGetOrgUnits, useDeleteOrgUnit } from '../api/admin.api'
import type { OrgUnit } from '../types/admin.types'
import { OrgUnitForm } from './OrgUnitForm'
import { AddSiblingUnitModal } from './AddSiblingUnitModal'
import { AddChildUnitModal } from './AddChildUnitModal'
import { toast } from 'sonner'

const typeIcons: Record<string, React.ReactNode> = {
  school: <School className="h-4 w-4 text-blue-600" />,
  department: <Building2 className="h-4 w-4 text-green-600" />,
  class: <BookOpen className="h-4 w-4 text-amber-600" />,
  group: <Users className="h-4 w-4 text-purple-600" />,
}

const typeLabels: Record<string, string> = {
  school: 'Trường',
  department: 'Phòng ban',
  class: 'Lớp học',
  group: 'Nhóm',
}

interface TreeNodeProps {
  node: OrgUnit
  depth: number
  onAddChild: (parentId: string) => void
  onAddSibling: (node: OrgUnit) => void
  onAddChildUnit: (node: OrgUnit) => void
  onEdit: (unit: OrgUnit) => void
  onDelete: (unit: OrgUnit) => void
}

function TreeNode({ node, depth, onAddChild, onAddSibling, onAddChildUnit, onEdit, onDelete }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-md group"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
        <button
          type="button"
          className="h-5 w-5 flex items-center justify-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4" />
          )}
        </button>
        {typeIcons[node.type] ?? <Building2 className="h-4 w-4" />}
        <span className="font-medium text-sm flex-1">{node.name}</span>
        <AppBadge semantic="neutral" size="sm">{typeLabels[node.type] ?? node.type}</AppBadge>
        <span className="text-xs text-muted-foreground">{node.userCount} người</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddChild(node.id)} className="cursor-pointer">
                <Plus className="h-3.5 w-3.5 mr-2" /> Thêm con (form cũ)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSibling(node)} className="cursor-pointer">
                <CopyPlus className="h-3.5 w-3.5 mr-2" /> Thêm đơn vị cùng cấp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddChildUnit(node)} className="cursor-pointer">
                <FolderPlus className="h-3.5 w-3.5 mr-2" /> Thêm đơn vị con
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(node)} className="cursor-pointer">
                <Pencil className="h-3.5 w-3.5 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(node)} className="cursor-pointer text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {expanded && hasChildren && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          onAddChild={onAddChild}
          onAddSibling={onAddSibling}
          onAddChildUnit={onAddChildUnit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export function OrgUnitTree() {
  const { data: orgUnits, isLoading } = useGetOrgUnits()
  const deleteOrgUnit = useDeleteOrgUnit()
  const [formOpen, setFormOpen] = useState(false)
  const [editUnit, setEditUnit] = useState<OrgUnit | null>(null)
  const [parentIdForNew, setParentIdForNew] = useState<string | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<OrgUnit | null>(null)
  const [siblingTarget, setSiblingTarget] = useState<OrgUnit | null>(null)
  const [childTarget, setChildTarget] = useState<OrgUnit | null>(null)

  const handleAddRoot = () => {
    setEditUnit(null)
    setParentIdForNew(undefined)
    setFormOpen(true)
  }

  const handleAddChild = (parentId: string) => {
    setEditUnit(null)
    setParentIdForNew(parentId)
    setFormOpen(true)
  }

  const handleEdit = (unit: OrgUnit) => {
    setEditUnit(unit)
    setParentIdForNew(unit.parentId)
    setFormOpen(true)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteOrgUnit.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success('Đã xóa đơn vị')
          setDeleteTarget(null)
        },
      })
    }
  }

  const hasChildWarning = deleteTarget?.children && deleteTarget.children.length > 0

  return (
    <div>
      <PageHeader
        title="Cơ cấu tổ chức"
        subtitle="Quản lý cơ cấu tổ chức và đơn vị"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/organization' },
          { label: 'Cơ cấu tổ chức' },
        ]}
        actions={[
          { label: 'Thêm đơn vị gốc', onClick: handleAddRoot, icon: <Plus className="h-4 w-4" /> },
        ]}
      />

      <div className="rounded-lg border bg-background p-2">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải...</div>
        ) : !orgUnits || orgUnits.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Chưa có đơn vị nào. Nhấn &quot;Thêm đơn vị gốc&quot; để bắt đầu.
          </div>
        ) : (
          orgUnits.map((unit) => (
            <TreeNode
              key={unit.id}
              node={unit}
              depth={0}
              onAddChild={handleAddChild}
              onAddSibling={setSiblingTarget}
              onAddChildUnit={setChildTarget}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      {/* Org Unit Form Dialog */}
      {formOpen && (
        <OrgUnitForm
          unit={editUnit}
          parentId={parentIdForNew}
          onClose={() => { setFormOpen(false); setEditUnit(null) }}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={handleDelete}
        title="Xóa đơn vị"
        description={
          hasChildWarning
            ? `Xóa sẽ xóa tất cả đơn vị con của "${deleteTarget?.name ?? ''}". Bạn có chắc chắn?`
            : `Bạn có chắc chắn muốn xóa đơn vị "${deleteTarget?.name ?? ''}"?`
        }
        variant="danger"
        confirmLabel="Xóa"
        loading={deleteOrgUnit.isPending}
      />

      {/* Add Sibling Unit Modal */}
      <AddSiblingUnitModal
        open={!!siblingTarget}
        onOpenChange={(open) => { if (!open) setSiblingTarget(null) }}
        parentName={siblingTarget?.name ?? ''}
      />

      {/* Add Child Unit Modal */}
      <AddChildUnitModal
        open={!!childTarget}
        onOpenChange={(open) => { if (!open) setChildTarget(null) }}
        parentName={childTarget?.name ?? ''}
      />
    </div>
  )
}
