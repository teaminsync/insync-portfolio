"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const VideoProduction = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

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

  // 4 services × 3 images each = 12 images total
  // 4th, 7th, 10th images trigger transitions (first image of next service)
  const allImages = [
    // Websites section (3 images: 1-3)
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Save Farm Website",
      link: "https://savefarm.in",
      size: "large",
      sectionIndex: 0,
    },
    {
      src: "/placeholder.svg?height=300&width=400",
      alt: "IMPACTPURE Platform",
      link: "https://impactpure.vercel.app",
      size: "medium",
      sectionIndex: 0,
    },
    {
      src: "/placeholder.svg?height=250&width=350",
      alt: "Portfolio Website",
      link: "#",
      size: "small",
      sectionIndex: 0,
    },

    // Video Production section (3 images: 4-6)
    // 4th image triggers transition to Video Production
    {
      src: "/placeholder.svg?height=500&width=700",
      alt: "Shantanu Rangnekar",
      link: "https://youtube.com",
      size: "large",
      sectionIndex: 1,
      isTrigger: true, // 4th image - triggers Video Production
      triggerName: "Video Production Trigger",
    },
    {
      src: "/placeholder.svg?height=280&width=380",
      alt: "MPI Educational Content",
      link: "https://drive.google.com",
      size: "medium",
      sectionIndex: 1,
    },
    {
      src: "/placeholder.svg?height=320&width=420",
      alt: "Domin8 Athleisure",
      link: "https://drive.google.com",
      size: "medium",
      sectionIndex: 1,
    },

    // Branded section (3 images: 7-9)
    // 7th image triggers transition to Branded
    {
      src: "/placeholder.svg?height=550&width=750",
      alt: "Vim India x Ritviz",
      link: "https://instagram.com",
      size: "large",
      sectionIndex: 2,
      isTrigger: true, // 7th image - triggers Branded
      triggerName: "Branded Trigger",
    },
    {
      src: "/placeholder.svg?height=300&width=350",
      alt: "Brand Campaign 2",
      link: "#",
      size: "small",
      sectionIndex: 2,
    },
    {
      src: "/placeholder.svg?height=350&width=450",
      alt: "Brand Campaign 3",
      link: "#",
      size: "medium",
      sectionIndex: 2,
    },

    // Events section (3 images: 10-12)
    // 10th image triggers transition to Events
    {
      src: "/placeholder.svg?height=500&width=650",
      alt: "Rukmini - Marathi Play",
      link: "https://instagram.com",
      size: "large",
      sectionIndex: 3,
      isTrigger: true, // 10th image - triggers Events
      triggerName: "Events Trigger",
    },
    {
      src: "/placeholder.svg?height=280&width=380",
      alt: "Corporate Event",
      link: "#",
      size: "medium",
      sectionIndex: 3,
    },
    {
      src: "/placeholder.svg?height=250&width=320",
      alt: "Wedding Coverage",
      link: "#",
      size: "small",
      sectionIndex: 3,
    },
  ]

  const getImageSize = (size: string) => {
    switch (size) {
      case "large":
        return "w-80 h-60 lg:w-96 lg:h-72"
      case "medium":
        return "w-64 h-48 lg:w-72 lg:h-54"
      case "small":
        return "w-48 h-36 lg:w-56 lg:h-42"
      default:
        return "w-64 h-48"
    }
  }

  useEffect(() => {
    if (!containerRef.current || !leftTextRef.current) return

    // Wait for DOM to be ready
    setTimeout(() => {
      const leftTextElement = leftTextRef.current
      const firstImage = document.querySelector(`[data-image-index="0"]`)
      const lastImage = document.querySelector(`[data-image-index="11"]`)

      if (!leftTextElement || !firstImage || !lastImage) return

      // Pin the left text during the entire image section
      const pinTrigger = ScrollTrigger.create({
        trigger: firstImage,
        start: "top 0%", // Start pinning when first image is 20% from top
        endTrigger: lastImage,
        end: "bottom 80%", // Stop pinning when last image is 80% from top
        pin: leftTextElement,
        pinSpacing: false, // Don't add spacing
        markers: true,
        id: "pin-left-text",
      })

      // Create individual triggers for content changes
      const imageTriggers = []

      // Default to Websites at start
      setCurrentStep(0)

      // Video Production trigger (Image 4)
      const image4 = document.querySelector(`[data-image-index="3"]`)
      if (image4) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: image4,
            start: "top 40%",
            end: "bottom 60%",
            onEnter: () => {
              console.log(`🎯 Image 4 ENTER → Video Production`)
              setCurrentStep(1) // Video Production
            },
            onEnterBack: () => {
              console.log(`🔄 Image 4 ENTER BACK → Video Production`)
              setCurrentStep(1) // Video Production
            },
            onLeaveBack: () => {
              console.log(`⬆️ Image 4 LEAVE BACK → Websites`)
              setCurrentStep(0) // Websites
            },
            markers: true,
            id: "image-4-video-trigger",
          }),
        )
      }

      // Branded trigger (Image 7)
      const image7 = document.querySelector(`[data-image-index="6"]`)
      if (image7) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: image7,
            start: "top 40%",
            end: "bottom 60%",
            onEnter: () => {
              console.log(`🎯 Image 7 ENTER → Branded`)
              setCurrentStep(2) // Branded
            },
            onEnterBack: () => {
              console.log(`🔄 Image 7 ENTER BACK → Branded`)
              setCurrentStep(2) // Branded
            },
            onLeaveBack: () => {
              console.log(`⬆️ Image 7 LEAVE BACK → Video Production`)
              setCurrentStep(1) // Video Production
            },
            markers: true,
            id: "image-7-branded-trigger",
          }),
        )
      }

      // Events trigger (Image 10) - stays Events until end
      const image10 = document.querySelector(`[data-image-index="9"]`)
      if (image10) {
        imageTriggers.push(
          ScrollTrigger.create({
            trigger: image10,
            start: "top 40%",
            // No end - stays Events until section ends
            onEnter: () => {
              console.log(`🎯 Image 10 ENTER → Events`)
              setCurrentStep(3) // Events
            },
            onEnterBack: () => {
              console.log(`🔄 Image 10 ENTER BACK → Events`)
              setCurrentStep(3) // Events
            },
            onLeaveBack: () => {
              console.log(`⬆️ Image 10 LEAVE BACK → Branded`)
              setCurrentStep(2) // Branded
            },
            markers: true,
            id: "image-10-events-trigger",
          }),
        )
      }

      return () => {
        // Proper cleanup
        pinTrigger.kill()
        imageTriggers.forEach((trigger) => trigger?.kill())
      }
    }, 100)
  }, [])

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

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left Side - Pinned Text Content */}
        <div ref={leftTextRef} className="lg:sticky lg:top-0 h-screen flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 1, y: 0 }} // NO entry animation - appears instantly
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: 0 }} // NO exit animation - stays visible
                transition={{
                  duration: 0, // Instant transition
                }}
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
        </div>

        {/* Right Side - Scrolling Images */}
        <div className="px-6 lg:px-8">
          <div className="py-12 space-y-12">
            {allImages.map((image, index) => {
              const isTriggerImage = image.isTrigger

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`group cursor-pointer ${
                    index % 2 === 0 ? "ml-0" : "ml-auto"
                  } ${index % 3 === 0 ? "lg:ml-16" : index % 3 === 1 ? "lg:ml-0" : "lg:ml-8"}`}
                  data-image-index={index}
                >
                  <div
                    className={`${getImageSize(image.size)} relative overflow-hidden bg-white/5 border border-white/10 mx-auto`}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Clean Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.a
                        href={image.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/90 text-black rounded-lg text-sm font-medium hover:bg-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </motion.a>
                    </div>

                    {/* Section Indicator for Trigger Images */}
                    {isTriggerImage && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-medium">
                        🎯 TRIGGER: {image.triggerName}
                      </div>
                    )}

                    {/* Image Position Indicator */}
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white">
                      #{index + 1} - {sections[image.sectionIndex].title}
                    </div>

                    {/* Debug: Show exact image index */}
                    <div className="absolute bottom-4 left-4 px-2 py-1 bg-yellow-500/80 backdrop-blur-sm rounded text-xs font-mono text-black">
                      Index: {index}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Channel Management Section - Remains Unchanged and Scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-20 mx-6 p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl border border-purple-500/20"
      >
        <h3 className="text-3xl font-bold mb-6 text-center">Channel Management & Optimization</h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {["IIFA", "Crewcut", "Sreesanth Nair"].map((channel, index) => (
            <motion.div
              key={channel}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="p-4 bg-white/5 rounded-2xl"
            >
              <h4 className="text-xl font-semibold mb-2">{channel}</h4>
              <p className="text-gray-400 text-sm">Production Management + Optimization</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default VideoProduction
