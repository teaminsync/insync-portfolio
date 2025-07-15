"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

const HeroAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const particles: Particle[] = []
  const numParticles = 80 // Increased particles for more connections
  const connectionDistance = 150 // Max distance for lines
  const particleRadius = 1.5 // Smaller particles
  const particleSpeed = 0.2 // Slower, more subtle movement

  const initParticles = useCallback(
    (width: number, height: number) => {
      particles.length = 0 // Clear existing particles
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: particleRadius,
          color: "rgba(0, 0, 0, 0.8)", // Darker particles for light background
        })
      }
    },
    [particles],
  ) // Dependency array for useCallback

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Update position
      p.x += p.vx
      p.y += p.vy

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()

      // Draw lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.4 - (distance / connectionDistance) * 0.4})` // Fades out with distance
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }, [particles]) // Dependency array for useCallback

  useEffect(() => {
    setIsMounted(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height) // Re-initialize particles on resize
    }

    setCanvasDimensions() // Initial setup
    window.addEventListener("resize", setCanvasDimensions)

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [animate, initParticles])

  if (!isMounted) {
    return null // Render nothing on the server
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0" // Position behind content
      aria-hidden="true" // Hide from accessibility tree
    />
  )
}

export default HeroAnimation
