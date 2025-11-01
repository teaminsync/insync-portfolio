"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion"
import { useCursorContext } from "@/context/CursorContext"
import { getImageUrl } from "@/lib/cloudinary"
import { trackEvent } from "@/lib/fbpixel"

const ChannelManagementSection = () => {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const hideGlobalCursorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { setIsInteractiveElementHovered } = useCursorContext()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  const channelItemCursorX = useMotionValue(0)
  const channelItemCursorY = useMotionValue(0)
  const smoothChannelItemCursorX = useSpring(channelItemCursorX, { damping: 20, stiffness: 150 })
  const smoothChannelItemCursorY = useSpring(channelItemCursorY, { damping: 20, stiffness: 150 })

  const channels = [
    {
      name: "IIFA",
      url: "https://www.youtube.com/@iifa/featured",
      thumbnail: getImageUrl("iifa_gwhrfx"),
      description: "International Indian Film Academy",
    },
    {
      name: "Crewcut",
      url: "https://www.youtube.com/@crewcut_",
      thumbnail: getImageUrl("crew_f9reuc"),
      description: "Podcast by Jim Sarbh & guests",
    },
    {
      name: "Sreesanth Nair",
      url: "https://www.youtube.com/@sreesanthnair09",
      thumbnail: getImageUrl("shree_hd6o0e"),
      description: "Sreesanth Nair's podcast hub",
    },
  ]

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
    if (hideGlobalCursorTimeoutRef.current) {
      clearTimeout(hideGlobalCursorTimeoutRef.current)
      hideGlobalCursorTimeoutRef.current = null
    }
    setHoveredChannel(channelName)
    setIsInteractiveElementHovered(true)
  }

  const handleChannelMouseLeave = () => {
    if (!isMounted) return
    setHoveredChannel(null)
    hideGlobalCursorTimeoutRef.current = setTimeout(() => {
      setIsInteractiveElementHovered(false)
      hideGlobalCursorTimeoutRef.current = null
    }, 150)
  }

  const handleChannelItemMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMounted) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top

    channelItemCursorX.set(relativeX - 40)
    channelItemCursorY.set(relativeY - 40)
  }

  const handleChannelClick = (channelName: string) => {
    trackEvent("Channel_Click", {
      channel_name: channelName,
    })
  }

  useEffect(() => {
    return () => {
      if (hideGlobalCursorTimeoutRef.current) {
        clearTimeout(hideGlobalCursorTimeoutRef.current)
      }
      setIsInteractiveElementHovered(false)
    }
  }, [setIsInteractiveElementHovered])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-32 mx-6 relative"
    >
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

      <div className="max-w-4xl mx-auto space-y-12">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative group cursor-pointer overflow-hidden"
            onMouseEnter={() => handleChannelMouseEnter(channel.name)}
            onMouseLeave={handleChannelMouseLeave}
            onMouseMove={handleChannelItemMouseMove}
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
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  {/* Overlay for readability */}
                  <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black/50 z-[1]"
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
                  onClick={() => handleChannelClick(channel.name)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute w-[80px] h-[80px] bg-white rounded-full flex flex-col items-center justify-center text-black text-sm font-medium leading-tight pointer-events-auto z-50"
                  style={{
                    left: smoothChannelItemCursorX,
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
