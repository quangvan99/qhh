'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { useUpdateScormProgress } from '../api/student.api'
import type { StudentContentItem } from '../types/student.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface VideoViewerStudentProps {
  classId: string
  item: StudentContentItem
}

function getStorageKey(itemId: string) {
  return `video-progress-${itemId}`
}

export function VideoViewerStudent({ classId, item }: VideoViewerStudentProps) {
  const updateProgress = useUpdateScormProgress()
  // Lazy initializer reads localStorage once on mount — avoids setState-in-effect lint error
  const [startSeconds] = useState(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem(getStorageKey(item.id))
    if (!saved) return 0
    const parsed = parseFloat(saved)
    return !isNaN(parsed) ? parsed : 0
  })

  const handleProgress = useCallback(
    (state: { playedSeconds: number }) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(getStorageKey(item.id), String(state.playedSeconds))
      }
    },
    [item.id]
  )

  const handlePause = useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getStorageKey(item.id))
      const seconds = saved ? parseFloat(saved) : 0
      updateProgress.mutate({
        classId,
        itemId: item.id,
        time: Math.round(seconds),
      })
    }
  }, [classId, item.id, updateProgress])

  const handleEnded = useCallback(() => {
    updateProgress.mutate({
      classId,
      itemId: item.id,
      completed: true,
    })
  }, [classId, item.id, updateProgress])

  if (!item.videoUrl) {
    return <p className="text-muted-foreground">Không tìm thấy video.</p>
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <ReactPlayer
        url={item.videoUrl}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        onPause={handlePause}
        onEnded={handleEnded}
        onStart={() => {
          if (startSeconds > 0) {
            const player = document.querySelector('video')
            if (player) player.currentTime = startSeconds
          }
        }}
        progressInterval={5000}
      />
    </div>
  )
}
