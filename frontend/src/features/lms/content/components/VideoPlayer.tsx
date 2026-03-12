"use client"

interface VideoPlayerProps {
  url: string
  poster?: string
  className?: string
}

export function VideoPlayer({ url, poster, className }: VideoPlayerProps) {
  // Use native video for upload, iframe for embed URLs
  const isEmbed = url.includes("youtube") || url.includes("vimeo") || url.includes("youtu.be")

  if (isEmbed) {
    // Convert YouTube URL to embed
    let embedUrl = url
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v")
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    return (
      <div className={className}>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <video controls className="w-full rounded-lg" poster={poster}>
        <source src={url} />
        Trình duyệt không hỗ trợ video.
      </video>
    </div>
  )
}
