"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { ExternalLink, Play } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ───────────────────────── Separate Left Text Component ──────────────────────────
const LeftTextContent = ({ currentStep }: { currentStep: number }) => {
  const sections = [
    {
      title: "Websites",
      subtitle: "Digital Experiences",
      description:
        "Fast, fluid, modern websites built with Next.js, React, and Tailwind CSS. Optimized for SEO, performance, and accessibility.",
    },
    {
      title: "Video Production",
      subtitle: "Cinematic Storytelling",
      description:
        "From concept to final cut — cinematic storytelling that captivates and converts. Professional video production for creators, founders, and brands.",
    },
    {
      title: "Branded",
      subtitle: "Brand Campaigns",
      description:
        "Strategic brand content that builds recognition and drives engagement. Creative campaigns that tell your brand story effectively.",
    },
    {
      title: "Events",
      subtitle: "Live Coverage",
      description:
        "Professional event coverage and editing for memorable moments. Capturing the essence of your special occasions with cinematic quality.",
    },
  ]

  return (
    <div className="w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider text-gray-400 font-medium">
              {sections[currentStep].subtitle}
            </p>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                {sections[currentStep].title}
              </span>
            </h3>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">{sections[currentStep].description}</p>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex gap-2">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                      : i < currentStep
                        ? "w-4 bg-blue-400/60"
                        : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 ml-2">
              {String(currentStep + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
            </span>
          </div>

          {/* Current Section Indicator */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Currently viewing: {sections[currentStep].title}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ───────────────────────── Video Player Component with Intersection Observer ──────────────────────────
const VideoPlayer = React.memo(({ media, index }: { media: any; index: number }) => {
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

  /* ── autoplay for videos without a cover when in view ────────────────────────── */
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

  /* ── hover-to-play handling for videos WITH a cover ─────────────── */
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

      {/* Cover Image with Play Button */}
      {media.coverImage && showCover && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={media.coverImage || "/placeholder.svg"}
            alt={media.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </div>
        </div>
      )}

      {/* LIVE badge for always-playing videos */}
      {!media.coverImage && (
        <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-red-600/80 rounded z-20">LIVE</span>
      )}

      {/* Loading indicator when not in view */}
      {!isInView && !media.coverImage && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* Debug indicator */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-mono bg-blue-600/80 rounded z-20">
        InView: {isInView ? "Yes" : "No"} | Playing: {hasStartedPlaying ? "Yes" : "No"}
      </div>
    </div>
  )
})

VideoPlayer.displayName = "VideoPlayer"

// ───────────────────────── Media Grid Component (Stable) ──────────────────────────
const MediaGrid = React.memo(() => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const allMedia = [
    // Websites section (3 images: 0-2)
    {
      type: "image",
      src: "/images/savefarm.svg",
      alt: "Save Farm Website",
      link: "https://savefarm.in",
      size: "large",
      sectionIndex: 0,
      horizontalPosition: "left",
    },
    {
      type: "image",
      src: "/images/impactpure.svg",
      alt: "IMPACTPURE Platform",
      link: "https://impactpure.vercel.app",
      size: "large",
      sectionIndex: 0,
      horizontalPosition: "right",
    },
    {
      type: "image",
      src: "/placeholder.svg?height=250&width=350",
      alt: "Portfolio Website",
      link: "#",
      size: "large",
      sectionIndex: 0,
      horizontalPosition: "center",
    },

    // Video Production section (4 videos: 3-6)
    {
      type: "video",
      videoSrc: "/images/domin8.webm",
      coverImage: null,
      alt: "Domin8",
      link: "#",
      size: "reel",
      sectionIndex: 1,
      isTrigger: true,
      triggerName: "Video Production Trigger",
      horizontalPosition: "right",
    },
    {
      type: "video",
      videoSrc: "/images/shantanu.webm",
      coverImage: "/images/shantanu.jpg",
      alt: "Shantanu",
      link: "https://www.youtube.com/watch?v=3LEKpf01n6U",
      size: "youtube",
      sectionIndex: 1,
      horizontalPosition: "left",
    },
    {
      type: "video",
      videoSrc: "/images/domin82.webm",
      coverImage: null,
      alt: "Domin8",
      link: "#",
      size: "reel",
      sectionIndex: 1,
      horizontalPosition: "center",
    },
    {
      type: "video",
      videoSrc: "/images/podcast.webm",
      coverImage: "/images/podcast.jpg",
      alt: "Podcast",
      link: "https://www.youtube.com/watch?v=z3sR8tzKq0g&t=1184s",
      size: "youtube",
      sectionIndex: 1,
      horizontalPosition: "right",
    },

    // Branded section (3 videos: 7-9) - Updated count
    {
      type: "video",
      videoSrc: "/images/mpi.webm",
      coverImage: null,
      alt: "MPI",
      link: "#",
      size: "reel",
      sectionIndex: 2,
      isTrigger: true,
      triggerName: "Branded Trigger",
      horizontalPosition: "left",
    },
    {
      type: "video",
      videoSrc: "/images/vimxritviz.webm",
      coverImage: null,
      alt: "Vim India x Ritviz",
      link: "#",
      size: "reel",
      sectionIndex: 2,
      horizontalPosition: "right",
    },
    {
      type: "video",
      videoSrc: "/images/impactpure.webm",
      coverImage: null,
      alt: "IMPACTPURE Brand Reel",
      link: "#",
      size: "reel",
      sectionIndex: 2,
      horizontalPosition: "center",
    },

    // Events section (1 video: 10) - Updated index
    {
      type: "video",
      videoSrc: "/images/event.webm",
      coverImage: null,
      alt: "Rukmini - Marathi Play",
      link: "https://www.instagram.com/reel/CzQuC4-oROp/",
      size: "reel",
      sectionIndex: 3,
      isTrigger: true,
      triggerName: "Events Trigger",
      horizontalPosition: "left",
    },
  ]

  const getImageSize = (size: string) => {
    switch (size) {
      case "large":
        return "w-[30rem] h-[17.8rem] lg:w-[34rem] lg:h-[20.15rem]"
      case "medium":
        return "w-[22rem] h-[13.05rem] lg:w-96 lg:h-[14.25rem]"
      case "small":
        return "w-[18rem] h-[10.7rem] lg:w-80 lg:h-[11.85rem]"
      case "reel":
        return "w-[18rem] h-[32rem] lg:w-[22.5rem] lg:h-[40rem]"
      case "youtube":
        return "w-[28rem] h-[15.75rem] lg:w-[34rem] lg:h-[19.1rem]"
      default:
        return "w-[22rem] h-[13.05rem]"
    }
  }

  const getHorizontalPosition = (position: string) => {
    switch (position) {
      case "left":
        return "justify-start"
      case "right":
        return "justify-end"
      case "center":
        return "justify-center"
      default:
        return "justify-center"
    }
  }

  const sections = [{ title: "Websites" }, { title: "Video Production" }, { title: "Branded" }, { title: "Events" }]

  if (!isMounted) {
    return (
      <div className="px-6 lg:px-8">
        <div className="py-12 space-y-12">
          {allMedia.map((media, index) => (
            <div
              key={`media-${index}`}
              className={`group cursor-pointer flex ${getHorizontalPosition(media.horizontalPosition)}`}
            >
              <div
                className={`${getImageSize(media.size)} relative overflow-hidden bg-gray-900 flex items-center justify-center`}
              >
                <div className="text-gray-400 text-sm">Loading...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 lg:px-8">
      <div className="py-12 space-y-12">
        {allMedia.map((media, index) => {
          const isTriggerMedia = media.isTrigger

          return (
            <motion.div
              key={`media-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              viewport={{ once: true, margin: "-100px" }}
              className={`group cursor-pointer flex ${getHorizontalPosition(media.horizontalPosition)}`}
              data-image-index={index}
            >
              <div className={`${getImageSize(media.size)} relative overflow-hidden`}>
                {/* Render Image or Video based on type */}
                {media.type === "image" ? (
                  <img
                    src={media.src || "/placeholder.svg"}
                    alt={media.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <VideoPlayer media={media} index={index} />
                )}

                {/* Clean Overlay on Hover */}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <motion.a
                    href={media.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 text-black rounded-lg text-sm font-medium hover:bg-white transition-colors pointer-events-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </motion.a>
                </div>

                {/* Section Indicator for Trigger Media */}
                {isTriggerMedia && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-medium z-30">
                    🎯 TRIGGER: {media.triggerName}
                  </div>
                )}

                {/* Media Position Indicator */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white z-30">
                  #{index + 1} - {sections[media.sectionIndex].title}
                </div>

                {/* Debug: Show exact media index */}
                <div className="absolute bottom-4 left-4 px-2 py-1 bg-yellow-500/80 backdrop-blur-sm rounded text-xs font-mono text-black z-30">
                  Index: {index} | Type: {media.type}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
})

MediaGrid.displayName = "MediaGrid"

// Advanced Channel Management Component
const ChannelManagementSection = () => {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null)
  const [isHoveringButton, setIsHoveringButton] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cursor tracking with smooth interpolation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothX = useSpring(cursorX, { damping: 25, stiffness: 200 })
  const smoothY = useSpring(cursorY, { damping: 25, stiffness: 200 })

  const channels = [
    {
      name: "IIFA",
      url: "https://www.youtube.com/@iifa/featured",
      thumbnail: "/images/impactpure.svg",
      description: "International Indian Film Academy",
    },
    {
      name: "Crewcut",
      url: "https://www.youtube.com/@crewcut",
      thumbnail: "/images/savefarm.svg",
      description: "Professional Video Editing",
    },
    {
      name: "Sreesanth Nair",
      url: "https://www.youtube.com/@sreesanthnair09",
      thumbnail: "/images/impactpure.svg",
      description: "Creative Content Creator",
    },
  ]

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMounted) return
    cursorX.set(e.clientX - 160) // Half of thumbnail width (320px / 2)
    cursorY.set(e.clientY - 120) // Half of thumbnail height (240px / 2)
  }

  const showThumbnail = (channelName: string) => {
    if (!isMounted) return
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setHoveredChannel(channelName)
  }

  const hideThumbnail = () => {
    if (!isMounted) return
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }

    // Set a timeout to hide the thumbnail
    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringButton) {
        setHoveredChannel(null)
      }
      hideTimeoutRef.current = null
    }, 150)
  }

  const handleButtonEnter = () => {
    if (!isMounted) return
    // Clear hide timeout when entering button
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsHoveringButton(true)
  }

  const handleButtonLeave = () => {
    if (!isMounted) return
    setIsHoveringButton(false)
    setHoveredChannel(null)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  if (!isMounted) {
    return (
      <section className="mt-32 mx-6 relative">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Channel Management &{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Optimization
            </span>
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Strategic content management and optimization for leading YouTube channels
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          {channels.map((channel, index) => (
            <div key={channel.name} className="relative group cursor-pointer">
              <div className="flex items-center justify-between py-8 px-6 border-b border-white/10">
                <div>
                  <h4 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-none">
                    {channel.name}
                  </h4>
                  <p className="text-gray-400 text-lg mt-2">{channel.description}</p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-32 mx-6 relative"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Section Header */}
      <div className="text-center mb-20">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Channel Management &{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Optimization
          </span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Strategic content management and optimization for leading YouTube channels
        </motion.p>
      </div>

      {/* Vertical Channel List */}
      <div className="max-w-4xl mx-auto space-y-12">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative group cursor-pointer"
            onMouseEnter={() => showThumbnail(channel.name)}
            onMouseLeave={hideThumbnail}
          >
            {/* Channel Name */}
            <div className="flex items-center justify-between py-8 px-6 border-b border-white/10 hover:border-white/30 transition-colors duration-500 relative z-20">
              <div>
                <h4 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-none group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
                  {channel.name}
                </h4>
                <p className="text-gray-400 text-lg mt-2 group-hover:text-gray-300 transition-colors duration-300">
                  {channel.description}
                </p>
              </div>

              {/* Subtle Arrow Indicator */}
              <motion.div
                animate={{
                  x: hoveredChannel === channel.name ? 10 : 0,
                  opacity: hoveredChannel === channel.name ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className="text-2xl text-gray-400"
              >
                →
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cursor-Following Thumbnail */}
      <AnimatePresence>
        {hoveredChannel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed z-50"
            style={{
              left: smoothX,
              top: smoothY,
              pointerEvents: "none",
            }}
          >
            <motion.div
              animate={{
                rotateX: isHoveringButton ? 5 : 0,
                rotateY: isHoveringButton ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-80 h-60 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Thumbnail Image */}
              <img
                src={channels.find((c) => c.name === hoveredChannel)?.thumbnail || "/placeholder.svg"}
                alt={`${hoveredChannel} thumbnail`}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Centered View Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.a
                  href={channels.find((c) => c.name === hoveredChannel)?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={handleButtonEnter}
                  onMouseLeave={handleButtonLeave}
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-black font-semibold rounded-full border border-white/20 hover:bg-white transition-all duration-300 flex items-center gap-2 group"
                  style={{ pointerEvents: "auto" }}
                >
                  <span>View Channel</span>
                  <motion.div animate={{ x: isHoveringButton ? 5 : 0 }} transition={{ duration: 0.2 }}>
                    <ExternalLink className="w-4 h-4" />
                  </motion.div>
                </motion.a>
              </div>

              {/* Subtle Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />
    </motion.section>
  )
}

// ───────────────────────── Main Component ──────────────────────────
const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !containerRef.current || !leftTextRef.current) return

    // Wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      const leftTextElement = leftTextRef.current
      const firstImage = document.querySelector(`[data-image-index="0"]`)
      const lastImage = document.querySelector(`[data-image-index="10"]`)

      if (!leftTextElement || !firstImage || !lastImage) return

      // Pin the left text during the entire image section
      const pinTrigger = ScrollTrigger.create({
        trigger: firstImage,
        start: "top 20%",
        endTrigger: lastImage,
        end: "bottom 80%",
        pin: leftTextElement,
        pinSpacing: false,
        id: "pin-left-text",
      })

      // Create individual triggers for content changes
      const imageTriggers: any[] = []

      // Default to Websites at start
      setCurrentStep(0)

      // Video Production trigger
      const videoProductionTrigger = document.querySelector(`[data-image-index="3"]`)
      if (videoProductionTrigger) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: videoProductionTrigger,
            start: "top 40%",
            end: "bottom 40%",
            onEnter: () => setCurrentStep(1),
            onEnterBack: () => setCurrentStep(1),
            onLeaveBack: () => setCurrentStep(0),
            id: "video-production-trigger",
          }),
        )
      }

      // Branded trigger
      const brandedTrigger = document.querySelector(`[data-image-index="7"]`)
      if (brandedTrigger) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: brandedTrigger,
            start: "top 45%",
            end: "bottom 30%",
            onEnter: () => setCurrentStep(2),
            onEnterBack: () => setCurrentStep(2),
            onLeaveBack: () => setCurrentStep(1),
            id: "branded-trigger",
          }),
        )
      }

      // Events trigger
      const eventsTrigger = document.querySelector(`[data-image-index="10"]`)
      if (eventsTrigger) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: eventsTrigger,
            start: "top 40%",
            onEnter: () => setCurrentStep(3),
            onEnterBack: () => setCurrentStep(3),
            onLeaveBack: () => setCurrentStep(2),
            id: "events-trigger",
          }),
        )
      }

      setTimeout(() => ScrollTrigger.refresh(), 200)

      return () => {
        pinTrigger.kill()
        imageTriggers.forEach((trigger) => {
          if (trigger && typeof trigger.kill === "function") {
            trigger.kill()
          }
        })
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <section className="relative bg-black text-white">
        {/* Header */}
        <div className="py-32 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our expertise across digital experiences, video production, and brand storytelling
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
          {/* Left Side - Static Text Content */}
          <div className="lg:sticky lg:top-0 h-screen flex items-start justify-center px-4 lg:px-6 pt-16">
            <LeftTextContent currentStep={0} />
          </div>

          {/* Right Side - Loading State */}
          <div className="px-6 lg:px-8">
            <div className="py-12 space-y-12">
              <div className="text-center text-gray-400">Loading portfolio...</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative bg-black text-white">
      {/* Header */}
      <div className="py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Our <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Portfolio</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Showcasing our expertise across digital experiences, video production, and brand storytelling
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
        {/* Left Side - Pinned Text Content */}
        <div
          ref={leftTextRef}
          className="lg:sticky lg:top-0 h-screen flex items-start justify-center px-4 lg:px-6 pt-16"
        >
          <LeftTextContent currentStep={currentStep} />
        </div>

        {/* Right Side - Scrolling Media */}
        <MediaGrid />
      </div>

      {/* Advanced Channel Management Section */}
      <ChannelManagementSection />
    </section>
  )
}

export default Portfolio
