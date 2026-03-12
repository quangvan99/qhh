'use client'

import { use } from 'react'
import { FileEditForm } from '@/features/lms/content/components/FileEditForm'

export default function FileEditPage({ params }: { params: Promise<{ id: string; groupId: string; fileId: string }> }) {
  const { id, groupId, fileId } = use(params)
  return <FileEditForm classId={id} groupId={groupId} fileId={fileId} />
}
