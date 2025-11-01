"use client"

import { useEffect, useState } from "react"
import { useScroll } from "framer-motion"
import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Services from "@/components/sections/services"
import Portfolio from "@/components/sections/portfolio"
import Process from "@/components/sections/process"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"
import Navigation from "@/components/navigation"
import CustomCursor from "@/components/custom-cursor"
import { fbqInit, trackPageView } from "@/lib/fbpixel"
import { getCalApi } from "@calcom/embed-react"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    fbqInit()
    trackPageView()
  }, [])

  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true)
      } else {
        setIsTouchDevice(false)
      }
    }

    checkTouchDevice()
    window.addEventListener("resize", checkTouchDevice)

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
        buttonText: "LET'S SYNC UP",
        hideButtonIcon: false,
      })
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#000000" }, dark: { "cal-brand": "#F9F4EB" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <div className="bg-[#F9F4EB] text-white overflow-hidden">
      {!isTouchDevice && <CustomCursor />}
      <Navigation />

      <main>
        <Hero />
        <About />
        <Services isTouchDevice={isTouchDevice} />
        <Portfolio />
        <Process />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
