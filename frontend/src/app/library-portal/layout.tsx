import Link from 'next/link'
import { BookOpen, Search, Home, Newspaper, FileText } from 'lucide-react'

export default function LibraryPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Portal Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/library-portal" className="flex items-center gap-2 cursor-pointer">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg text-purple-700">Thư viện QH</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/library-portal" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <Link href="/library-portal/opac" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Tra cứu OPAC</span>
            </Link>
            <Link href="/library-portal/news" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Tin tức</span>
            </Link>
            <Link href="/library-portal/edocs" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Tài liệu điện tử</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Thư viện THPT Quốc Học Huế</h3>
              <p>10 Lê Lợi, TP. Huế, Thừa Thiên Huế</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Giờ mở cửa</h3>
              <p>Thứ 2 - Thứ 6: 7:00 - 17:00</p>
              <p>Thứ 7: 7:00 - 11:30</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Liên hệ</h3>
              <p>Email: thuvien@quochoc.edu.vn</p>
              <p>ĐT: (0234) 3822 XXX</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
