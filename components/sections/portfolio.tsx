"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import LeftTextContent from "@/components/portfolio/left-text-content"
import MediaGrid from "@/components/portfolio/media-grid"
import ChannelManagementSection from "@/components/portfolio/channel-management"
import { getImageUrl } from "@/lib/cloudinary"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Define the full set of decorative elements outside the component
const portfolioDecorativeElementsData = [
  {
    col: 0, // Original column index
    items: [
      { top: "2%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "12%", size: 36, src: "elmnt4_l95xm1" },
      { top: "22%", size: 32, src: "elmnt2_spftr7" },
      { top: "32%", size: 36, src: "elmnt6_thgphw" },
      { top: "42%", size: 28, src: "elmnt3_bgkljv" },
      { top: "52%", size: 36, src: "elmnt5_mernov" },
      { top: "62%", size: 32, src: "elmnt1_q2gbvh" },
      { top: "72%", size: 36, src: "elmnt4_l95xm1" },
      { top: "82%", size: 36, src: "elmnt2_spftr7" },
      { top: "92%", size: 36, src: "elmnt6_thgphw" },
    ],
  },
  {
    col: 1,
    items: [
      { top: "7%", size: 32, src: "elmnt3_bgkljv" },
      { top: "17%", size: 36, src: "elmnt5_mernov" },
      { top: "27%", size: 28, src: "elmnt1_q2gbvh" },
      { top: "37%", size: 36, src: "elmnt4_l95xm1" },
      { top: "47%", size: 36, src: "elmnt2_spftr7" },
      { top: "57%", size: 32, src: "elmnt6_thgphw" },
      { top: "67%", size: 28, src: "elmnt3_bgkljv" },
      { top: "77%", size: 36, src: "elmnt5_mernov" },
      { top: "87%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "97%", size: 36, src: "elmnt4_l95xm1" },
    ],
  },
  {
    col: 2,
    items: [
      { top: "4%", size: 36, src: "elmnt6_thgphw" },
      { top: "14%", size: 32, src: "elmnt2_spftr7" },
      { top: "24%", size: 28, src: "elmnt5_mernov" },
      { top: "34%", size: 36, src: "elmnt3_bgkljv" },
      { top: "44%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "54%", size: 36, src: "elmnt4_l95xm1" },
      { top: "64%", size: 36, src: "elmnt6_thgphw" },
      { top: "74%", size: 32, src: "elmnt2_spftr7" },
      { top: "84%", size: 36, src: "elmnt5_mernov" },
      { top: "94%", size: 28, src: "elmnt2_spftr7" },
    ],
  },
  {
    col: 3,
    items: [
      { top: "1%", size: 36, src: "elmnt4_l95xm1" },
      { top: "11%", size: 28, src: "elmnt1_q2gbvh" },
      { top: "21%", size: 36, src: "elmnt6_thgphw" },
      { top: "31%", size: 32, src: "elmnt3_bgkljv" },
      { top: "41%", size: 36, src: "elmnt5_mernov" },
      { top: "51%", size: 28, src: "elmnt2_spftr7" },
      { top: "61%", size: 36, src: "elmnt4_l95xm1" },
      { top: "71%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "81%", size: 32, src: "elmnt6_thgphw" },
      { top: "91%", size: 28, src: "elmnt3_bgkljv" },
    ],
  },
  {
    col: 4,
    items: [
      { top: "6%", size: 32, src: "elmnt2_spftr7" },
      { top: "16%", size: 36, src: "elmnt4_l95xm1" },
      { top: "26%", size: 36, src: "elmnt3_bgkljv" },
      { top: "36%", size: 28, src: "elmnt1_q2gbvh" },
      { top: "46%", size: 36, src: "elmnt6_thgphw" },
      { top: "56%", size: 32, src: "elmnt3_bgkljv" },
      { top: "66%", size: 36, src: "elmnt2_spftr7" },
      { top: "76%", size: 36, src: "elmnt4_l95xm1" },
      { top: "86%", size: 36, src: "elmnt6_thgphw" },
      { top: "96%", size: 36, src: "elmnt1_q2gbvh" },
    ],
  },
  {
    col: 5,
    items: [
      { top: "3%", size: 36, src: "elmnt5_mernov" },
      { top: "13%", size: 32, src: "elmnt3_bgkljv" },
      { top: "23%", size: 36, src: "elmnt4_l95xm1" },
      { top: "33%", size: 28, src: "elmnt5_mernov" },
      { top: "43%", size: 36, src: "elmnt4_l95xm1" },
      { top: "53%", size: 36, src: "elmnt2_spftr7" },
      { top: "63%", size: 32, src: "elmnt5_mernov" },
      { top: "73%", size: 28, src: "elmnt3_bgkljv" },
      { top: "83%", size: 36, src: "elmnt5_mernov" },
      { top: "93%", size: 36, src: "elmnt5_mernov" },
    ],
  },
  {
    col: 6,
    items: [
      { top: "8%", size: 36, src: "elmnt2_spftr7" },
      { top: "18%", size: 36, src: "elmnt3_bgkljv" },
      { top: "28%", size: 36, src: "elmnt4_l95xm1" },
      { top: "38%", size: 28, src: "elmnt2_spftr7" },
      { top: "48%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "58%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "68%", size: 36, src: "elmnt4_l95xm1" },
      { top: "78%", size: 32, src: "elmnt3_bgkljv" },
      { top: "88%", size: 36, src: "elmnt4_l95xm1" },
      { top: "98%", size: 36, src: "elmnt3_bgkljv" },
    ],
  },
]

// Define which column indices to show for each number of active columns
const portfolioColumnIndicesToShow = {
  3: [0, 1, 2],
  5: [0, 1, 2, 3, 4], // For 5 columns, show first, second, middle, second-to-last, last
  7: [0, 1, 2, 3, 4, 5, 6], // For 7 columns, show all
}

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(false) // Controls layout (vertical stack vs. two-column)
  const [shouldApplyLayeredTransition, setShouldApplyLayeredTransition] = useState(false) // Controls -mt-[100vh]
  const [activeColumns, setActiveColumns] = useState(7) // Default for desktop decorative elements

  // Check for screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // Layout switch: vertical stack for screens < 1024px (mobile & tablet)
      setIsMobileLayout(window.innerWidth < 1024)
      // Layered transition: apply for screens >= 768px (tablet & desktop)
      setShouldApplyLayeredTransition(window.innerWidth >= 768)

      // Update activeColumns for decorative elements
      const width = window.innerWidth
      if (width < 640) {
        // Tailwind's 'sm' breakpoint
        setActiveColumns(3)
      } else if (width < 1024) {
        // Tailwind's 'lg' breakpoint
        setActiveColumns(5)
      } else {
        setActiveColumns(7)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  // GSAP ScrollTrigger logic for desktop and tablet (where layered transition applies)
  useEffect(() => {
    const leftTextElement = document.getElementById("portfolio-left-text")
    let pinTrigger: ScrollTrigger | null = null
    const imageTriggers: ScrollTrigger[] = []

    // Cleanup function to kill all triggers and clear GSAP styles
    const cleanupTriggers = () => {
      if (pinTrigger) pinTrigger.kill()
      imageTriggers.forEach((trigger) => {
        if (trigger && typeof trigger.kill === "function") {
          trigger.kill()
        }
      })
      // Clear any inline styles applied by GSAP pinning
      if (leftTextElement) gsap.set(leftTextElement, { clearProps: "all" })
    }

    if (!isMounted) return cleanupTriggers() // Ensure cleanup on unmount or initial render if not mounted

    // Only apply pinning and ScrollTrigger effects if the layered transition is active
    if (shouldApplyLayeredTransition && !isMobileLayout) {
      // Only for desktop layout with pinning
      const timeoutId = setTimeout(() => {
        const firstImage = document.querySelector(`[data-image-index="0"]`)
        const lastImage = document.querySelector(`[data-image-index="10"]`)

        if (!leftTextElement || !firstImage || !lastImage) return

        // Pin the left text during the entire image section
        pinTrigger = ScrollTrigger.create({
          trigger: firstImage,
          start: "top 20%",
          endTrigger: lastImage,
          end: "bottom 80%",
          pin: leftTextElement,
          pinSpacing: false,
          id: "pin-left-text",
        })

        // Create individual triggers for content changes
        setCurrentStep(0) // Default to Websites at start

        const videoProductionTrigger = document.querySelector(`[data-image-index="3"]`)
        if (videoProductionTrigger) {
          imageTriggers.push(
            ScrollTrigger.create({
              trigger: videoProductionTrigger,
              start: "top 40%",
              end: "bottom 40%",
              onEnter: () => setCurrentStep(1),
              onEnterBack: () => setCurrentStep(1),
              onLeaveBack: () => setCurrentStep(0),
              id: "video-production-trigger",
            }),
          )
        }

        const brandedTrigger = document.querySelector(`[data-image-index="7"]`)
        if (brandedTrigger) {
          imageTriggers.push(
            ScrollTrigger.create({
              trigger: brandedTrigger,
              start: "top 45%",
              end: "bottom 30%",
              onEnter: () => setCurrentStep(2),
              onEnterBack: () => setCurrentStep(2),
              onLeaveBack: () => setCurrentStep(1),
              id: "branded-trigger",
            }),
          )
        }

        const eventsTrigger = document.querySelector(`[data-image-index="10"]`)
        if (eventsTrigger) {
          imageTriggers.push(
            ScrollTrigger.create({
              trigger: eventsTrigger,
              start: "top 40%",
              onEnter: () => setCurrentStep(3),
              onEnterBack: () => setCurrentStep(3),
              onLeaveBack: () => setCurrentStep(2),
              id: "events-trigger",
            }),
          )
        }

        setTimeout(() => ScrollTrigger.refresh(), 200)
      }, 100) // Small delay to ensure DOM is ready
    } else {
      // If mobile/tablet layout or no layered transition, ensure no pinning and clear any GSAP styles
      cleanupTriggers()
    }

    return () => {
      cleanupTriggers()
    }
  }, [isMounted, isMobileLayout, shouldApplyLayeredTransition]) // Re-run when these states change

  // Same text variants as Services section
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

  // Filter the columns to be rendered based on activeColumns
  const columnsToRender = portfolioDecorativeElementsData.filter((_, i) =>
    portfolioColumnIndicesToShow[activeColumns as keyof typeof portfolioColumnIndicesToShow].includes(i),
  )

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className={`relative bg-black text-white z-20 ${shouldApplyLayeredTransition ? "-mt-[100vh]" : "mt-0"}`}
      style={{
        borderTopLeftRadius: "60px 24px",
        borderTopRightRadius: "60px 24px",
      }}
    >
      {/* Header */}
      <div className="pt-32 pb-20 lg:pb-32 text-center px-4 sm:px-0">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isMounted && isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">OUR PORTFOLIO</motion.h2>
          <motion.p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our craft in digital, video, and brand storytelling
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Background Elements - Hydration Safe */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {columnsToRender.map((column, i) =>
            column.items.map((e, j) => {
              // Calculate left position based on the index within the *rendered* columns
              // and the total number of active columns.
              const leftPercentage = activeColumns > 1 ? (i / (activeColumns - 1)) * 100 : 50
              return (
                <div
                  key={`col${column.col}-item${j}`} // Use original column index for unique key
                  className="absolute opacity-20"
                  style={{
                    top: e.top,
                    left: `${leftPercentage}%`,
                    transform: "translateX(-50%)",
                    width: `${e.size * 4}px`,
                    height: `${e.size * 4}px`,
                  }}
                >
                  <img src={getImageUrl(e.src) || "/placeholder.svg"} alt="" className="w-full h-full object-contain" />
                </div>
              )
            }),
          )}
        </div>
      )}

      {/* Conditional Layout based on isMobileLayout */}
      {isMobileLayout ? (
        // Mobile/Tablet Layout: Single column, titles rendered within MediaGrid
        <MediaGrid isMobile={isMobileLayout} />
      ) : (
        // Desktop Layout: Two columns with sticky text
        <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
          {/* Left Side - Pinned Text Content */}
          <div
            id="portfolio-left-text" // Add ID for GSAP selection
            className="lg:sticky lg:top-0 h-screen flex items-start justify-center pl-4 lg:pl-6 pt-16"
          >
            <LeftTextContent currentStep={currentStep} />
          </div>

          {/* Right Side - Scrolling Media */}
          <MediaGrid isMobile={isMobileLayout} />
        </div>
      )}

      {/* Channel Management Section */}
      <ChannelManagementSection />
    </section>
  )
}

export default Portfolio
