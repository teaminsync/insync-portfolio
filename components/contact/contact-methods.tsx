"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Phone, Instagram, MapPin } from "lucide-react"

const ContactMethods = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "insyncsolutions06@gmail.com",
      href: "mailto:insyncsolutions06@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9082210545",
      href: "https://wa.me/+919082210545",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@lets.insync",
      href: "https://www.instagram.com/lets.insync/",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Mumbai, Maharashtra",
      href: "https://maps.app.goo.gl/GbkBsyXPB63KUsyq5",
    },
  ]

  return (
    <div ref={containerRef} className="space-y-4">
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-black text-3xl font-bold mb-6"
      >
        GET IN TOUCH
      </motion.h3>

      {contactMethods.map((method, index) => (
        <motion.a
          key={method.label}
          href={method.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{
            duration: 0.6,
            delay: 0.2 + index * 0.1,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
          className="flex items-start gap-3 py-3 hover:opacity-80 transition-opacity block"
        >
          <div className="p-1">
            <method.icon className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-lg font-semibold text-black uppercase">{method.label}</div>
            <div className="text-gray-500 mt-1">{method.value}</div>
          </div>
        </motion.a>
      ))}
    </div>
  )
}

export default ContactMethods
