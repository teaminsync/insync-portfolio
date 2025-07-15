"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useCursorContext } from "@/context/CursorContext" // Import useCursorContext

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLocalHovering, setIsLocalHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const { isInteractiveElementHovered } = useCursorContext() // Use context

  useEffect(() => {
    setIsMounted(true)

    // Detect touch device
    const checkTouchDevice = () => {
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true)
      } else {
        setIsTouchDevice(false)
      }
    }

    checkTouchDevice() // Initial check
    window.addEventListener("resize", checkTouchDevice) // Re-check on resize

    return () => {
      window.removeEventListener("resize", checkTouchDevice)
    }
  }, [])

  useEffect(() => {
    if (!isMounted || isTouchDevice) return // Don't add listeners if it's a touch device

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Only manage local hover state for generic elements
    const handleMouseEnter = () => setIsLocalHovering(true)
    const handleMouseLeave = () => setIsLocalHovering(false)

    // Select all interactive elements that should trigger the local hover state
    // Exclude elements that are handled by the CursorContext (e.g., media grid items)
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]:not([data-cursor-managed])')

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    window.addEventListener("mousemove", updateMousePosition)

    // Manage body class for cursor hiding
    document.body.classList.add("custom-cursor-active")

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
      document.body.classList.remove("custom-cursor-active")
    }
  }, [isMounted, isTouchDevice]) // Re-run effect if isTouchDevice changes

  // If not mounted or is a touch device, don't render the cursor at all
  if (!isMounted || isTouchDevice) {
    return null
  }

  // Determine the overall visibility and scale based on local hover and global interactive element hover
  const shouldBeHidden = isInteractiveElementHovered
  const currentScale = isLocalHovering ? 1.5 : 1
  const trailingScale = isLocalHovering ? 2 : 1

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-40 mix-blend-difference" // Lower z-index than local cursor (z-50)
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: shouldBeHidden ? 0 : currentScale, // Scale to 0 when hidden
          opacity: shouldBeHidden ? 0 : 1, // Fade out when hidden
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          // Add duration for opacity and scale to make it smooth
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
      />

      {/* Trailing cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-30" // Lower z-index
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: shouldBeHidden ? 0 : trailingScale, // Scale to 0 when hidden
          opacity: shouldBeHidden ? 0 : 1, // Fade out when hidden
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          // Add duration for opacity and scale to make it smooth
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
      />
    </>
  )
}

export default CustomCursor
