'use client'

import Link from 'next/link'
import { Search, BookOpen, Users, ArrowRight } from 'lucide-react'
import { useGetLibraryStats, useGetNews } from '@/features/library/api/library.api'
import type { NewsArticle } from '@/features/library/types/library.types'
import { NewsCard } from './NewsCard'
import { Button } from '@/components/ui/button'
import { AppInput } from '@/components/base'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LibraryPortalHome() {
  const router = useRouter()
  const { data: stats } = useGetLibraryStats()
  const { data: newsData } = useGetNews({ page: 1, pageSize: 3 })
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/library-portal/opac?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const recentNews = newsData?.data ?? []

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-20 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Thư viện THPT Quốc Học Huế
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Tra cứu tài liệu, sách và ấn phẩm trong hệ thống thư viện
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <AppInput
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftAddon={<Search className="h-5 w-5 text-white/60" />}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
              />
              <Button
                type="submit"
                className="cursor-pointer bg-white text-purple-700 hover:bg-purple-50 shrink-0"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Tài liệu', value: stats?.totalBooks ?? 0, icon: BookOpen },
          { label: 'Có sẵn', value: stats?.availableBooks ?? 0, icon: BookOpen },
          { label: 'Bạn đọc', value: stats?.totalMembers ?? 0, icon: Users },
          { label: 'Lượt mượn/tháng', value: stats?.borrowsThisMonth ?? 0, icon: BookOpen },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-6 rounded-xl border bg-card">
            <stat.icon className="h-8 w-8 mx-auto text-purple-500 mb-3" />
            <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString('vi-VN')}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Quick links */}
      <section className="flex items-center justify-center gap-4">
        <Link href="/library-portal/opac">
          <Button variant="outline" size="lg" className="cursor-pointer gap-2">
            <Search className="h-5 w-5" />
            Tra cứu OPAC
          </Button>
        </Link>
        <Link href="/library-portal/news">
          <Button variant="outline" size="lg" className="cursor-pointer gap-2">
            Tin tức
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Recent news */}
      {recentNews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Tin tức & Sự kiện</h2>
            <Link href="/library-portal/news" className="text-sm text-purple-600 hover:underline cursor-pointer flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((article: NewsArticle) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
