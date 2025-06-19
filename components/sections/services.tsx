"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} id="services" className="relative py-32 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* ✅ PERFECT TRIGGER POSITION */}
       
  {/* ✅ PERFECT TRIGGER POSITION */}
        <div className="h-52" />
        <div id="scatter-trigger" className="h-4 w-full" />
        {/* ✅ VISUAL DEBUG AID - Remove after testing */}
        <div className="h-[1px] w-full bg-red-500 opacity-50" />
        {/* ✅ MUCH TIGHTER SPACING - From h-52 to h-32 */}
        <div className="h-52" />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      {/* Decorative floating elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-20 right-10 w-64 h-64 border border-blue-500/10 rounded-full"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-48 h-48 border border-purple-500/10 rounded-full"
      />
    </section>
  )
}

export default Services
