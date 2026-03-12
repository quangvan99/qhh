'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetNews } from '@/features/library/api/library.api'
import type { NewsArticle } from '@/features/library/types/library.types'
import { NewsCard } from './NewsCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function NewsList() {
  const [page, setPage] = useState(1)
  const { data: newsData, isLoading } = useGetNews({ page, pageSize: 12 })

  const articles = newsData?.data ?? []
  const total = newsData?.total ?? 0
  const totalPages = Math.ceil(total / 12) || 1

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tin tức & Sự kiện</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tin tức & Sự kiện</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: NewsArticle) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Chưa có tin tức nào</p>
      )}

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
