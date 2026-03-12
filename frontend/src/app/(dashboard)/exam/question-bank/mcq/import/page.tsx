'use client'

import { ImportStepper } from '@/components/patterns/import-stepper'
import type { ImportPreviewData, ImportResult } from '@/components/patterns/import-stepper'
import { useRouter } from 'next/navigation'

export default function ImportMCQPage() {
  const router = useRouter()

  return (
    <div className="max-w-3xl mx-auto">
      <ImportStepper
        templateUrl="/templates/questions-template.xlsx"
        onUpload={async (_file: File) => ({ headers: ['Nội dung', 'Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D', 'Đáp án đúng'], rows: [], totalRows: 0 })}
        onConfirm={async (_data: ImportPreviewData): Promise<ImportResult> => ({ success: 0, failed: 0 })}
        onClose={() => router.push('/exam/question-bank')}
      />
    </div>
  )
}
