'use client'

import { useRouter } from 'next/navigation'
import { ImportStepper } from '@/components/patterns'
import { PageHeader } from '@/components/composite'
import type { ImportPreviewData, ImportResult } from '@/components/patterns'
import { useImportBooks } from '@/features/library/api/library.api'

export default function ImportBooksPage() {
  const router = useRouter()
  const importMut = useImportBooks()

  const handleUpload = async (file: File): Promise<ImportPreviewData> => {
    // Client-side preview — in real impl this parses the Excel file
    return {
      headers: ['ISBN', 'Tên sách', 'Tác giả', 'NXB', 'Năm XB', 'Danh mục'],
      rows: [[file.name, '(preview)', '', '', '', '']],
      totalRows: 1,
    }
  }

  const handleConfirm = async (_data: ImportPreviewData): Promise<ImportResult> => {
    // Use the mutation with the actual file
    // For now return placeholder
    return { success: 0, failed: 0 }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import sách từ Excel"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Danh mục sách', href: '/library/catalog' },
          { label: 'Import' },
        ]}
      />
      <ImportStepper
        onUpload={handleUpload}
        onConfirm={handleConfirm}
        onClose={() => router.push('/library/catalog')}
        templateUrl="/templates/books-import-template.xlsx"
      />
    </div>
  )
}
