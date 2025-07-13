"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import LeftTextContent from "@/components/portfolio/left-text-content"
import MediaGrid from "@/components/portfolio/media-grid"
import ChannelManagementSection from "@/components/portfolio/channel-management"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isInView = useInView(headerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isMounted || !containerRef.current || !leftTextRef.current) return

    // Wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      const leftTextElement = leftTextRef.current
      const firstImage = document.querySelector(`[data-image-index="0"]`)
      const lastImage = document.querySelector(`[data-image-index="10"]`)

      if (!leftTextElement || !firstImage || !lastImage) return

      // Pin the left text during the entire image section
      const pinTrigger = ScrollTrigger.create({
        trigger: firstImage,
        start: "top 20%",
        endTrigger: lastImage,
        end: "bottom 80%",
        pin: leftTextElement,
        pinSpacing: false,
        id: "pin-left-text",
      })

      // Create individual triggers for content changes
      const imageTriggers: any[] = []

      // Default to Websites at start
      setCurrentStep(0)

      // Video Production trigger
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

      // Branded trigger
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

      // Events trigger
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

      return () => {
        pinTrigger.kill()
        imageTriggers.forEach((trigger) => {
          if (trigger && typeof trigger.kill === "function") {
            trigger.kill()
          }
        })
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isMounted])

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

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="relative bg-black text-white"
      style={{
        borderTopLeftRadius: "60px 24px",
        borderTopRightRadius: "60px 24px",
      }}>
      {/* Header */}
      <div className="py-32 text-center">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isMounted && isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.h2
            custom={0}
            variants={textVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            OUR PORTFOLIO
          </motion.h2>
          <motion.p custom={1} variants={textVariants} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our craft in digital, video, and brand storytelling
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Background Elements - Hydration Safe */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ----- Column 1 (Left Edge) ----- */}
          {[
            { top: "2%", left: "4%", size: 36, src: "elmnt1" },
            { top: "12%", left: "7%", size: 36, src: "elmnt4" },
            { top: "22%", left: "5%", size: 32, src: "elmnt2" },
            { top: "32%", left: "8%", size: 36, src: "elmnt6" },
            { top: "42%", left: "3%", size: 28, src: "elmnt3" },
            { top: "52%", left: "6%", size: 36, src: "elmnt5" },
            { top: "62%", left: "9%", size: 32, src: "elmnt1" },
            { top: "72%", left: "4%", size: 36, src: "elmnt4" },
            { top: "82%", left: "7%", size: 36, src: "elmnt2" },
            { top: "92%", left: "5%", size: 36, src: "elmnt6" },
          ].map((e, i) => (
            <div
              key={`col1-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`, // Convert Tailwind unit (e.g., w-36 is 9rem = 144px)
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 2 ----- */}
          {[
            { top: "7%", left: "16%", size: 32, src: "elmnt3" },
            { top: "17%", left: "19%", size: 36, src: "elmnt5" },
            { top: "27%", left: "17%", size: 28, src: "elmnt1" },
            { top: "37%", left: "20%", size: 36, src: "elmnt4" },
            { top: "47%", left: "15%", size: 36, src: "elmnt2" },
            { top: "57%", left: "18%", size: 32, src: "elmnt6" },
            { top: "67%", left: "21%", size: 28, src: "elmnt3" },
            { top: "77%", left: "16%", size: 36, src: "elmnt5" },
            { top: "87%", left: "19%", size: 36, src: "elmnt1" },
            { top: "97%", left: "17%", size: 36, src: "elmnt4" },
          ].map((e, i) => (
            <div
              key={`col2-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 3 ----- */}
          {[
            { top: "4%", left: "29%", size: 36, src: "elmnt6" },
            { top: "14%", left: "32%", size: 32, src: "elmnt2" },
            { top: "24%", left: "30%", size: 28, src: "elmnt5" },
            { top: "34%", left: "34%", size: 36, src: "elmnt3" },
            { top: "44%", left: "28%", size: 36, src: "elmnt1" },
            { top: "54%", left: "33%", size: 36, src: "elmnt4" },
            { top: "64%", left: "31%", size: 36, src: "elmnt6" },
            { top: "74%", left: "29%", size: 32, src: "elmnt2" },
            { top: "84%", left: "35%", size: 36, src: "elmnt5" },
            { top: "94%", left: "30%", size: 28, src: "elmnt2" },
          ].map((e, i) => (
            <div
              key={`col3-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 4 ----- */}
          {[
            { top: "1%", left: "42%", size: 36, src: "elmnt4" },
            { top: "11%", left: "45%", size: 28, src: "elmnt1" },
            { top: "21%", left: "43%", size: 36, src: "elmnt6" },
            { top: "31%", left: "47%", size: 32, src: "elmnt3" },
            { top: "41%", left: "41%", size: 36, src: "elmnt5" },
            { top: "51%", left: "46%", size: 28, src: "elmnt2" },
            { top: "61%", left: "44%", size: 36, src: "elmnt4" },
            { top: "71%", left: "42%", size: 36, src: "elmnt1" },
            { top: "81%", left: "47%", size: 32, src: "elmnt6" },
            { top: "91%", left: "45%", size: 28, src: "elmnt3" },
          ].map((e, i) => (
            <div
              key={`col4-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 5 ----- */}
          {[
            { top: "6%", left: "55%", size: 32, src: "elmnt2" },
            { top: "16%", left: "58%", size: 36, src: "elmnt4" },
            { top: "26%", left: "56%", size: 36, src: "elmnt3" },
            { top: "36%", left: "60%", size: 28, src: "elmnt1" },
            { top: "46%", left: "54%", size: 36, src: "elmnt6" },
            { top: "56%", left: "59%", size: 32, src: "elmnt3" },
            { top: "66%", left: "57%", size: 36, src: "elmnt2" },
            { top: "76%", left: "55%", size: 36, src: "elmnt4" },
            { top: "86%", left: "61%", size: 36, src: "elmnt6" },
            { top: "96%", left: "58%", size: 36, src: "elmnt1" },
          ].map((e, i) => (
            <div
              key={`col5-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 6 ----- */}
          {[
            { top: "3%", left: "68%", size: 36, src: "elmnt5" },
            { top: "13%", left: "71%", size: 32, src: "elmnt3" },
            { top: "23%", left: "69%", size: 36, src: "elmnt4" },
            { top: "33%", left: "73%", size: 28, src: "elmnt5" },
            { top: "43%", left: "67%", size: 36, src: "elmnt4" },
            { top: "53%", left: "72%", size: 36, src: "elmnt2" },
            { top: "63%", left: "70%", size: 32, src: "elmnt5" },
            { top: "73%", left: "68%", size: 28, src: "elmnt3" },
            { top: "83%", left: "74%", size: 36, src: "elmnt5" },
            { top: "93%", left: "71%", size: 36, src: "elmnt5" },
          ].map((e, i) => (
            <div
              key={`col6-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                left: e.left,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}

          {/* ----- Column 7 (Right Edge) ----- */}
          {[
            { top: "8%", right: "6%", size: 36, src: "elmnt2" },
            { top: "18%", right: "8%", size: 36, src: "elmnt3" },
            { top: "28%", right: "5%", size: 36, src: "elmnt4" },
            { top: "38%", right: "9%", size: 28, src: "elmnt2" },
            { top: "48%", right: "7%", size: 36, src: "elmnt1" },
            { top: "58%", right: "4%", size: 36, src: "elmnt1" },
            { top: "68%", right: "8%", size: 36, src: "elmnt4" },
            { top: "78%", right: "6%", size: 32, src: "elmnt3" },
            { top: "88%", right: "9%", size: 36, src: "elmnt4" },
            { top: "98%", right: "5%", size: 36, src: "elmnt3" },
          ].map((e, i) => (
            <div
              key={`col7-${i}`}
              className={`absolute opacity-20`}
              style={{
                top: e.top,
                right: e.right,
                width: `${e.size * 4}px`,
                height: `${e.size * 4}px`,
              }}
            >
              <img src={`/images/${e.src}.svg`} alt="" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
        {/* Left Side - Pinned Text Content */}
        <div
          ref={leftTextRef}
          className="lg:sticky lg:top-0 h-screen flex items-start justify-center pl-4 lg:pl-6 pt-16"
        >
          <LeftTextContent currentStep={currentStep} />
        </div>

        {/* Right Side - Scrolling Media */}
        <MediaGrid />
      </div>

      {/* Channel Management Section */}
      <ChannelManagementSection />
    </section>
  )
}

export default Portfolio