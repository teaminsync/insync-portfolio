"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Code, Video, PenTool, Megaphone } from "lucide-react"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const TravelingCardSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationPhase, setAnimationPhase] = useState<"traveling" | "scattered">("traveling")

  // Use scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"],
  })

  // ✅ PERFECT BALANCE - Cards travel further and land in center of Services
  const cardY = useTransform(scrollYProgress, [0, 0.45, 0.6], [1000, 0, 100]) // Travel further, slight pin below center
  const cardScale = useTransform(scrollYProgress, [0, 0.53, 0.53], [0.7, 1, 1]) // Reach full scale and maintain
  const cardRotate = useTransform(scrollYProgress, [0, 0.2], [8, 0]) // Stop rotating early
  const cardOpacity = useTransform(scrollYProgress, [0, 0.08, 0.6], [0, 1, 1]) // Stay visible longer

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description:
        "Fast, fluid, modern websites built with Next.js, React, and Tailwind CSS. Optimized for SEO, performance, and accessibility.",
      gradient: "from-blue-500 to-cyan-500",
      stackOffset: { x: -2, y: 2, rotate: 0.5 },
      scatterPosition: { x: -600, y: 0, rotate: -5 }, // Far left
    },
    {
      icon: PenTool,
      title: "Content Strategy",
      description:
        "Narratives that connect. We shape your messaging and visual content around audience behavior and platform best practices.",
      gradient: "from-purple-500 to-pink-500",
      stackOffset: { x: 2, y: -2, rotate: -0.5 },
      scatterPosition: { x: -300, y: 0, rotate: 3 }, // Left
    },
    {
      icon: Video,
      title: "Video Production",
      description: "From concept to final cut — cinematic storytelling crafted for creators, founders, and brands.",
      gradient: "from-green-500 to-teal-500",
      stackOffset: { x: -1, y: -2, rotate: 0.3 },
      scatterPosition: { x: 300, y: 0, rotate: -3 }, // Right
    },
    {
      icon: Megaphone,
      title: "Script & Branding",
      description:
        "Words that convert. Whether it's your landing page, ad, or brand voice, we script with clarity and impact.",
      gradient: "from-orange-500 to-red-500",
      stackOffset: { x: 1, y: 2, rotate: -0.3 },
      scatterPosition: { x: 600, y: 0, rotate: 5 }, // Far right
    },
  ]

  useEffect(() => {
    const triggerEl = document.querySelector("#scatter-trigger")
    if (!triggerEl) return

    const scatterTrigger = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top center+=120", // ✅ PERFECT SCATTER TIMING
      end: "bottom center",
      onEnter: () => {
        console.log("🎯 Scatter triggered!")
        setAnimationPhase("scattered")
      },
      onLeaveBack: () => {
        console.log("🔄 Back to traveling")
        setAnimationPhase("traveling")
      },
      markers: true,
    })

    setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      scatterTrigger.kill()
    }
  }, [])

  const mainCardVariants = {
    traveling: {
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    scattered: {
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const stackedCardVariants = {
    traveling: (custom: any) => ({
      scale: 0.99,
      opacity: 1,
      rotateX: 0.5,
      z: -2,
      x: custom.stackOffset.x,
      y: custom.stackOffset.y,
      rotate: custom.stackOffset.rotate,
      filter: "blur(0.2px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    scattered: (custom: any) => ({
      scale: 1,
      opacity: 1,
      rotateX: 0,
      z: 0,
      x: custom.scatterPosition.x,
      y: custom.scatterPosition.y,
      rotate: custom.scatterPosition.rotate,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: custom.delay || 0,
      },
    }),
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-30"
      style={{ height: "250vh" }} // ✅ MORE FLOATY FEEL - Increased from 200vh
    >
      {/* Traveling Card Container - ALL CARDS IN ONE CONTAINER */}
      <motion.div
        className="sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          y: cardY,
          scale: cardScale,
          rotate: cardRotate,
          opacity: cardOpacity,
        }}
      >
        {/* Single Container for ALL Cards with proper z-index stacking */}
        <div className="relative flex items-center justify-center">
          {/* Service Cards - Behind Main Card (z-index 1-4) */}
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={{
                stackOffset: service.stackOffset,
                scatterPosition: service.scatterPosition,
                delay: index * 0.08,
              }}
              variants={stackedCardVariants}
              animate={animationPhase}
              className={`absolute ${animationPhase === "traveling" ? "pointer-events-none" : "pointer-events-auto"}`}
              style={{
                zIndex: index + 1,
              }}
            >
              <motion.div
                animate={
                  animationPhase === "traveling"
                    ? {
                        y: [0, -0.5, 0],
                        rotate: [
                          service.stackOffset.rotate,
                          service.stackOffset.rotate + 0.2,
                          service.stackOffset.rotate,
                        ],
                      }
                    : {}
                }
                transition={
                  animationPhase === "traveling"
                    ? {
                        duration: 4 + index * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                whileHover={
                  animationPhase === "scattered"
                    ? {
                        scale: 1.05,
                        rotateY: 8,
                        z: 50,
                        transition: {
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      }
                    : {}
                }
                className="w-72 h-80 bg-gradient-to-br from-white/12 to-white/4 backdrop-blur-xl rounded-3xl border border-white/25 shadow-2xl p-8 cursor-pointer group"
                style={{
                  boxShadow:
                    animationPhase === "traveling"
                      ? "0 1px 2px -1px rgba(0, 0, 0, 0.03)"
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-3xl`}
                />

                <motion.div
                  whileHover={animationPhase === "scattered" ? { rotate: 360, scale: 1.1 } : {}}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 relative z-10`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: animationPhase === "scattered" ? 1 : 0.1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: animationPhase === "scattered" ? 0.3 : 0,
                    ease: "easeOut",
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors relative z-10">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-sm relative z-10">
                    {service.description}
                  </p>
                </motion.div>

                {animationPhase === "scattered" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
                  />
                )}

                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700`}
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Main Card - On Top (z-index 10) */}
          <motion.div
            variants={mainCardVariants}
            animate={animationPhase}
            className="relative pointer-events-auto"
            style={{ zIndex: 10 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              className="w-80 h-48 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl flex flex-col items-center justify-center text-center p-8"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              }}
            >
              <motion.p
                className="text-sm text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your vision, our craft — presenting
              </motion.p>
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                OUR SERVICES
              </motion.h2>
              <AnimatePresence>
                {animationPhase === "scattered" && (
                  <motion.p
                    className="text-xs text-gray-400 mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    Let's break them down.
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-purple-400 rounded-full"
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
            </motion.div>
          </motion.div>
        </div>

        {/* Travel Trail Effect */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: -1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-96 h-96 border border-blue-500/20 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Phase Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              animationPhase === "traveling" ? "bg-blue-500" : "bg-white/30"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              animationPhase === "scattered" ? "bg-blue-500" : "bg-white/30"
            }`}
          />
          <span className="text-xs text-gray-300 ml-2">
            {animationPhase === "traveling" ? "Cards traveling..." : "Services revealed!"}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default TravelingCardSystem
