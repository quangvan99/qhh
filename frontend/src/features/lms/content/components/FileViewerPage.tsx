'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/composite/page-header'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface FileViewerPageProps {
  classId: string
  groupId: string
  fileId: string
}

export function FileViewerPage({ classId, groupId, fileId }: FileViewerPageProps) {
  const router = useRouter()

  // Mock file info
  const file = {
    name: 'Tài liệu hướng dẫn thực hành.pdf',
    size: '2.3 MB',
    type: 'application/pdf',
    url: 'https://docs.google.com/gview?url=https://example.com/sample.pdf&embedded=true',
  }

  return (
    <div>
      <PageHeader
        title="Xem file"
        breadcrumbs={[
          { label: 'LMS', href: '/lms' },
          { label: 'Nội dung', href: `/lms/classes/${classId}/content` },
          { label: 'File', href: `/lms/classes/${classId}/content/${groupId}/file` },
          { label: 'Xem' },
        ]}
        actions={[
          {
            label: 'Tải xuống',
            onClick: () => toast.info('Đang tải xuống...'),
            icon: <Download className="h-4 w-4" />,
          },
        ]}
      />

      {/* File info */}
      <Card className="mb-4">
        <CardContent className="pt-4 flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.size}</p>
          </div>
        </CardContent>
      </Card>

      {/* Viewer */}
      <div className="rounded-lg border bg-muted/30 overflow-hidden" style={{ height: '70vh' }}>
        <iframe
          src={file.url}
          title={file.name}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}
