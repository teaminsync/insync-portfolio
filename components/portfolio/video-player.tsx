"use client"

import React, { useRef, useEffect, useState } from "react"

interface VideoPlayerProps {
  media: {
    videoSrc: string
    coverImage?: string | null
    alt: string
    link: string
  }
  index: number
}

const VideoPlayer = React.memo(({ media, index }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showCover, setShowCover] = useState(!!media.coverImage)
  const [isHovering, setIsHovering] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Intersection Observer to detect when video comes into view
  useEffect(() => {
    if (!isMounted) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          } else {
            setIsInView(false)
            // Optionally pause videos when they go out of view
            if (!media.coverImage && videoRef.current) {
              videoRef.current.pause()
              setHasStartedPlaying(false)
            }
          }
        })
      },
      {
        threshold: 0.3, // Start playing when 30% of video is visible
        rootMargin: "100px", // Start loading 100px before it comes into view
      },
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [media.coverImage, isMounted])

  // Autoplay for videos without a cover when in view
  useEffect(() => {
    if (!isMounted) return

    const video = videoRef.current
    if (!video || !isInView || hasStartedPlaying) return

    if (!media.coverImage) {
      const playVideo = async () => {
        try {
          await video.play()
          setHasStartedPlaying(true)
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.error("Video play error:", err)
          }
        }
      }
      playVideo()
    }
  }, [isInView, media.coverImage, hasStartedPlaying, isMounted])

  // Hover-to-play handling for videos WITH a cover
  const handleMouseEnter = () => {
    if (!isMounted) return
    setIsHovering(true)
    if (!media.coverImage) return

    const video = videoRef.current
    if (!video) return

    setShowCover(false)
    video.play().catch((err) => {
      if (err.name !== "AbortError") console.error(err)
    })
  }

  const handleMouseLeave = () => {
    if (!isMounted) return
    setIsHovering(false)
    if (!media.coverImage) return

    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0
    setShowCover(true)
  }

  if (!isMounted) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          showCover ? "opacity-0" : "opacity-100"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={media.videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Cover Image */}
      {media.coverImage && showCover && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={media.coverImage || "/placeholder.svg"}
            alt={media.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
})

VideoPlayer.displayName = "VideoPlayer"

export default VideoPlayer
