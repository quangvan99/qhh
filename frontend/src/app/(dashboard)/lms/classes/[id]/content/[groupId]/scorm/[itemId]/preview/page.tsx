"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ScormViewer } from "@/features/lms/content/components/ScormViewer"

export default function ScormPreviewPage({ params }: { params: Promise<{ id: string; groupId: string; itemId: string }> }) {
  const { id, groupId, itemId } = use(params)
  const router = useRouter()

  return (
    <ScormViewer
      scormId={itemId}
      title="SCORM Preview"
      launchUrl={`/api/lms/scorm/${itemId}/launch`}
      onClose={() => router.push(`/lms/classes/${id}/content/${groupId}/scorm`)}
    />
  )
}
