'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMarkContentViewed } from '../api/student.api'

interface SurveyFormProps {
  classId: string
  surveyId: string
  itemId: string
}

export function SurveyForm({ classId, surveyId, itemId }: SurveyFormProps) {
  const markViewed = useMarkContentViewed()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khảo sát</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Khảo sát sẽ được mở trong cửa sổ mới. Sau khi hoàn thành, nội dung sẽ được đánh dấu đã xem.
        </p>
        <div className="flex gap-2">
          <a
            href={`/survey/${surveyId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="cursor-pointer">Mở khảo sát</Button>
          </a>
          <Button
            variant="outline"
            onClick={() => markViewed.mutate({ classId, itemId })}
            disabled={markViewed.isPending}
            className="cursor-pointer"
          >
            Đánh dấu hoàn thành
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
