"use client"

import type React from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { motion } from "framer-motion"

const HeroLottieAnimation: React.FC = () => {
  return (
    <motion.div
      // Removed initial, animate, and transition props for no entrance animation
      className="w-full h-full flex items-center justify-center"
    >
      <DotLottieReact
        src="https://lottie.host/06e2f5f0-132f-4bee-a89e-ca0e761845c6/FIkhPQ1o6O.lottie"
        loop
        autoplay
        className="w-full h-full max-w-[400px] max-h-[400px] lg:max-w-[500px] lg:max-h-[500px]" // Adjust size as needed
      />
    </motion.div>
  )
}

export default HeroLottieAnimation
