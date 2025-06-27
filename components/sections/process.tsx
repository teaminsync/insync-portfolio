"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      number: 1,
      title: "Discover",
      description: "We listen, research, and understand your brand deeply.",
    },
    {
      number: 2,
      title: "Design",
      description: "We wireframe, storyboard, and craft tailored solutions.",
    },
    {
      number: 3,
      title: "Develop",
      description: "Clean, strategic, and production-ready builds.",
    },
    {
      number: 4,
      title: "Deliver",
      description: "We launch, refine, and stay involved post-deployment.",
    },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Create GSAP timeline for step progression
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=400%", // 4 full viewport heights for 4 steps
        scrub: 1, // Smooth scrubbing tied to scroll
        pin: true, // Pin the section during animation
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update current step based on progress
          const progress = self.progress
          const newStep = Math.min(Math.floor(progress * 4), 3)
          setCurrentStep(newStep)
        },
      },
    })

    // Simple timeline that just tracks progress - no DOM rotation
    tl.to(
      {},
      {
        duration: 4, // 4 steps
        ease: "none",
      },
      0,
    )

    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Calculate which dots should be visible based on rotation
  const getDotVisibility = (dotPosition: number, currentRotation: number) => {
    // Calculate the actual angle after rotation
    const actualAngle = (dotPosition - currentRotation) % 360
    // Normalize to 0-359 range
    const normalizedAngle = actualAngle < 0 ? actualAngle + 360 : actualAngle

    // Dots in the bottom half (between 135° and 225°) should be hidden
    const isVisible = !(normalizedAngle > 135 && normalizedAngle < 225)

    // Fade out as they approach the bottom
    let opacity = 1
    if (normalizedAngle > 90 && normalizedAngle < 135) {
      // Fade out as it approaches bottom
      opacity = (135 - normalizedAngle) / 45
    } else if (normalizedAngle > 225 && normalizedAngle < 270) {
      // Fade in as it rises from bottom
      opacity = (normalizedAngle - 225) / 45
    }

    return { isVisible, opacity }
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white h-screen flex items-center justify-center overflow-hidden pt-12"
    >
      {/* Top-left heading */}
      <div className="absolute top-20 left-12 z-10">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
        >
          How We
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Work</span>
        </motion.h2>
      </div>

      {/* Centered arc and animation - clipped container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Clipping container - only shows top half */}
        <div className="relative overflow-hidden w-[1000px] h-[700px] sm:w-[1300px] sm:h-[900px] lg:w-[1800px] lg:h-[1050px]">
          <div className="relative translate-y-[100px] sm:translate-y-[120px] lg:translate-y-[150px]">
            {/* ALL your absolute-positioned arc content goes here */}
            <svg
              width="1500"
              height="1500"
              viewBox="0 0 1500 1500"
              className="absolute left-1/2 top-0 transform -translate-x-1/2"
            >
              <path
                d="M 150 750 A 600 600 0 0 1 1350 750"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            </svg>

            {/* Rotating dots container */}
            <div className="absolute w-[1500px] h-[1500px] left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="relative w-[1200px] h-[1200px]"
                animate={{ rotate: -currentStep * 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Dot 1 - 0° (Top) */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 0 ? "bg-blue-500 scale-125" : "bg-blue-500/40"
                    } transition-all duration-300`}
                    style={{
                      opacity: getDotVisibility(0, currentStep * 90).opacity,
                    }}
                  />
                </div>

                {/* Dot 2 - 90° (Right) */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 1 ? "bg-blue-500 scale-125" : "bg-blue-500/40"
                    } transition-all duration-300`}
                    style={{
                      opacity: getDotVisibility(90, currentStep * 90).opacity,
                    }}
                  />
                </div>

                {/* Dot 3 - 180° (Bottom) */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 2 ? "bg-blue-500 scale-125" : "bg-blue-500/40"
                    } transition-all duration-300`}
                    style={{
                      opacity: getDotVisibility(180, currentStep * 90).opacity,
                    }}
                  />
                </div>

                {/* Dot 4 - 270° (Left) */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 3 ? "bg-blue-500 scale-125" : "bg-blue-500/40"
                    } transition-all duration-300`}
                    style={{
                      opacity: getDotVisibility(270, currentStep * 90).opacity,
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Numbers container - rotates with dots but numbers stay straight */}
            <div className="absolute w-[1500px] h-[1500px] left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="relative w-[1200px] h-[1200px]"
                animate={{ rotate: -currentStep * 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Number 1 - above Dot 1 */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-20">
                  <motion.div
                    // Counter-rotate to keep number straight
                    animate={{ rotate: currentStep * 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      opacity: getDotVisibility(0, currentStep * 90).opacity,
                    }}
                  >
                    <div className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                      <span className="text-base font-bold text-white">1</span>
                    </div>
                  </motion.div>
                </div>

                {/* Number 2 - above Dot 2 */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-20">
                  <motion.div
                    // Counter-rotate to keep number straight
                    animate={{ rotate: currentStep * 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      opacity: getDotVisibility(90, currentStep * 90).opacity,
                    }}
                  >
                    <div className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                      <span className="text-base font-bold text-white">2</span>
                    </div>
                  </motion.div>
                </div>

                {/* Number 3 - above Dot 3 */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-20">
                  <motion.div
                    // Counter-rotate to keep number straight
                    animate={{ rotate: currentStep * 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      opacity: getDotVisibility(180, currentStep * 90).opacity,
                    }}
                  >
                    <div className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                      <span className="text-base font-bold text-white">3</span>
                    </div>
                  </motion.div>
                </div>

                {/* Number 4 - above Dot 4 */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-20">
                  <motion.div
                    // Counter-rotate to keep number straight
                    animate={{ rotate: currentStep * 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      opacity: getDotVisibility(270, currentStep * 90).opacity,
                    }}
                  >
                    <div className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                      <span className="text-base font-bold text-white">4</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Lines container - rotates with dots, lines stay straight */}
            <div className="absolute w-[1500px] h-[1500px] left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center pointer-events-none">
              <motion.div
                className="relative w-[1200px] h-[1200px]"
                animate={{ rotate: -currentStep * 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Line for Dot 1*/}
                <div className="absolute left-1/2 top-24 transform -translate-x-1/2 -translate-y-16">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="line-dot-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: -currentStep * 90 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ rotate: currentStep * 90 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          className="flex justify-center"
                        >
                          <div className="w-0.5 h-48 bg-blue-400/70" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Line for Dot 2*/}
                <div className="absolute right-0 top-1/2 transform -translate-x-[2rem] -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="line-dot-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: -currentStep * 90 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ rotate: currentStep * 90 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <div className="w-48 h-0.5 bg-blue-400/70" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Line for Dot 3*/}
                <div className="absolute left-1/2 bottom-24 transform -translate-x-1/2 translate-y-16">
                  <AnimatePresence mode="wait">
                    {currentStep === 2 && (
                      <motion.div
                        key="line-dot-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="relative"
                      >
                        <div className="flex justify-center" style={{ transform: "rotate(180deg)" }}>
                          <div className="w-0.5 h-48 bg-blue-400/70" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Line for Dot 4 */}
                <div className="absolute left-0 top-1/2 transform translate-x-[2rem] -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {currentStep === 3 && (
                      <motion.div
                        key="line-dot-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <div className="w-48 h-0.5 bg-blue-400/70" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Descriptions container - rotates with dots, text stays upright */}
            <div className="absolute w-[1500px] h-[1500px] left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center pointer-events-none">
              <motion.div
                className="relative w-[1200px] h-[1200px]"
                animate={{ rotate: -currentStep * 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Description 1 */}
                <div className="absolute left-1/2 top-72 transform -translate-x-1/2 -translate-y-10">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="description-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: -currentStep * 90 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <motion.div
                          animate={{ rotate: currentStep * 90 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          className="w-72 text-center"
                        >
                          <h3 className="text-2xl font-bold text-white mb-2">{steps[0].title}</h3>
                          <p className="text-lg text-gray-300 leading-relaxed">{steps[0].description}</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description 2 */}
                <div className="absolute right-0 top-1/2 transform -translate-x-[10rem] -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="desc-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <motion.div
                          initial={{ rotate: -90 }}
                          animate={{ rotate: -90 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <motion.div
                            initial={{ rotate: 540 }}
                            animate={{ rotate: 540 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-72 text-center"
                          >
                            <h3 className="text-2xl font-bold text-white mb-2">{steps[1].title}</h3>
                            <p className="text-lg text-gray-300 leading-relaxed">{steps[1].description}</p>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description 3 */}
                <div className="absolute left-1/2 bottom-72 transform -translate-x-1/2 translate-y-10">
                  <AnimatePresence mode="wait">
                    {currentStep === 2 && (
                      <motion.div
                        key="desc-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <div style={{ transform: "rotate(180deg)" }} className="w-72 text-center">
                          <h3 className="text-2xl font-bold text-white mb-2">{steps[2].title}</h3>
                          <p className="text-lg text-gray-300 leading-relaxed">{steps[2].description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description 4 */}
                <div className="absolute left-0 top-1/2 transform translate-x-[10rem] -translate-y-1/2">
                  <motion.div animate={{ rotate: -currentStep * 90 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                    <motion.div
                      animate={{ rotate: currentStep * 90 + 270 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <AnimatePresence mode="wait">
                        {currentStep === 3 && (
                          <motion.div
                            key="description-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-72 text-center"
                          >
                            <h3 className="text-2xl font-bold text-white mb-2">{steps[3].title}</h3>
                            <p className="text-lg text-gray-300 leading-relaxed">{steps[3].description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Process
