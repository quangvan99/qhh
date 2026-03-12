"use client"

import { AppButton } from "@/components/base/app-button"

interface ScormViewerProps {
  scormId: string
  title: string
  launchUrl: string
  onClose: () => void
}

export function ScormViewer({ title, launchUrl, onClose }: ScormViewerProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <h2 className="text-sm font-semibold truncate">{title}</h2>
        <AppButton variant="outline" size="sm" onClick={onClose}>Đóng preview</AppButton>
      </div>
      <iframe
        src={launchUrl}
        className="flex-1 w-full border-0"
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
