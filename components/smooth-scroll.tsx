"use client"

import type React from "react"

import { useEffect } from "react"

interface SmoothScrollProps {
  children: React.ReactNode
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return <div>{children}</div>
}

export default SmoothScroll
