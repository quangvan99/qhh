'use client'
import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/patterns/data-table'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import type { BreadcrumbItem, PageAction } from '@/components/composite/page-header'
import type { BulkAction } from '@/components/patterns/data-table'

export interface CrudPageProps<TData> {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  loading?: boolean
  onCreate?: () => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onBulkDelete?: (rows: TData[]) => void
  onExport?: () => void
  searchable?: boolean
  searchPlaceholder?: string
  extraActions?: PageAction[]
  idField?: keyof TData
  className?: string
}

export function CrudPage<TData>({
  title, subtitle, breadcrumbs, data, columns, loading,
  onCreate, onEdit, onDelete, onBulkDelete, onExport,
  searchable = true, searchPlaceholder, extraActions = [],
  className,
}: CrudPageProps<TData>) {
  const [deleteTarget, setDeleteTarget] = useState<TData | null>(null)
  const [bulkDeleteTargets, setBulkDeleteTargets] = useState<TData[]>([])
  const [deleting, setDeleting] = useState(false)

  const actions: PageAction[] = [
    ...(onCreate ? [{ label: 'Thêm mới', onClick: onCreate, icon: <Plus className="h-4 w-4" /> }] : []),
    ...extraActions,
  ]

  const actionColumn: ColumnDef<TData, unknown> | null =
    onEdit || onDelete
      ? {
          id: 'actions',
          header: '',
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)} className="cursor-pointer h-8 w-8 p-0" aria-label="chỉnh sửa">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive" aria-label="xóa">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ),
          enableSorting: false,
          size: 80,
        }
      : null

  const allColumns = actionColumn ? [...columns, actionColumn] : columns

  const bulkActions: BulkAction<TData>[] = onBulkDelete
    ? [{ label: 'Xóa', onClick: (rows) => setBulkDeleteTargets(rows), variant: 'destructive' as const, icon: <Trash2 className="h-3.5 w-3.5" /> }]
    : []

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      if (deleteTarget && onDelete) {
        onDelete(deleteTarget)
      }
      if (bulkDeleteTargets.length > 0 && onBulkDelete) {
        onBulkDelete(bulkDeleteTargets)
      }
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
      setBulkDeleteTargets([])
    }
  }

  return (
    <div className={className}>
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} actions={actions} />
      <DataTable
        data={data}
        columns={allColumns}
        loading={loading}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        selectable={!!onBulkDelete}
        bulkActions={bulkActions}
        onExport={onExport}
      />
      <ConfirmDialog
        open={!!deleteTarget || bulkDeleteTargets.length > 0}
        onOpenChange={(open) => {
          if (!open) { setDeleteTarget(null); setBulkDeleteTargets([]) }
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description={
          bulkDeleteTargets.length > 0
            ? `Bạn có chắc chắn muốn xóa ${bulkDeleteTargets.length} mục đã chọn?`
            : 'Bạn có chắc chắn muốn xóa mục này?'
        }
        variant="danger"
        confirmLabel="Xóa"
        loading={deleting}
      />
    </div>
  )
}
