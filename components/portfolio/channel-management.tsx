"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion"
import { useCursorContext } from "@/context/CursorContext" // Import useCursorContext

const ChannelManagementSection = () => {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const hideGlobalCursorTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Renamed for clarity

  const { setIsInteractiveElementHovered } = useCursorContext() // Get the context setter

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  // Motion values for tracking cursor within the hovered channel item
  const channelItemCursorX = useMotionValue(0)
  const channelItemCursorY = useMotionValue(0)
  const smoothChannelItemCursorX = useSpring(channelItemCursorX, { damping: 20, stiffness: 150 })
  const smoothChannelItemCursorY = useSpring(channelItemCursorY, { damping: 20, stiffness: 150 })

  const channels = [
    {
      name: "IIFA",
      url: "https://www.youtube.com/@iifa/featured",
      thumbnail: "/images/iifa.svg",
      description: "International Indian Film Academy",
    },
    {
      name: "Crewcut",
      url: "https://www.youtube.com/@crewcut_",
      thumbnail: "/images/crew.svg",
      description: "Podcast by Jim Sarbh & guests",
    },
    {
      name: "Sreesanth Nair",
      url: "https://www.youtube.com/@sreesanthnair09",
      thumbnail: "/images/shree.svg",
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

  const handleChannelMouseEnter = (channelName: string) => {
    if (!isMounted) return
    // Clear any pending hide timeout for global cursor
    if (hideGlobalCursorTimeoutRef.current) {
      clearTimeout(hideGlobalCursorTimeoutRef.current)
      hideGlobalCursorTimeoutRef.current = null
    }
    setHoveredChannel(channelName)
    setIsInteractiveElementHovered(true) // Signal global cursor to hide
  }

  const handleChannelMouseLeave = () => {
    if (!isMounted) return
    setHoveredChannel(null) // Immediately hide the thumbnail and local cursor
    // Start a timeout to show global cursor after a brief delay
    hideGlobalCursorTimeoutRef.current = setTimeout(() => {
      setIsInteractiveElementHovered(false) // Signal global cursor to show
      hideGlobalCursorTimeoutRef.current = null
    }, 150) // Small delay to allow for quick re-entry
  }

  const handleChannelItemMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMounted) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top

    // Update cursor position relative to the channel item (offset by half button size)
    channelItemCursorX.set(relativeX - 40) // Half of button width (80px / 2)
    channelItemCursorY.set(relativeY - 40) // Half of button height (80px / 2)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideGlobalCursorTimeoutRef.current) {
        clearTimeout(hideGlobalCursorTimeoutRef.current)
      }
      setIsInteractiveElementHovered(false) // Ensure global cursor is visible on unmount
    }
  }, [setIsInteractiveElementHovered])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-32 mx-6 relative"
    // Removed onMouseMove from section, as it's now per-item
    >
      {/* Section Header with same animation as other sections */}
      <div className="text-center mb-20">
        <motion.div ref={headerRef} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center">
          <motion.h3 custom={0} variants={textVariants} className="text-4xl md:text-5xl font-bold mb-6">
            CHANNEL MANAGEMENT & OPTIMIZATION
          </motion.h3>
          <motion.p custom={1} variants={textVariants} className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
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
            className="relative group cursor-pointer overflow-hidden" // Added rounded-xl and overflow-hidden
            onMouseEnter={() => handleChannelMouseEnter(channel.name)}
            onMouseLeave={handleChannelMouseLeave}
            onMouseMove={handleChannelItemMouseMove} // Attach mouse move listener here
          >
            {/* Background Thumbnail */}
            <AnimatePresence>
              {hoveredChannel === channel.name && (
                <>
                  <motion.img
                    key="thumbnail-bg"
                    src={channel.thumbnail}
                    alt={`${channel.name} thumbnail`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover z-0" // z-0 to be behind text
                  />
                  {/* Overlay for readability */}
                  <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black/50 z-[1]" // Semi-transparent black overlay
                  />
                </>
              )}
            </AnimatePresence>

            {/* Text Content (Name, Description, Arrow) */}
            <div className="relative z-10 flex items-center justify-between py-8 px-6 group-hover: transition-colors duration-500">
              <div>
                <h4 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none group-hover:text-white transition-all duration-500">
                  {channel.name}
                </h4>
                <p className="text-base md:text-lg text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                  {channel.description}
                </p>
              </div>
            </div>

            {/* Custom Animated Cursor Button */}
            <AnimatePresence>
              {hoveredChannel === channel.name && (
                <motion.a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute w-[80px] h-[80px] bg-white rounded-full flex flex-col items-center justify-center text-black text-sm font-medium leading-tight pointer-events-auto z-50"
                  style={{
                    left: smoothChannelItemCursorX, // Use the same motion values
                    top: smoothChannelItemCursorY,
                  }}
                >
                  <span>View</span>
                  <span>Channel</span>
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default ChannelManagementSection