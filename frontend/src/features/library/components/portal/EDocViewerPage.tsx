'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EDocViewerPageProps {
  docId: string
}

export function EDocViewerPage({ docId }: EDocViewerPageProps) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 320

  const handleClose = () => {
    router.push(`/library-portal/edocs/${docId}`)
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 25, 50))
  }

  const viewerUrl = 'https://mozilla.github.io/pdf.js/web/viewer.html'

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium truncate max-w-xs">
            Toán cao cấp - Tập 1
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="cursor-pointer"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="cursor-pointer"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Page indicator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Trang</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (v >= 1 && v <= totalPages) setCurrentPage(v)
              }}
              className="w-12 h-6 text-center border rounded text-xs"
            />
            <span>/ {totalPages}</span>
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Fullscreen toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFullscreen}
            className="cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewer iframe */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title="Document Viewer"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        />
      </div>
    </div>
  )
}
