'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetPortalNews, useDeletePortalNews } from '@/features/library/api/library.api'
import type { PortalNewsItem } from '@/features/library/types/library.types'
import { CrudPage } from '@/components/patterns'
import { AppBadge } from '@/components/base'
import { toast } from 'sonner'

const categoryLabel: Record<string, string> = {
  news: 'Tin tức',
  event: 'Sự kiện',
  announcement: 'Thông báo',
}

const statusSemantic: Record<string, 'success' | 'warning'> = {
  published: 'success',
  draft: 'warning',
}

const mockData: PortalNewsItem[] = [
  { id: '1', title: 'Khai trương góc đọc sách mới', slug: 'khai-truong-goc-doc-sach-moi', category: 'news', publishDate: '2025-12-01', author: 'Nguyễn Văn A', summary: 'Thư viện khai trương góc đọc sách...', content: '...', thumbnailUrl: '', status: 'published' },
  { id: '2', title: 'Hội sách mùa xuân 2026', slug: 'hoi-sach-mua-xuan-2026', category: 'event', publishDate: '2026-01-15', author: 'Trần Thị B', summary: 'Hội sách mùa xuân...', content: '...', thumbnailUrl: '', status: 'published' },
  { id: '3', title: 'Thay đổi giờ mở cửa dịp Tết', slug: 'thay-doi-gio-mo-cua-dip-tet', category: 'announcement', publishDate: '2026-01-20', author: 'Nguyễn Văn A', summary: 'Thông báo thay đổi giờ...', content: '...', thumbnailUrl: '', status: 'published' },
  { id: '4', title: 'Cuộc thi viết cảm nhận sách', slug: 'cuoc-thi-viet-cam-nhan-sach', category: 'event', publishDate: '2026-02-01', author: 'Lê Văn C', summary: 'Cuộc thi viết cảm nhận...', content: '...', thumbnailUrl: '', status: 'draft' },
  { id: '5', title: 'Sách mới tháng 12/2025', slug: 'sach-moi-thang-12-2025', category: 'news', publishDate: '2025-12-10', author: 'Trần Thị B', summary: 'Danh sách sách mới bổ sung...', content: '...', thumbnailUrl: '', status: 'published' },
  { id: '6', title: 'Workshop kỹ năng đọc hiệu quả', slug: 'workshop-ky-nang-doc-hieu-qua', category: 'event', publishDate: '2026-02-15', author: 'Phạm Thị D', summary: 'Workshop kỹ năng đọc...', content: '...', thumbnailUrl: '', status: 'draft' },
  { id: '7', title: 'Thông báo bảo trì hệ thống OPAC', slug: 'thong-bao-bao-tri-he-thong-opac', category: 'announcement', publishDate: '2026-01-25', author: 'Nguyễn Văn A', summary: 'Hệ thống OPAC sẽ bảo trì...', content: '...', thumbnailUrl: '', status: 'published' },
  { id: '8', title: 'Tuyển tình nguyện viên thư viện', slug: 'tuyen-tinh-nguyen-vien-thu-vien', category: 'announcement', publishDate: '2026-03-01', author: 'Lê Văn C', summary: 'Thư viện tuyển tình nguyện viên...', content: '...', thumbnailUrl: '', status: 'draft' },
]

const columns: ColumnDef<PortalNewsItem, unknown>[] = [
  { accessorKey: 'title', header: 'Tiêu đề' },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    size: 120,
    cell: ({ getValue }) => categoryLabel[getValue() as string] ?? getValue(),
  },
  {
    accessorKey: 'publishDate',
    header: 'Ngày đăng',
    size: 120,
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('vi-VN'),
  },
  { accessorKey: 'author', header: 'Tác giả', size: 150 },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    size: 120,
    cell: ({ getValue }) => {
      const v = getValue() as string
      return (
        <AppBadge semantic={statusSemantic[v] ?? 'neutral'} size="sm">
          {v === 'published' ? 'Đã đăng' : 'Nháp'}
        </AppBadge>
      )
    },
  },
]

export function PortalNewsListPage() {
  const { data: apiData, isLoading } = useGetPortalNews()
  const deleteMut = useDeletePortalNews()
  const router = useRouter()
  const [useMock] = useState(true)

  const data = useMemo(() => {
    if (useMock || !apiData) return mockData
    return apiData.data
  }, [apiData, useMock])

  const handleDelete = (row: PortalNewsItem) => {
    deleteMut.mutate(row.id, {
      onSuccess: () => toast.success('Đã xóa tin tức'),
      onError: () => toast.error('Không thể xóa tin tức'),
    })
  }

  return (
    <CrudPage<PortalNewsItem>
      title="Tin tức & Sự kiện"
      subtitle="Quản lý tin tức, sự kiện, thông báo trên portal thư viện"
      breadcrumbs={[
        { label: 'Thư viện', href: '/library/catalog' },
        { label: 'Portal CMS' },
        { label: 'Tin tức' },
      ]}
      data={data}
      columns={columns}
      loading={isLoading && !useMock}
      onCreate={() => router.push('/library/portal-news/new')}
      onEdit={(row) => router.push(`/library/portal-news/${row.id}/edit`)}
      onDelete={handleDelete}
      searchPlaceholder="Tìm tin tức..."
    />
  )
}
