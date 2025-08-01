"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { getDecorativeImageUrl, getImageUrl } from "@/lib/cloudinary"

// Define the full set of decorative elements outside the component
const decorativeElementsData = [
  {
    col: 0,
    items: [
      { top: "-12%", size: 36, src: "elmnt1_q2gbvh" },
      { top: "47%", size: 32, src: "elmnt4_l95xm1" },
      { top: "87%", size: 28, src: "elmnt2_spftr7" },
    ],
  },
  {
    col: 1,
    items: [
      { top: "11%", size: 32, src: "elmnt3_bgkljv" },
      { top: "62%", size: 36, src: "elmnt5_mernov" },
    ],
  },
  {
    col: 2,
    items: [
      { top: "-12%", size: 36, src: "elmnt6_thgphw" },
      { top: "47%", size: 28, src: "elmnt1_q2gbvh" },
      { top: "87%", size: 32, src: "elmnt4_l95xm1" },
    ],
  },
  {
    col: 3,
    items: [
      { top: "3%", size: 36, src: "elmnt2_spftr7" },
      { top: "67%", size: 32, src: "elmnt6_thgphw" },
    ],
  },
  {
    col: 4,
    items: [
      { top: "-13%", size: 32, src: "elmnt3_bgkljv" },
      { top: "42%", size: 36, src: "elmnt4_l95xm1" },
      { top: "89%", size: 28, src: "elmnt1_q2gbvh" },
    ],
  },
  {
    col: 5,
    items: [
      { top: "3%", size: 36, src: "elmnt5_mernov" },
      { top: "62%", size: 32, src: "elmnt2_spftr7" },
    ],
  },
  {
    col: 6,
    items: [
      { top: "-13%", size: 36, src: "elmnt6_thgphw" },
      { top: "32%", size: 36, src: "elmnt3_bgkljv" },
      { top: "82%", size: 32, src: "elmnt4_l95xm1" },
    ],
  },
]

// Define which column indices to show for each number of active columns
const columnIndicesToShow = {
  3: [0, 1, 2],
  5: [0, 1, 2, 3, 4],
  7: [0, 1, 2, 3, 4, 5, 6],
}

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [activeColumns, setActiveColumns] = useState(7) // Default for desktop

  useEffect(() => {
    const handleResize = () => {
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

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  // Filter the columns to be rendered based on activeColumns
  const columnsToRender = decorativeElementsData.filter((_, i) =>
    columnIndicesToShow[activeColumns as keyof typeof columnIndicesToShow].includes(i),
  )

  return (
    <section
      ref={containerRef}
      id="about"
      className="mt-6 sm:mt-8 md:mt-2 relative py-28 sm:py-32 md:py-36 lg:py-24 xl:py-28 bg-black overflow-hidden px-6 sm:px-12 md:px-20 lg:px-40 xl:px-60 2xl:px-96"
      style={{
        borderTopLeftRadius: "60px 24px",
        borderTopRightRadius: "60px 24px",
        borderBottomLeftRadius: "60px 24px",
        borderBottomRightRadius: "60px 24px",
      }}
    >
      {/* Decorative Elements - Now using optimized sizes */}
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
                <img
                  src={getDecorativeImageUrl(e.src, e.size * 4) || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            )
          }),
        )}
      </div>

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
                  src={getImageUrl("arrow_nzauxl", 64, 64) || "/placeholder.svg"}
                  alt="Arrow"
                  className="w-12 h-12 md:w-16 md:h-16"
                  style={{ transform: "rotate(90deg)" }}
                  loading="lazy"
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
                  src={getImageUrl("arrow_nzauxl", 64, 64) || "/placeholder.svg"}
                  alt="Arrow"
                  className="w-12 h-12 md:w-16 md:h-16"
                  style={{ transform: "rotate(-180deg)" }}
                  loading="lazy"
                />
              </motion.div>
            </div>

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
                Strategy is at the core of everything we do. Your goals shape the direction, inspire our creativity, and
                lead to digital solutions that look great, work fast, and grow with you.
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
                <img
                  src={getImageUrl("arrow_nzauxl", 64, 64) || "/placeholder.svg"}
                  alt="Arrow"
                  className="w-12 h-12 md:w-16 md:h-16"
                  loading="lazy"
                />
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
                  src={getImageUrl("arrow_nzauxl", 64, 64) || "/placeholder.svg"}
                  alt="Arrow"
                  className="w-12 h-12 md:w-16 md:h-16"
                  style={{ transform: "rotate(-90deg)" }}
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
