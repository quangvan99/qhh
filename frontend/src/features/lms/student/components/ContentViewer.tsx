'use client'

import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMarkContentViewed } from '../api/student.api'
import type { StudentContentItem, StudentContentGroup } from '../types/student.types'
import { ScormLauncher } from './ScormLauncher'
import { VideoViewerStudent } from './VideoViewerStudent'
import { FileViewerStudent } from './FileViewerStudent'
import { SurveyForm } from './SurveyForm'

interface ContentViewerProps {
  classId: string
  item: StudentContentItem
  groups: StudentContentGroup[]
  onNavigate: (groupId: string, itemId: string) => void
}

export function ContentViewer({ classId, item, groups, onNavigate }: ContentViewerProps) {
  const markViewed = useMarkContentViewed()

  useEffect(() => {
    if (item.type === 'text' || item.type === 'file' || item.type === 'offline') {
      markViewed.mutate({ classId, itemId: item.id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.type, classId])

  // Find prev/next items across all groups
  const allItems: { groupId: string; item: StudentContentItem }[] = []
  for (const group of groups) {
    for (const it of group.items) {
      allItems.push({ groupId: group.id, item: it })
    }
  }
  const currentIndex = allItems.findIndex((ai) => ai.item.id === item.id)
  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : undefined
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : undefined

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="min-h-[400px]">
          {item.type === 'scorm' && (
            <ScormLauncher classId={classId} item={item} />
          )}
          {item.type === 'video' && (
            <VideoViewerStudent classId={classId} item={item} />
          )}
          {item.type === 'text' && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: item.textContent ?? '' }}
            />
          )}
          {item.type === 'file' && (
            <FileViewerStudent item={item} />
          )}
          {item.type === 'survey' && item.surveyId && (
            <SurveyForm classId={classId} surveyId={item.surveyId} itemId={item.id} />
          )}
          {item.type === 'offline' && item.offlineInfo && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Buổi học trực tiếp</h3>
              <div className="grid gap-2 text-sm">
                <p><strong>Địa điểm:</strong> {item.offlineInfo.location}</p>
                <p><strong>Thời gian:</strong> {item.offlineInfo.time}</p>
                {item.offlineInfo.materials && (
                  <p><strong>Tài liệu:</strong> {item.offlineInfo.materials}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!prev || prev.item.locked}
          onClick={() => prev && onNavigate(prev.groupId, prev.item.id)}
          className="cursor-pointer"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Nội dung trước
        </Button>

        {!item.completed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markViewed.mutate({ classId, itemId: item.id })}
            disabled={markViewed.isPending}
            className="cursor-pointer"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Đánh dấu hoàn thành
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={!next || next.item.locked}
          onClick={() => next && onNavigate(next.groupId, next.item.id)}
          className="cursor-pointer"
        >
          Nội dung tiếp
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ContentViewerSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  )
}
