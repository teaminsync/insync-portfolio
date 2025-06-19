"use client"

import { useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Services from "@/components/sections/services"
import Portfolio from "@/components/sections/portfolio"
import VideoProduction from "@/components/sections/video-production"
import Process from "@/components/sections/process"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"
import Navigation from "@/components/navigation"
import CustomCursor from "@/components/custom-cursor"
import SmoothScroll from "@/components/smooth-scroll"
import TravelingCardSystem from "@/components/traveling-card-system"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    // Disable default cursor
    document.body.style.cursor = "none"
    return () => {
      document.body.style.cursor = "auto"
    }
  }, [])

  return (
    <SmoothScroll>
      <div className="bg-black text-white overflow-hidden">
        <CustomCursor />
        <Navigation />

        {/* Global Traveling Card System */}
        <TravelingCardSystem />

        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <VideoProduction />
          <Process />
          <Contact />
        </main>

        <Footer />

        {/* Scroll indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </SmoothScroll>
  )
}
