"use client"

import { useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Services from "@/components/sections/services"
import Portfolio from "@/components/sections/portfolio"
import Process from "@/components/sections/process"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"
import Navigation from "@/components/navigation"
import CustomCursor from "@/components/custom-cursor"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Add CSS class to hide cursor instead of inline styles
    document.body.classList.add("custom-cursor-active")

    return () => {
      document.body.classList.remove("custom-cursor-active")
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className="bg-[#F9F4EB] text-white overflow-hidden">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-[#F9F4EB] text-white overflow-hidden">
      <CustomCursor />
      <Navigation />

      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
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
  )
}
