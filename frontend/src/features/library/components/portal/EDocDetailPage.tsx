'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { FileText, BookOpen, Download, ArrowLeft } from 'lucide-react'
import { useGetEDocument } from '@/features/library/api/library.api'
import type { EDocument } from '@/features/library/types/library.types'
import { AppBadge } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const mockDoc: EDocument = {
  id: '1',
  title: 'Toán cao cấp - Tập 1',
  author: 'Nguyễn Đình Trí',
  publisher: 'NXB Giáo dục Việt Nam',
  publishYear: 2020,
  category: 'Toán học',
  docType: 'PDF',
  pageCount: 320,
  description: 'Giáo trình Toán cao cấp tập 1 dành cho sinh viên các trường đại học và cao đẳng khối kỹ thuật. Nội dung bao gồm: đại số tuyến tính, giải tích hàm một biến, phương trình vi phân. Cuốn sách được biên soạn theo chương trình khung của Bộ Giáo dục và Đào tạo, phù hợp cho việc tự học và tham khảo.',
  tags: ['toán', 'đại số', 'giải tích', 'giáo trình'],
  isFree: true,
  fileUrl: 'https://mozilla.github.io/pdf.js/web/viewer.html',
}

const mockRelated: EDocument[] = [
  { id: '2', title: 'Vật lý đại cương', author: 'Lương Duyên Bình', publisher: 'NXB Giáo dục', publishYear: 2019, category: 'Vật lý', docType: 'PDF', pageCount: 450, isFree: true, tags: [] },
  { id: '3', title: 'Hóa học hữu cơ', author: 'Trần Quốc Sơn', publisher: 'NXB KHKT', publishYear: 2021, category: 'Hóa học', docType: 'PDF', pageCount: 280, isFree: false, tags: [] },
  { id: '6', title: 'Sinh học phân tử', author: 'Nguyễn Như Hiền', publisher: 'NXB ĐHQG', publishYear: 2020, category: 'Sinh học', docType: 'PDF', pageCount: 290, isFree: true, tags: [] },
  { id: '9', title: 'Địa lý tự nhiên Việt Nam', author: 'Lê Bá Thảo', publisher: 'NXB Giáo dục', publishYear: 2019, category: 'Địa lý', docType: 'PDF', pageCount: 350, isFree: true, tags: [] },
]

interface EDocDetailPageProps {
  docId: string
}

const docTypeBadge: Record<string, 'info' | 'success' | 'warning'> = {
  PDF: 'info',
  EPUB: 'success',
  Video: 'warning',
}

export function EDocDetailPage({ docId }: EDocDetailPageProps) {
  const { data: apiDoc, isLoading } = useGetEDocument(docId)

  const doc = useMemo(() => apiDoc ?? mockDoc, [apiDoc])
  const related = useMemo(() => doc.relatedDocs ?? mockRelated, [doc])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-80 w-56 rounded-lg shrink-0" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/library-portal/edocs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Main content: 2 columns */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: cover + actions */}
        <div className="shrink-0 space-y-4">
          <div className="flex h-80 w-56 items-center justify-center rounded-lg bg-purple-50 text-purple-300 shadow-lg">
            <FileText className="h-20 w-20" />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Link href={`/library-portal/edocs/${docId}/read`}>
              <Button className="w-full cursor-pointer gap-2">
                <BookOpen className="h-4 w-4" />
                Đọc online
              </Button>
            </Link>
            <Button variant="outline" className="w-full cursor-pointer gap-2">
              <Download className="h-4 w-4" />
              Tải về
            </Button>
          </div>
        </div>

        {/* Right: info */}
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl font-bold text-foreground">{doc.title}</h1>
          <p className="text-lg text-muted-foreground">{doc.author}</p>

          <div className="flex gap-2">
            <AppBadge semantic={docTypeBadge[doc.docType] ?? 'neutral'} size="sm">
              {doc.docType}
            </AppBadge>
            <AppBadge semantic={doc.isFree ? 'success' : 'warning'} size="sm">
              {doc.isFree ? 'Miễn phí' : 'Đăng nhập để đọc'}
            </AppBadge>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><span className="text-muted-foreground">NXB:</span> <span className="font-medium">{doc.publisher ?? '—'}</span></div>
            <div><span className="text-muted-foreground">Năm XB:</span> <span className="font-medium">{doc.publishYear}</span></div>
            <div><span className="text-muted-foreground">Loại:</span> <span className="font-medium">{doc.docType}</span></div>
            <div><span className="text-muted-foreground">Số trang:</span> <span className="font-medium">{doc.pageCount ?? '—'}</span></div>
            <div><span className="text-muted-foreground">Danh mục:</span> <span className="font-medium">{doc.category}</span></div>
          </div>

          {doc.description && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-2">Mô tả</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{doc.description}</p>
            </div>
          )}

          {doc.tags && doc.tags.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                  <AppBadge key={tag} semantic="neutral" size="sm">{tag}</AppBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related docs */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold">Tài liệu liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((rd) => (
              <Link key={rd.id} href={`/library-portal/edocs/${rd.id}`} className="group block">
                <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
                  <div className="aspect-[3/4] relative bg-purple-50 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-purple-300" />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {rd.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{rd.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
