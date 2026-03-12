'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Newspaper } from 'lucide-react'
import type { NewsArticle } from '@/features/library/types/library.types'
import { AppBadge } from '@/components/base'

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/library-portal/news/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <div className="aspect-video relative bg-purple-50">
          {article.coverUrl ? (
            <Image src={article.coverUrl} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-purple-300">
              <Newspaper className="h-10 w-10" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
          </p>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <AppBadge key={tag} semantic="neutral" size="sm">{tag}</AppBadge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
