"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentViewerProps {
  url: string
  fileName: string
  fileType: string
}

export function DocumentViewer({ url, fileName, fileType }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const isPdf = fileType === "application/pdf" || fileName.endsWith(".pdf")

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <span className="text-sm font-medium truncate">{fileName}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.max(50, z - 25))} className="cursor-pointer h-7 w-7 p-0" title="Thu nhỏ">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.min(200, z + 25))} className="cursor-pointer h-7 w-7 p-0" title="Phóng to">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setZoom(100)} className="cursor-pointer h-7 w-7 p-0" title="Toàn màn hình">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <a href={url} download={fileName}>
            <Button variant="ghost" size="sm" className="cursor-pointer h-7 w-7 p-0" title="Tải xuống">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-muted/10">
        {isPdf ? (
          <iframe
            src={`${url}#zoom=${zoom}`}
            className="w-full h-full border-0"
            title={fileName}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          />
        ) : (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
            className="w-full h-full border-0"
            title={fileName}
          />
        )}
      </div>
    </div>
  )
}
