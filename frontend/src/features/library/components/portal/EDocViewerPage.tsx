interface EDocViewerPageProps {
  docId: string
}

export function EDocViewerPage({ docId: _docId }: EDocViewerPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đọc tài liệu điện tử</h1>
        <p className="text-muted-foreground mt-2">Tính năng đang được cập nhật...</p>
      </div>
    </div>
  )
}
