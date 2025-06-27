"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Code, Video, PenTool, Megaphone, Sparkles } from "lucide-react"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description:
        "Fast, fluid, modern websites built with Next.js, React, and Tailwind CSS. Optimized for SEO, performance, and accessibility.",
      gradient: "from-blue-500 to-cyan-500",
      background: "#E5DAF6", // Soft lavender
    },
    {
      icon: PenTool,
      title: "Content Strategy",
      description:
        "Narratives that connect. We shape your messaging and visual content around audience behavior and platform best practices.",
      gradient: "from-purple-500 to-pink-500",
      background: "#FFD2F3", // Soft pink
    },
    {
      icon: Video,
      title: "Video Production",
      description: "From concept to final cut — cinematic storytelling crafted for creators, founders, and brands.",
      gradient: "from-green-500 to-teal-500",
      background: "#D0F0EC", // Soft mint
    },
    {
      icon: Megaphone,
      title: "Script & Branding",
      description:
        "Words that convert. Whether it's your landing page, ad, or brand voice, we script with clarity and impact.",
      gradient: "from-orange-500 to-red-500",
      background: "#F8D4C7", // Soft peach
    },
    {
      icon: Sparkles,
      title: "Our Services",
      description: "Your vision, our craft — presenting comprehensive digital solutions tailored to your needs.",
      gradient: "from-yellow-500 to-orange-500",
      background: "#FCDCA6", // Warm cream
      isMainCard: true,
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return

    const container = containerRef.current
    const cards = cardsRef.current
    const cardElements = cards.querySelectorAll(".service-card")

    // Calculate dimensions
    const cardWidth = 320 // w-80 = 320px
    const cardGap = 32 // gap-8 = 32px
    const containerWidth = window.innerWidth
    const totalCardsWidth = (cardWidth + cardGap) * services.length - cardGap

    // Initial position: First card at extreme right, others extend to the right
    const initialPosition = containerWidth - cardWidth - 40 // 40px padding from right edge

    // Final position: All cards visible, last card at left edge
    const finalPosition = -(totalCardsWidth - containerWidth + 40) // 40px padding from left edge

    // Set initial position
    gsap.set(cards, { x: initialPosition })

    // Phase 1: Early scroll trigger (25% visible) - No pinning
    const earlyTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 75%", // When 25% of section is visible
      end: "top top", // Until section reaches top
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        // Move cards 30% of total distance during early phase
        const earlyDistance = (finalPosition - initialPosition) * 0.3
        const currentX = initialPosition + earlyDistance * progress

        gsap.set(cards, {
          x: currentX,
          force3D: true,
        })
      },
    })

    // Phase 2: Main pinning trigger (top top) - With viewport lock
    const mainTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${Math.abs(finalPosition - initialPosition) * 3}`, // Extended scroll distance
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress

        // Start from where early trigger left off (30% of total distance)
        const earlyDistance = (finalPosition - initialPosition) * 0.3
        const startPosition = initialPosition + earlyDistance

        // Complete the remaining 70% of the movement
        const remainingDistance = finalPosition - startPosition
        const currentX = startPosition + remainingDistance * progress

        gsap.set(cards, {
          x: currentX,
          force3D: true,
        })

        // Animate individual cards based on their visibility
        cardElements.forEach((card, index) => {
          const cardPosition = currentX + index * (cardWidth + cardGap)
          const isFullyVisible = cardPosition >= 0 && cardPosition <= containerWidth - cardWidth
          const isPartiallyVisible = cardPosition > -cardWidth && cardPosition < containerWidth

          gsap.set(card, {
            opacity: isPartiallyVisible ? 1 : 0.3,
            scale: isFullyVisible ? 1 : 0.95,
            rotateY: isFullyVisible ? 0 : 5,
            force3D: true,
          })
        })
      },
    })

    // Refresh ScrollTrigger after setup
    setTimeout(() => ScrollTrigger.refresh(), 100)

    // Cleanup
    return () => {
      earlyTrigger.kill()
      mainTrigger.kill()
    }
  }, [])

  return (
    <section ref={containerRef} id="services" className="relative bg-[#F9F4EB] min-h-screen overflow-hidden">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-20 pb-10 bg-gradient-to-b from-[#F9F4EB] to-transparent">
        <div className="text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-black mb-4"
          >
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Comprehensive digital solutions crafted with precision and creativity
          </motion.p>
        </div>
      </div>

      {/* Horizontal Scrolling Cards Container */}
      <div className="h-screen flex items-center">
        <div ref={cardsRef} className="flex gap-8 absolute" style={{ width: "max-content" }}>
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="service-card w-80 h-96 backdrop-blur-xl rounded-3xl border border-white/25 shadow-2xl p-8 cursor-pointer group relative overflow-hidden flex-shrink-0"
              style={{
                backgroundColor: service.background,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 relative z-10`}
              >
                <service.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <div>
                <h3
                  className={`text-2xl font-bold mb-4 transition-colors relative z-10 ${
                    service.isMainCard ? "text-black" : "text-gray-800"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`leading-relaxed transition-colors text-sm relative z-10 ${
                    service.isMainCard ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  {service.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-2 h-2 bg-white/60 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Main Card Special Styling */}
              {service.isMainCard && (
                <motion.div
                  className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              )}

              {/* Card Index Indicator */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20">
        <motion.div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">Scroll to reveal all services</span>
          <div className="flex gap-1">
            {services.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.05),transparent_50%)]" />

      {/* Decorative floating elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-20 right-10 w-64 h-64 border border-blue-500/10 rounded-full"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-48 h-48 border border-purple-500/10 rounded-full"
      />
    </section>
  )
}

export default Services
