interface NewsDetailProps {
  slug: string
}

export function NewsDetail({ slug: _slug }: NewsDetailProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Chi tiết tin tức</h1>
        <p className="text-muted-foreground mt-2">Tính năng đang được cập nhật...</p>
      </div>
    </div>
  )
}
