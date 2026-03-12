'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetEDocuments } from '@/features/library/api/library.api'
import type { EDocument } from '@/features/library/types/library.types'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const mockDocs: EDocument[] = [
  { id: '1', title: 'Toán cao cấp - Tập 1', author: 'Nguyễn Đình Trí', publisher: 'NXB Giáo dục', publishYear: 2020, category: 'Toán học', docType: 'PDF', pageCount: 320, description: 'Giáo trình toán cao cấp...', tags: ['toán', 'đại số'], isFree: true },
  { id: '2', title: 'Vật lý đại cương', author: 'Lương Duyên Bình', publisher: 'NXB Giáo dục', publishYear: 2019, category: 'Vật lý', docType: 'PDF', pageCount: 450, description: 'Giáo trình vật lý đại cương...', tags: ['vật lý'], isFree: true },
  { id: '3', title: 'Hóa học hữu cơ', author: 'Trần Quốc Sơn', publisher: 'NXB KHKT', publishYear: 2021, category: 'Hóa học', docType: 'PDF', pageCount: 280, description: 'Giáo trình hóa học hữu cơ...', tags: ['hóa học'], isFree: false },
  { id: '4', title: 'Lịch sử Việt Nam hiện đại', author: 'Trần Văn Giàu', publisher: 'NXB Chính trị', publishYear: 2018, category: 'Lịch sử', docType: 'EPUB', pageCount: 520, description: 'Lịch sử Việt Nam từ 1945...', tags: ['lịch sử', 'Việt Nam'], isFree: true },
  { id: '5', title: 'Ngữ pháp tiếng Anh nâng cao', author: 'Raymond Murphy', publisher: 'Cambridge', publishYear: 2022, category: 'Ngoại ngữ', docType: 'PDF', pageCount: 380, description: 'Advanced English Grammar...', tags: ['tiếng Anh', 'ngữ pháp'], isFree: false },
  { id: '6', title: 'Sinh học phân tử', author: 'Nguyễn Như Hiền', publisher: 'NXB ĐHQG', publishYear: 2020, category: 'Sinh học', docType: 'PDF', pageCount: 290, description: 'Giáo trình sinh học phân tử...', tags: ['sinh học'], isFree: true },
  { id: '7', title: 'Văn học Việt Nam thế kỷ XX', author: 'Nguyễn Đăng Mạnh', publisher: 'NXB Giáo dục', publishYear: 2017, category: 'Văn học', docType: 'EPUB', pageCount: 410, description: 'Tổng quan văn học Việt Nam...', tags: ['văn học'], isFree: true },
  { id: '8', title: 'Thí nghiệm Hóa học cơ bản', author: 'Phạm Văn Nhiêu', publisher: 'NXB ĐHQG', publishYear: 2021, category: 'Hóa học', docType: 'Video', pageCount: undefined, description: 'Video hướng dẫn thí nghiệm...', tags: ['hóa học', 'thí nghiệm'], isFree: false },
  { id: '9', title: 'Địa lý tự nhiên Việt Nam', author: 'Lê Bá Thảo', publisher: 'NXB Giáo dục', publishYear: 2019, category: 'Địa lý', docType: 'PDF', pageCount: 350, description: 'Giáo trình địa lý tự nhiên...', tags: ['địa lý'], isFree: true },
  { id: '10', title: 'GDCD - Pháp luật đại cương', author: 'Nguyễn Văn Động', publisher: 'NXB Công an', publishYear: 2020, category: 'GDCD', docType: 'PDF', pageCount: 200, description: 'Giáo trình pháp luật đại cương...', tags: ['GDCD', 'pháp luật'], isFree: true },
  { id: '11', title: 'Tin học ứng dụng', author: 'Hồ Sĩ Đàm', publisher: 'NXB Giáo dục', publishYear: 2022, category: 'Tin học', docType: 'PDF', pageCount: 260, description: 'Giáo trình tin học ứng dụng...', tags: ['tin học'], isFree: false },
  { id: '12', title: 'Kỹ năng thuyết trình', author: 'Dale Carnegie', publisher: 'NXB Tổng hợp', publishYear: 2023, category: 'Kỹ năng', docType: 'Video', pageCount: undefined, description: 'Video hướng dẫn kỹ năng...', tags: ['kỹ năng mềm'], isFree: true },
]

const categoryOptions = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'Toán học', label: 'Toán học' },
  { value: 'Vật lý', label: 'Vật lý' },
  { value: 'Hóa học', label: 'Hóa học' },
  { value: 'Sinh học', label: 'Sinh học' },
  { value: 'Lịch sử', label: 'Lịch sử' },
  { value: 'Văn học', label: 'Văn học' },
  { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
  { value: 'Địa lý', label: 'Địa lý' },
  { value: 'GDCD', label: 'GDCD' },
  { value: 'Tin học', label: 'Tin học' },
  { value: 'Kỹ năng', label: 'Kỹ năng' },
]

const yearOptions = [
  { value: '', label: 'Tất cả năm' },
  ...Array.from({ length: 8 }, (_, i) => {
    const y = String(2023 - i)
    return { value: y, label: y }
  }),
]

const docTypeBadge: Record<string, 'info' | 'success' | 'warning'> = {
  PDF: 'info',
  EPUB: 'success',
  Video: 'warning',
}

export function EDocListPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 9

  const { data: apiData, isLoading } = useGetEDocuments({
    search: search || undefined,
    category: category || undefined,
    year: year ? Number(year) : undefined,
    page,
    pageSize,
  })

  const allDocs = useMemo(() => {
    if (apiData?.data) return apiData.data
    return mockDocs
  }, [apiData])

  const filtered = useMemo(() => {
    let result = allDocs
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) => d.title.toLowerCase().includes(q) || d.author.toLowerCase().includes(q)
      )
    }
    if (category) result = result.filter((d) => d.category === category)
    if (year) result = result.filter((d) => d.publishYear === Number(year))
    return result
  }, [allDocs, search, category, year])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tài liệu điện tử</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tài liệu điện tử</h1>
      <p className="text-muted-foreground">Tra cứu và đọc tài liệu trực tuyến miễn phí</p>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <AppInput
          placeholder="Tìm theo tên tài liệu, tác giả..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          leftAddon={<Search className="h-4 w-4" />}
          className="w-72"
        />
        <AppSelect
          options={categoryOptions}
          value={category}
          onChange={(v) => { setCategory(v); setPage(1) }}
          placeholder="Danh mục"
          className="w-44"
        />
        <AppSelect
          options={yearOptions}
          value={year}
          onChange={(v) => { setYear(v); setPage(1) }}
          placeholder="Năm XB"
          className="w-36"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Tìm thấy {filtered.length} tài liệu
      </p>

      {/* Grid cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paged.map((doc) => (
          <EDocCard key={doc.id} doc={doc} />
        ))}
      </div>

      {paged.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Không tìm thấy tài liệu nào</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function EDocCard({ doc }: { doc: EDocument }) {
  return (
    <Link href={`/library-portal/edocs/${doc.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <div className="aspect-[3/4] relative bg-purple-50 flex items-center justify-center">
          <FileText className="h-16 w-16 text-purple-300" />
          <div className="absolute top-2 right-2">
            <AppBadge semantic={docTypeBadge[doc.docType] ?? 'neutral'} size="sm">
              {doc.docType}
            </AppBadge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{doc.author}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{doc.publishYear}</span>
            <AppBadge semantic={doc.isFree ? 'success' : 'warning'} size="sm">
              {doc.isFree ? 'Miễn phí' : 'Đăng nhập để đọc'}
            </AppBadge>
          </div>
        </div>
      </div>
    </Link>
  )
}
