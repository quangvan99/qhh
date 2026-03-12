'use client'

import { useState, useCallback, useMemo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPermissions, useGetRolePermissions, useUpdateRolePermissions } from '../api/admin.api'
import type { Permission } from '../types/admin.types'
import { toast } from 'sonner'

interface PermissionMatrixProps {
  roleId: string
}

// Group permissions by module
function groupPermissions(perms: Permission[]) {
  const groups = new Map<string, Permission[]>()
  for (const perm of perms) {
    const existing = groups.get(perm.module) ?? []
    existing.push(perm)
    groups.set(perm.module, existing)
  }
  return groups
}

// Extract unique actions from permissions
function getActions(perms: Permission[]) {
  const actionSet = new Set<string>()
  for (const perm of perms) {
    actionSet.add(perm.action)
  }
  return Array.from(actionSet)
}

const MODULE_LABELS: Record<string, string> = {
  lms: 'LMS - Quản lý học tập',
  exam: 'Thi & Kiểm tra',
  'ai-attendance': 'AI Điểm danh',
  library: 'Thư viện',
  admin: 'Quản trị hệ thống',
  system: 'Hệ thống',
}

const ACTION_LABELS: Record<string, string> = {
  read: 'Xem',
  create: 'Tạo',
  update: 'Sửa',
  delete: 'Xóa',
  export: 'Xuất',
}

// Inner component that renders once rolePerms is loaded
function PermissionMatrixInner({
  permissions,
  initialKeys,
  roleId,
}: {
  permissions: Permission[]
  initialKeys: string[]
  roleId: string
}) {
  const updatePermissions = useUpdateRolePermissions()
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(() => new Set(initialKeys))

  const groups = useMemo(() => groupPermissions(permissions), [permissions])
  const actions = useMemo(() => getActions(permissions), [permissions])

  const toggle = useCallback((key: string) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const toggleModule = useCallback((module: string, checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev)
      const perms = groups.get(module) ?? []
      for (const perm of perms) {
        if (checked) {
          next.add(perm.key)
        } else {
          next.delete(perm.key)
        }
      }
      return next
    })
  }, [groups])

  const toggleColumn = useCallback((action: string, checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev)
      for (const perm of permissions) {
        if (perm.action === action) {
          if (checked) {
            next.add(perm.key)
          } else {
            next.delete(perm.key)
          }
        }
      }
      return next
    })
  }, [permissions])

  const isModuleChecked = (module: string) => {
    const perms = groups.get(module) ?? []
    return perms.length > 0 && perms.every((p) => checkedKeys.has(p.key))
  }

  const isModuleIndeterminate = (module: string) => {
    const perms = groups.get(module) ?? []
    const checkedCount = perms.filter((p) => checkedKeys.has(p.key)).length
    return checkedCount > 0 && checkedCount < perms.length
  }

  const isColumnChecked = (action: string) => {
    const colPerms = permissions.filter((p) => p.action === action)
    return colPerms.length > 0 && colPerms.every((p) => checkedKeys.has(p.key))
  }

  const findPermKey = (module: string, action: string) => {
    return permissions.find((p) => p.module === module && p.action === action)?.key
  }

  const handleSave = () => {
    updatePermissions.mutate(
      { roleId, permissionKeys: Array.from(checkedKeys) },
      {
        onSuccess: () => toast.success('Cập nhật phân quyền thành công'),
        onError: () => toast.error('Có lỗi khi cập nhật phân quyền'),
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">Module</th>
              {actions.map((action) => (
                <th key={action} className="p-3 text-center font-medium w-20">
                  <div className="flex flex-col items-center gap-1">
                    <span>{ACTION_LABELS[action] ?? action}</span>
                    <Checkbox
                      checked={isColumnChecked(action)}
                      onCheckedChange={(val) => toggleColumn(action, !!val)}
                      aria-label={`Chọn tất cả ${action}`}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(groups.entries()).map(([module]) => (
              <tr key={module} className="border-b hover:bg-muted/30">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isModuleChecked(module)}
                      indeterminate={isModuleIndeterminate(module)}
                      onCheckedChange={(val) => toggleModule(module, !!val)}
                      aria-label={`Chọn tất cả ${module}`}
                    />
                    <span className="font-medium">{MODULE_LABELS[module] ?? module}</span>
                  </div>
                </td>
                {actions.map((action) => {
                  const key = findPermKey(module, action)
                  if (!key) {
                    return <td key={action} className="p-3 text-center text-muted-foreground">—</td>
                  }
                  return (
                    <td key={action} className="p-3 text-center">
                      <Checkbox
                        checked={checkedKeys.has(key)}
                        onCheckedChange={() => toggle(key)}
                        aria-label={`${module} ${action}`}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={updatePermissions.isPending} className="cursor-pointer">
          {updatePermissions.isPending ? 'Đang lưu...' : 'Lưu phân quyền'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const allKeys = new Set<string>(permissions.map((p) => p.key))
            setCheckedKeys(allKeys)
          }}
          className="cursor-pointer"
        >
          Cấp tất cả
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setCheckedKeys(new Set())}
          className="cursor-pointer"
        >
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}

export function PermissionMatrix({ roleId }: PermissionMatrixProps) {
  const { data: allPermissions, isLoading: loadingPerms } = useGetPermissions()
  const { data: rolePerms, isLoading: loadingRolePerms } = useGetRolePermissions(roleId)

  if (loadingPerms || loadingRolePerms) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <PermissionMatrixInner
      permissions={allPermissions ?? []}
      initialKeys={rolePerms?.permissionKeys ?? []}
      roleId={roleId}
    />
  )
}
