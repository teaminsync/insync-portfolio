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
import { getCalApi } from "@calcom/embed-react"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [isMounted, setIsMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false) // New state for touch detection

  useEffect(() => {
    setIsMounted(true)

    // Detect touch device
    const checkTouchDevice = () => {
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true)
      } else {
        setIsTouchDevice(false)
      }
    }

    checkTouchDevice() // Initial check
    window.addEventListener("resize", checkTouchDevice) // Re-check on resize

    return () => {
      window.removeEventListener("resize", checkTouchDevice)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "30min" })
      cal("floatingButton", {
        calLink: "insync-solutions/30min",
        config: { layout: "month_view" },
        buttonText: "LET’S SYNC UP",
        hideButtonIcon: false,
      })
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#000000" }, dark: { "cal-brand": "#F9F4EB" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

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
      {/* Conditionally render CustomCursor */}
      {!isTouchDevice && <CustomCursor />}
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
