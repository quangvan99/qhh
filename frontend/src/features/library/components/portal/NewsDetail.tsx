'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Newspaper } from 'lucide-react'
import { useGetNewsArticle } from '@/features/library/api/library.api'
import { AppBadge } from '@/components/base'
import { Skeleton } from '@/components/ui/skeleton'

interface NewsDetailProps {
  slug: string
}

export function NewsDetail({ slug }: NewsDetailProps) {
  const { data: article, isLoading } = useGetNewsArticle(slug)

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!article) {
    return <div className="text-center py-12 text-muted-foreground">Không tìm thấy bài viết</div>
  }

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/library-portal" className="hover:text-foreground cursor-pointer">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/library-portal/news" className="hover:text-foreground cursor-pointer">Tin tức</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium line-clamp-1">{article.title}</span>
      </nav>

      {/* Cover */}
      {article.coverUrl ? (
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image src={article.coverUrl} alt={article.title} fill className="object-cover" />
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center rounded-lg bg-purple-50 text-purple-300">
          <Newspaper className="h-16 w-16" />
        </div>
      )}

      {/* Title + meta */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
          {article.author && <span>Tác giả: {article.author}</span>}
        </div>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag: string) => (
              <AppBadge key={tag} semantic="neutral" size="sm">{tag}</AppBadge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  )
}
