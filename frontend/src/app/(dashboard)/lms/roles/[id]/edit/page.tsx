'use client'

import { use } from 'react'
import { LmsRoleForm } from '@/features/lms/components/LmsRoleForm'

export default function LmsRoleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <LmsRoleForm roleId={id} />
}
