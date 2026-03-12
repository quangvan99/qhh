'use client'

import { useEffect, useCallback } from 'react'
import { useUpdateScormProgress } from '../api/student.api'
import type { StudentContentItem } from '../types/student.types'

interface ScormLauncherProps {
  classId: string
  item: StudentContentItem
}

export function ScormLauncher({ classId, item }: ScormLauncherProps) {
  const updateProgress = useUpdateScormProgress()

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (typeof event.data !== 'object' || event.data === null) return
      const data = event.data as Record<string, unknown>
      if (data.type === 'scorm-progress') {
        updateProgress.mutate({
          classId,
          itemId: item.id,
          score: typeof data.score === 'number' ? data.score : undefined,
          time: typeof data.time === 'number' ? data.time : undefined,
          completed: typeof data.completed === 'boolean' ? data.completed : undefined,
        })
      }
    },
    [classId, item.id, updateProgress]
  )

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  if (!item.scormUrl) {
    return <p className="text-muted-foreground">Không tìm thấy nội dung SCORM.</p>
  }

  return (
    <iframe
      src={item.scormUrl}
      title={item.title}
      className="w-full rounded-lg border"
      style={{ height: '600px' }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  )
}
