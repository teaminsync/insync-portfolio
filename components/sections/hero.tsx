"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play } from "lucide-react"

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.2,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative bg-[#F9F4EB] min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center pt-24 sm:pt-28 md:pt-32 lg:pt-0 min-h-[calc(85vh-6rem)] sm:min-h-[calc(85vh-7rem)] md:min-h-[calc(85vh-8rem)] lg:min-h-[62vh]">
          {/* Left Side - Text Content */}
          <motion.div initial="hidden" animate="visible" className="text-left">
            {/* Main Headline with Scrolling Animation */}
            <motion.div custom={0} variants={textVariants} className="text-scroll-container">
              <ul className="text-scroll-list">
                <li>websites</li>
                <li>brand videos</li>
                <li>strategic content</li>
                <li>personal brands</li>
                <li>websites</li>
              </ul>
            </motion.div>

            {/* Subheadline with consistent spacing */}
            <motion.p
              custom={1}
              variants={textVariants}
              className="text-black max-w-2xl font-medium"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: "1.15",
                marginTop: "clamp(0.25rem, 0.6vw, 0.5rem)",
              }}
            >
              built to grow with your vision.
            </motion.p>
          </motion.div>

          {/* Right Side - Medium-sized Media Placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] max-w-md mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center border border-gray-200">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">Hero Video/Image</p>
                  <p className="text-sm text-gray-500">Placeholder for media content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-black/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-3 bg-black/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
