"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"])

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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.2 + i * 0.2,
        duration: 0.8,
        ease: "backOut",
      },
    }),
  }

  return (
    <div className="relative bg-[#F9F4EB] pt-6 sm:pt-8 md:pt-2">
      <section
        ref={containerRef}
        id="about"
        className="relative py-28 sm:py-32 md:py-36 lg:py-24 xl:py-28 bg-black overflow-hidden px-6 sm:px-12 md:px-20 lg:px-40 xl:px-60 2xl:px-96"
        style={{
          borderTopLeftRadius: "60px 24px",
          borderTopRightRadius: "60px 24px",
          borderBottomLeftRadius: "60px 24px",
          borderBottomRightRadius: "60px 24px",
        }}
      >
        {/* Content Container */}
        <div className="max-w-7xl mx-auto relative">
          <motion.div style={{ y }} className="grid lg:grid-cols-1 gap-16 items-center">
            {/* Text Content with Relative Decorative Elements */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-8 text-center relative"
            >
              {/* Top Arrows - Positioned relative to heading */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
                {/* Top Left Arrow - Rotate 90 degrees clockwise from bottom-left */}
                <motion.div
                  className="absolute top-0 -left-4 md:-left-8 lg:-left-16"
                  animate={{
                    x: [0, -10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="images/arrow.svg"
                    alt="Arrow"
                    className="w-12 h-12 md:w-16 md:h-16"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </motion.div>

                {/* Top Right Arrow - Rotate 180 degrees from bottom-left */}
                <motion.div
                  className="absolute top-0 -right-4 md:-right-8 lg:-right-16"
                  animate={{
                    x: [0, 10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="images/arrow.svg"
                    alt="Arrow"
                    className="w-12 h-12 md:w-16 md:h-16"
                    style={{ transform: "rotate(-180deg)" }}
                  />
                </motion.div>
              </div>

              {/* All Icons - Responsive scattered positioning */}
              <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"}>
                {/* Rocket Icon - Responsive positioning */}
                <motion.div
                  custom={0}
                  variants={iconVariants}
                  className="absolute 
                    left-[-1rem] sm:left-[-1.5rem] md:left-[-2rem] lg:left-[-3.5rem] xl:left-[-4rem] 
                    top-[35%] sm:top-[38%] md:top-[42%] lg:top-[45%] xl:top-[46%] 
                    transform -translate-x-0 translate-y-0 -z-10"
                >
                  <img
                    src="images/rocket.svg"
                    alt="Rocket"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20"
                  />
                </motion.div>

                {/* Brain Icon - Responsive positioning */}
                <motion.div
                  custom={1}
                  variants={iconVariants}
                  className="absolute 
                    right-[-0.5rem] sm:right-[-1rem] md:right-[-1.5rem] lg:right-[-2.5rem] xl:right-[-3rem] 
                    top-[15%] sm:top-[12%] md:top-[10%] lg:top-[11%] xl:top-[12%] 
                    transform 
                    translate-x-8 sm:translate-x-10 md:translate-x-12 lg:translate-x-18 xl:translate-x-20 
                    -translate-y-6 sm:-translate-y-8 md:-translate-y-10 lg:-translate-y-14 xl:-translate-y-16 
                    -z-10"
                >
                  <img
                    src="images/brain.svg"
                    alt="Brain"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20"
                  />
                </motion.div>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                custom={0}
                variants={textVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight relative z-10"
              >
                DEDICATED TO CRAFTING MEANINGFUL DIGITAL EXPERIENCES
              </motion.h2>

              {/* Subheading */}
              <div className="space-y-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-5xl mx-auto relative z-10">
                <motion.p custom={1} variants={textVariants}>
                  Strategy is at the core of everything we do. Your goals shape the direction, inspire our creativity,
                  and lead to digital solutions that look great, work fast, and grow with you.
                </motion.p>
              </div>

              {/* Bottom Arrows - Positioned relative to subheading */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
                {/* Bottom Left Arrow - Original orientation (no rotation) */}
                <motion.div
                  className="absolute bottom-0 -left-4 md:-left-8 lg:-left-16"
                  animate={{
                    x: [0, -10, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <img src="images/arrow.svg" alt="Arrow" className="w-12 h-12 md:w-16 md:h-16" />
                </motion.div>

                {/* Bottom Right Arrow - Rotate 270 degrees clockwise from bottom-left */}
                <motion.div
                  className="absolute bottom-0 -right-4 md:-right-8 lg:-right-16"
                  animate={{
                    x: [0, 10, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="images/arrow.svg"
                    alt="Arrow"
                    className="w-12 h-12 md:w-16 md:h-16"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
