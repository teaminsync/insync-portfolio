"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion"

const ChannelManagementSection = () => {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null)
  const [isHoveringButton, setIsHoveringButton] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  // Cursor tracking with smooth interpolation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothX = useSpring(cursorX, { damping: 25, stiffness: 200 })
  const smoothY = useSpring(cursorY, { damping: 25, stiffness: 200 })

  // Add these motion values for tracking cursor within thumbnail
  const thumbnailCursorX = useMotionValue(0)
  const thumbnailCursorY = useMotionValue(0)
  const thumbnailSmoothX = useSpring(thumbnailCursorX, { damping: 20, stiffness: 150 })
  const thumbnailSmoothY = useSpring(thumbnailCursorY, { damping: 20, stiffness: 150 })

  const channels = [
    {
      name: "IIFA",
      url: "https://www.youtube.com/@iifa/featured",
      thumbnail: "/images/impactpure.svg",
      description: "International Indian Film Academy",
    },
    {
      name: "Crewcut",
      url: "https://www.youtube.com/@crewcut_",
      thumbnail: "/images/savefarm.svg",
      description: "Podcast by Jim Sarbh & guests",
    },
    {
      name: "Sreesanth Nair",
      url: "https://www.youtube.com/@sreesanthnair09",
      thumbnail: "/images/impactpure.svg",
      description: "Sreesanth Nair’s podcast hub",
    },
  ]

  // Same text variants as Services and Portfolio sections
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMounted) return
    cursorX.set(e.clientX - 160) // Half of thumbnail width (320px / 2)
    cursorY.set(e.clientY - 120) // Half of thumbnail height (240px / 2)
  }

  const handleThumbnailMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMounted) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top

    // Update cursor position relative to the thumbnail (offset by half button size)
    thumbnailCursorX.set(relativeX - 40) // Half of button width (80px / 2)
    thumbnailCursorY.set(relativeY - 40) // Half of button height (80px / 2)
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-32 mx-6 relative"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Section Header with same animation as other sections */}
      <div className="text-center mb-20">
        <motion.div ref={headerRef} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center">
          <motion.h3 custom={0} variants={textVariants} className="text-4xl md:text-5xl font-bold mb-6">
            CHANNEL MANAGEMENT & OPTIMIZATION
          </motion.h3>
          <motion.p custom={1} variants={textVariants} className="text-xl text-gray-300 max-w-2xl mx-auto">
            Content strategy and optimization for top YouTube channels
          </motion.p>
        </motion.div>
      </div>

      {/* Vertical Channel List */}
      <div className="max-w-4xl mx-auto space-y-12">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative group cursor-pointer"
            onMouseEnter={() => showThumbnail(channel.name)}
            onMouseLeave={hideThumbnail}
          >
            {/* Channel Name */}
            <div className="flex items-center justify-between py-8 px-6 border-b border-white/10 hover:border-white/30 transition-colors duration-500 relative z-20">
              <div>
                <h4 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none group-hover:text-white transition-all duration-500">
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
              className="relative w-80 h-60 rounded-2xl overflow-hidden shadow-2xl cursor-none"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                pointerEvents: "auto",
              }}
              onMouseMove={handleThumbnailMouseMove}
              onMouseEnter={handleButtonEnter}
              onMouseLeave={handleButtonLeave}
            >
              {/* Thumbnail Image */}
              <img
                src={channels.find((c) => c.name === hoveredChannel)?.thumbnail || "/placeholder.svg"}
                alt={`${hoveredChannel} thumbnail`}
                className="w-full h-full object-cover"
              />

              {/* Custom Animated Cursor Button - Following cursor within thumbnail */}
              <AnimatePresence>
                {channels.some((c) => c.name === hoveredChannel) && (
                  <motion.a
                    href={channels.find((c) => c.name === hoveredChannel)?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="absolute w-[80px] h-[80px] bg-white rounded-full flex flex-col items-center justify-center text-black text-sm font-medium leading-tight pointer-events-auto z-50"
                    style={{
                      left: thumbnailSmoothX,
                      top: thumbnailSmoothY,
                    }}
                  >
                    <span>View</span>
                    <span>Channel</span>
                  </motion.a>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default ChannelManagementSection
