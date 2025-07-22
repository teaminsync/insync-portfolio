"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import VideoPlayer from "./video-player"
import { useCursorContext } from "@/context/CursorContext" // Import useCursorContext

// Custom hook for cursor management
const useCustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Spring configuration for smooth interpolation
  const springConfig = { damping: 20, stiffness: 150 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top

    // Update cursor position relative to the container
    cursorX.set(relativeX - 40) // Offset by half cursor width (80px / 2)
    cursorY.set(relativeY - 40) // Offset by half cursor height (80px / 2)
  }

  return {
    isHovering,
    containerRef,
    x,
    y,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  }
}

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
      alt: "Save Farm",
      link: "https://savefarm.in",
      size: "large",
      sectionIndex: 0,
      horizontalPosition: "left",
    },
    {
      type: "image",
      src: "/images/impactpure.svg",
      alt: "IMPACTPURE",
      link: "https://impactpure.vercel.app",
      size: "large",
      sectionIndex: 0,
      horizontalPosition: "right",
    },
    {
      type: "image",
      src: "/images/elegant.svg",
      alt: "Elegant Atmos",
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

    // Branded section (3 videos: 7-9)
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

    // Events section (1 video: 10)
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
      return "w-[22rem] h-[13.4rem] sm:w-[30rem] sm:h-[18.3rem] lg:w-[34rem] lg:h-[21rem]";
    case "reel":
      return "w-[13.5rem] h-[24rem] sm:w-[18rem] sm:h-[32rem] lg:w-[22.5rem] lg:h-[40rem]";
    case "youtube":
      return "w-[21rem] h-[11.55rem] sm:w-[28rem] sm:h-[15.75rem] lg:w-[34rem] lg:h-[19.1rem]";
    default:
      return "w-[22rem] h-[13.4rem] sm:w-[30rem] sm:h-[18.3rem] lg:w-[34rem] lg:h-[21rem]";
  }
}

  const getHorizontalPosition = (position: string) => {
    switch (position) {
      case "left":
        return "justify-center md:justify-start"
      case "right":
        return "justify-center md:justify-end"
      case "center":
        return "justify-center"
      default:
        return "justify-center"
    }
  }

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

  const renderMediaContent = (media: any, index: number) => {
    if (media.type === "image") {
      return <img src={media.src || "/placeholder.svg"} alt={media.alt} className="w-full h-full object-cover" />
    }

    return <VideoPlayer media={media} index={index} />
  }

  // Individual MediaBlock component with custom cursor
  const MediaBlock = ({ media, index }: { media: any; index: number }) => {
    const { isHovering, containerRef, x, y, handleMouseEnter, handleMouseLeave, handleMouseMove } = useCustomCursor()
    const { setIsInteractiveElementHovered } = useCursorContext() // Use context

    // Effect to communicate hover state to global cursor context
    useEffect(() => {
      setIsInteractiveElementHovered(isHovering)
      // Cleanup on unmount or when isHovering changes
      return () => {
        setIsInteractiveElementHovered(false)
      }
    }, [isHovering, setIsInteractiveElementHovered])

    const handleCursorClick = () => {
      if (media.link && media.link !== "#") {
        window.open(media.link, "_blank", "noopener,noreferrer")
      }
    }

    const borderThickness = "1px" // Made thinner
    const cornerLength = "20%" // Length of the initial corner lines
    const padding = "12px" // Increased distance from the media content

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        viewport={{ once: true, margin: "-100px" }}
        className={`group flex ${getHorizontalPosition(media.horizontalPosition)}`}
        data-image-index={index}
      >
        <div
          ref={containerRef}
          className={`${getImageSize(media.size)} relative overflow-hidden ${
            isHovering ? "cursor-none" : "cursor-pointer"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onClick={handleCursorClick}
          style={{ padding: padding }} // Apply padding here
        >
          {/* Render Image or Video based on type */}
          {renderMediaContent(media, index)}

          {/* Corner Borders - positioned relative to the padded container */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-left corner */}
            <motion.div
              className="absolute top-0 left-0 bg-white"
              initial={{ width: cornerLength, height: borderThickness }}
              animate={{ width: isHovering ? "100%" : cornerLength, height: borderThickness }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />
            <motion.div
              className="absolute top-0 left-0 bg-white"
              initial={{ width: borderThickness, height: cornerLength }}
              animate={{ width: borderThickness, height: isHovering ? "100%" : cornerLength }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />

            {/* Top-right corner */}
            <motion.div
              className="absolute top-0 right-0 bg-white"
              initial={{ width: cornerLength, height: borderThickness }}
              animate={{ width: isHovering ? "100%" : cornerLength, height: borderThickness }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />
            <motion.div
              className="absolute top-0 right-0 bg-white"
              initial={{ width: borderThickness, height: cornerLength }}
              animate={{ width: borderThickness, height: isHovering ? "100%" : cornerLength }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />

            {/* Bottom-left corner */}
            <motion.div
              className="absolute bottom-0 left-0 bg-white"
              initial={{ width: cornerLength, height: borderThickness }}
              animate={{ width: isHovering ? "100%" : cornerLength, height: borderThickness }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />
            <motion.div
              className="absolute bottom-0 left-0 bg-white"
              initial={{ width: borderThickness, height: cornerLength }}
              animate={{ width: borderThickness, height: isHovering ? "100%" : cornerLength }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />

            {/* Bottom-right corner */}
            <motion.div
              className="absolute bottom-0 right-0 bg-white"
              initial={{ width: cornerLength, height: borderThickness }}
              animate={{ width: isHovering ? "100%" : cornerLength, height: borderThickness }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />
            <motion.div
              className="absolute bottom-0 right-0 bg-white"
              initial={{ width: borderThickness, height: cornerLength }}
              animate={{ width: borderThickness, height: isHovering ? "100%" : cornerLength }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // Slower transition
            />
          </div>

          {/* Custom Animated Cursor */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute w-[80px] h-[80px] bg-white rounded-full flex flex-col items-center justify-center text-black text-sm font-medium leading-tight pointer-events-none z-50"
                style={{
                  left: x,
                  top: y,
                }}
              >
                <span>View</span>
                <span>Project</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="py-12 space-y-12">
        {allMedia.map((media, index) => (
          <MediaBlock key={`media-${index}`} media={media} index={index} />
        ))}
      </div>
    </div>
  )
})

MediaGrid.displayName = "MediaGrid"

export default MediaGrid