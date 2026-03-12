'use client'

import { use } from 'react'
import { FileViewerPage } from '@/features/lms/content/components/FileViewerPage'

export default function FilePreviewPage({ params }: { params: Promise<{ id: string; groupId: string; fileId: string }> }) {
  const { id, groupId, fileId } = use(params)
  return <FileViewerPage classId={id} groupId={groupId} fileId={fileId} />
}
