"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useCursorContext } from "@/context/CursorContext"
import HeroAnimation from "@/components/hero-animation"
import ContactForm from "@/components/contact/contact-form"
import ContactMethods from "@/components/contact/contact-methods"
import CalendarWidget from "@/components/contact/calendar-widget"

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { setIsInteractiveElementHovered } = useCursorContext()

  // Cleanup on unmount to ensure cursor is visible if component unmounts while hovered
  useEffect(() => {
    return () => {
      setIsInteractiveElementHovered(false)
    }
  }, [setIsInteractiveElementHovered])

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

  return (
    <section ref={containerRef} id="contact" className="relative pt-24 pb-8">
      {/* Hero Animation Background */}
      <HeroAnimation />
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-20 relative z-10"
      >
        <motion.h2
          custom={0}
          variants={textVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
        >
          LET'S TALK
        </motion.h2>
        <motion.p custom={1} variants={textVariants} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your digital presence with us.
        </motion.p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Form - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Methods - Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ContactMethods />
          </motion.div>
        </div>

        {/* Calendar Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CalendarWidget />
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
