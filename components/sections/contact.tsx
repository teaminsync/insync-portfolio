"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Phone, Instagram, Send, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Cal, { getCalApi } from "@calcom/embed-react"
import { useToast } from "@/hooks/use-toast" // Import useToast
import { useCursorContext } from "@/context/CursorContext" // Import useCursorContext

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const calWidgetRef = useRef<HTMLDivElement>(null) // Ref for the Cal.com widget container
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false) // Changed to isSubmitting
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
  })

  const { toast } = useToast() // Initialize toast hook
  const { setIsInteractiveElementHovered } = useCursorContext() // Get the context setter

  // Cal.com setup with your exact configuration
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "30min" })
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#000000" },
          dark: { "cal-brand": "#F9F4EB" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  // Handlers for Cal.com widget hover
  const handleCalMouseEnter = () => {
    setIsInteractiveElementHovered(true)
  }

  const handleCalMouseLeave = () => {
    setIsInteractiveElementHovered(false)
  }

  // Cleanup on unmount to ensure cursor is visible if component unmounts while hovered
  useEffect(() => {
    return () => {
      setIsInteractiveElementHovered(false)
    }
  }, [setIsInteractiveElementHovered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true) // Set submitting state

    // Add timestamp to formData right before sending
    const dataToSend = {
      ...formData,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send dataToSend
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you soon.",
          duration: 3000,
        })
        // Reset form data on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          budget: "",
          message: "",
        })
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "Please try again or contact us directly.",
          variant: "destructive",
          duration: 4000,
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "Unable to submit form. Please check your internet connection.",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false) // Reset submitting state
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
      value: "@insync.solutions",
      href: "https://instagram.com/insync.solutions",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Mumbai, Maharashtra",
      href: "#",
    },
  ]

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
    <section ref={containerRef} id="contact" className="relative pt-24 pb-8 bg-[#F9F4EB]">
      <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-20">
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

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Form - Now on Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h3 className="text-black text-3xl font-bold mb-8">SEND US A MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row: Name and Phone Number */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Second Row: Email alone */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              {/* Third Row: Project Type and Budget */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="projectType" className="text-sm font-medium text-gray-700">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-black focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select a service</option>
                    <option value="web-development">Web Development</option>
                    <option value="video-production">Video Production</option>
                    <option value="content-strategy">Content Strategy</option>
                    <option value="branding">Personal Branding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                    Budget (Optional)
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-black focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-50k">Under ₹50,000</option>
                    <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                    <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                    <option value="above-3l">Above ₹3,00,000</option>
                  </select>
                </div>
              </div>

              {/* Last Row: Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message (Optional)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting} // Use isSubmitting here
                  className="w-full py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Send className="w-5 h-5 animate-pulse" /> {/* Use Send icon with pulse */}
                      Sending...
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Contact Methods - Now on Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-black text-3xl font-bold mb-6">GET IN TOUCH</h3>

            {contactMethods.map((method, index) => (
              <motion.a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3 py-3"
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
          </motion.div>
        </div>

        {/* Cal.com Inline Embed Section - With Your Exact Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black">SCHEDULE A CALL</h3>
          </div>

          {/* Cal.com Widget with Dark Theme */}
          <div
            ref={calWidgetRef} // Attach ref here
            className="overflow-hidden"
            onMouseEnter={handleCalMouseEnter} // Add mouse enter handler
            onMouseLeave={handleCalMouseLeave} // Add mouse leave handler
          >
            <Cal
              namespace="30min"
              calLink="insync-solutions/30min"
              style={{
                width: "100%",
                height: "600px",
                overflow: "scroll",
              }}
              config={{
                layout: "month_view",
                theme: "dark",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
