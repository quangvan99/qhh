'use client'

import { Download, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentContentItem } from '../types/student.types'

interface FileViewerStudentProps {
  item: StudentContentItem
}

export function FileViewerStudent({ item }: FileViewerStudentProps) {
  if (!item.fileUrl) {
    return <p className="text-muted-foreground">Không tìm thấy tệp.</p>
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <FileIcon className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-lg font-medium">{item.fileName ?? item.title}</h3>
      <a href={item.fileUrl} download target="_blank" rel="noopener noreferrer">
        <Button className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Tải xuống
        </Button>
      </a>
    </div>
  )
}
