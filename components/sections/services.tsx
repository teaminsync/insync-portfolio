"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroAnimation from "@/components/hero-animation" // Import the HeroAnimation component

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ServicesProps {
  isTouchDevice: boolean // Prop to indicate if the device is touch-enabled
}

const Services = ({ isTouchDevice }: ServicesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isHeaderInView, setIsHeaderInView] = useState(false)

  const services = [
    {
      title: "WEBSITE DEVELOPMENT",
      background: "#E5DAF6", // Soft lavender
      logo: "/images/webdev.svg",
      description:
        "We build modern, responsive websites using Next.js, React, and Tailwind CSS. Optimized for SEO, performance, and brand impact.",
    },
    {
      title: "CONTENT STRATEGY",
      background: "#FFD2F3", // Soft pink
      logo: "/images/content.svg",
      description:
        "We shape your messaging and visuals around audience behavior and platform trends to create content that connects and performs.",
    },
    {
      title: "VIDEO PRODUCTION",
      background: "#D0F0EC", // Soft mint
      logo: "/images/video.svg",
      description:
        "End-to-end video production from concept to final edit, delivering cinematic, story-driven content for brands and creators.",
    },
    {
      title: "SCRIPT & COPYWRITING",
      background: "#F8D4C7", // Soft peach
      logo: "/images/script.svg",
      description:
        "Clear, persuasive copy tailored for websites, ads, and brand campaigns. Written to engage and convert.",
    },
    {
      title: "PERSONAL BRANDING",
      background: "#FCDCA6", // Warm cream
      logo: "/images/branding.svg",
      description:
        "Helping founders and creators define their digital identity through strategy-led design, content, and visibility.",
    },
  ]

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    setIsHeaderInView(isInView)
  }, [isInView])

  // Check for mobile/tablet on mount and resize
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
    }

    updateDeviceType()
    window.addEventListener("resize", updateDeviceType)
    return () => window.removeEventListener("resize", updateDeviceType)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current || isMobile) return

    const container = containerRef.current
    const cards = cardsRef.current

    // Responsive card dimensions
    const getCardDimensions = () => {
      const screenWidth = window.innerWidth
      if (screenWidth >= 1024) {
        return { cardWidth: 320, cardGap: 32 } // Desktop
      } else if (screenWidth >= 768) {
        return { cardWidth: 280, cardGap: 24 } // Tablet
      } else {
        return { cardWidth: 240, cardGap: 16 } // Mobile (fallback)
      }
    }

    const { cardWidth, cardGap } = getCardDimensions()
    const containerWidth = window.innerWidth
    const totalCardsWidth = (cardWidth + cardGap) * services.length - cardGap

    // Responsive padding
    const padding = containerWidth >= 1024 ? 40 : containerWidth >= 768 ? 24 : 16

    // Initial position: First card at extreme right, others extend to the right
    const initialPosition = containerWidth - cardWidth - padding

    // Final position: All cards visible, last card at left edge
    const finalPosition = -(totalCardsWidth - containerWidth + padding)

    // Set initial position
    gsap.set(cards, { x: initialPosition })

    let earlyTrigger: ScrollTrigger | null = null
    let mainTrigger: ScrollTrigger | null = null

    // Determine the early distance for the main trigger's calculation
    // This will be different for tablets vs desktop
    const earlyDistanceForMainTrigger = isTablet
      ? (finalPosition - initialPosition) * 0.5 // Tablets: 50% of total distance in early phase
      : (finalPosition - initialPosition) * 0.3 // Desktop: 30% of total distance in early phase

    // Adjust initial position for tablets to start further behind
    const adjustedInitialPosition = isTablet
      ? containerWidth + cardWidth * 1.5 
      : initialPosition // Desktop: Use the original position

    // Set initial position with the adjusted value
    gsap.set(cards, { x: adjustedInitialPosition })

    // Create earlyTrigger for both desktop AND tablet (but with different behaviors)
    earlyTrigger = ScrollTrigger.create({
      trigger: container,
      start: isTablet ? "top 85%" : "top 75%", // Tablets start trigger slightly later
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const currentX = adjustedInitialPosition + earlyDistanceForMainTrigger * progress
        gsap.set(cards, {
          x: currentX,
          force3D: true,
        })
      },
    })

    mainTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top", // Main trigger always starts when section hits top
      end: `+=${Math.abs(finalPosition - adjustedInitialPosition) * 3}`, // Use adjustedInitialPosition
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress
        // Calculate the actual start position for the main animation based on early phase
        const calculatedStartPosition = adjustedInitialPosition + earlyDistanceForMainTrigger
        const remainingDistance = finalPosition - calculatedStartPosition
        const currentX = calculatedStartPosition + remainingDistance * progress

        gsap.set(cards, {
          x: currentX,
          force3D: true,
        })
      },
    })

    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)

    setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      if (earlyTrigger) earlyTrigger.kill() // Always kill since we now create it for both tablet and desktop
      if (mainTrigger) mainTrigger.kill()
      window.removeEventListener("resize", handleResize)
    }
  }, [isMobile, isTablet, services.length]) // Dependencies remain the same

  // Individual card component with responsive interactions
  const ServiceCard = ({
    service,
    index,
    isMobile,
    isTouchDevice,
  }: {
    service: any
    index: number
    isMobile: boolean
    isTouchDevice: boolean
  }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    // Responsive card dimensions
    const cardDimensions = {
      width: isMobile ? "280px" : "320px",
      height: isMobile ? "350px" : "400px",
    }

    // Handle interaction based on device type
    const handleInteraction = () => {
      // If it's a touch device (mobile, tablet, or desktop touchscreen), allow tap to flip
      if (isTouchDevice) {
        setIsFlipped(!isFlipped)
      }
    }

    const handleMouseEnter = () => {
      // If it's NOT a touch device (traditional desktop/laptop), allow hover to flip
      if (!isTouchDevice) {
        setIsFlipped(true)
      }
    }

    const handleMouseLeave = () => {
      // If it's NOT a touch device, allow hover to unflip
      if (!isTouchDevice) {
        setIsFlipped(false)
      }
    }

    return (
      <div
        className="service-card flex-shrink-0"
        style={{
          perspective: "1200px",
          width: cardDimensions.width,
          height: cardDimensions.height,
        }}
        onClick={handleInteraction}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: isFlipped ? 1.02 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "tween",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl shadow-lg"
            style={{
              backgroundColor: service.background,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top Strip - Responsive spacing */}
            <div className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 flex items-center justify-between">
              <h3 className="text-[0.5rem] md:text-[0.625rem] font-medium text-black leading-tight max-w-[140px] md:max-w-[180px]">
                {service.title}
              </h3>
              <img
                src={service.logo || "/placeholder.svg"}
                alt={service.title}
                className="w-2.5 h-2.5 md:w-3 h-3 object-contain"
              />
            </div>

            {/* Bottom Strip - Responsive spacing */}
            <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-end justify-between">
              <div className="flex items-center gap-4">
                {/* Service logo */}
                <img
                  src={service.logo || "/placeholder.svg"}
                  alt={service.title}
                  className="w-2.5 h-2.5 md:w-3 h-3 object-contain"
                />
                <span className="text-[0.25rem] md:text-[0.35rem] font-medium text-black tracking-tight leading-none">
                  BIZ - {101 + index}
                </span>
                {/* Placeholder for your InSync logo */}
                <img
                  src="images/logo.svg" // Use a small placeholder for your logo
                  alt="InSync Logo"
                  className="w-2.5 h-2.5 md:w-3 h-3 object-contain" // Adjust size as needed
                />
              </div>

              <h3
                className="text-[0.5rem] md:text-[0.625rem] font-medium text-black leading-tight max-w-[140px] md:max-w-[180px] text-right"
                style={{ transform: "rotate(180deg)" }}
              >
                {service.title}
              </h3>
            </div>

            {/* Center - Responsive logo size */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={service.logo || "/placeholder.svg"}
                alt={service.title}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg flex flex-col justify-between"
            style={{
              backgroundColor: service.background,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top Section */}
            <div>
              {/* Service Number */}
              <div className="mb-6 md:mb-8">
                <span className="text-black/60 text-sm md:text-base font-medium">
                  ({String(index + 1).padStart(2, "0")})
                </span>
              </div>

              {/* Service Title */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-black leading-tight text-left">{service.title}</h3>
              </div>
            </div>

            {/* Bottom Section - Description */}
            <div className="text-left">
              <p className="text-black/80 text-sm md:text-base leading-relaxed">{service.description}</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Define textVariants like in hero section
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

  // Mobile layout - vertical stack
  if (isMobile) {
    return (
      <section id="services" className="relative py-16">
        {/* Hero Animation Background */}
        <HeroAnimation />
        {/* Header */}
        <div className="text-center px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-black mb-4"
          >
            OUR SERVICES
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Comprehensive digital solutions crafted with precision and creativity
          </motion.p>
        </div>

        {/* Mobile Instruction - Centered between header and cards */}
        <div className="text-center px-6 mb-8 mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-xs"
          >
            <span>[Tap on cards to view service details]</span>
          </motion.div>
        </div>

        {/* Mobile Cards - Vertical Stack - Properly Centered */}
        <div className="px-6 space-y-6 relative z-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <ServiceCard service={service} index={index} isMobile={isMobile} isTouchDevice={isTouchDevice} />
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  // Desktop/Tablet layout - horizontal scroll
  return (
    <section ref={containerRef} id="services" className="relative min-h-screen sticky top-0 z-10">
      {/* Hero Animation Background */}
      <HeroAnimation />
      {/* Header Section */}
      <div className="relative z-10 pt-16 pb-4 md:pt-20 md:pb-6">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center px-6"
        >
          <motion.h2
            custom={0}
            variants={textVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
          >
            OUR SERVICES
          </motion.h2>
          <motion.p custom={1} variants={textVariants} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive digital solutions crafted with precision and creativity
          </motion.p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Cards Container */}
      <div className="relative z-10" style={{ height: "calc(100vh - 140px)" }}>
        <div className="h-full flex items-start justify-center pt-4 md:pt-8">
          <div
            ref={cardsRef}
            className="flex gap-4 md:gap-6 lg:gap-8 absolute"
            style={{
              width: "max-content",
              height: "450px",
              marginRight: isTablet ? "100px" : "400px",
            }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                isMobile={isMobile}
                isTouchDevice={isTouchDevice}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Instructions - Better middle ground positioning */}
      <div className="absolute bottom-14 md:bottom-24 left-1/2 transform -translate-x-1/2 text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gray-600"
        >
          <span className="text-xs md:text-sm">
            {isTouchDevice ? "[Tap on cards to view details]" : "[Hover on cards to view details]"}
          </span>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
