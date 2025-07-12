"use client"

import { motion } from "framer-motion"

interface LeftTextContentProps {
  currentStep: number
}

const LeftTextContent = ({ currentStep }: LeftTextContentProps) => {
  const sections = [
    "WEBSITES",
    "VIDEO PRODUCTION",
    "BRANDED",
    "EVENTS",
    "WEBSITES", // Duplicate first item for seamless loop
  ]

  return (
    <div className="w-full max-w-lg">
      <motion.div
        className="portfolio-text-scroll-container"
        animate={{
          y: ["0%", "1%", "-1%", "0%"], // Subtle vertical drift
          x: ["0%", "0.5%", "-0.5%", "0%"], // Subtle horizontal drift
          rotate: [0, 0.2, -0.2, 0], // Very subtle rotation
        }}
        transition={{
          y: {
            duration: 8, // Longer duration for y-axis
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse", // Smoothly reverses direction
            ease: "easeInOut",
          },
          x: {
            duration: 10, // Different duration for x-axis
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          rotate: {
            duration: 12, // Different duration for rotation
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
      >
        <ul
          className="portfolio-text-scroll-list"
          style={{
            transform: `translateY(calc(-${currentStep} * clamp(2.2rem, 5.5vw, 4.4rem)))`,
          }}
        >
          {sections.map((title, index) => (
            <li key={index}>
              <span className="text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.98rem]">{title}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default LeftTextContent
