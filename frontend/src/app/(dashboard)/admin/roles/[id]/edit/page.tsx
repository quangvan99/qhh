'use client'

import { use } from 'react'
import { RoleForm } from '@/features/admin/components/RoleForm'

export default function AdminRoleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <RoleForm roleId={id} />
}
