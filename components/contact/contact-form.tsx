"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { trackEvent } from "@/lib/fbpixel"

interface FormData {
  name: string
  email: string
  phone: string
  projectType: string
  budget: string
  message: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const { toast } = useToast()

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear error when user starts typing
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors below",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      setIsSubmitting(true)

      const dataToSend = {
        ...formData,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        })

        const result = await response.json()

        if (result.success) {
          trackEvent("ContactForm_Submit", {
            projectType: formData.projectType,
            budget: formData.budget,
          })

          toast({
            title: "Message Sent!",
            description: "We'll get back to you soon.",
            duration: 3000,
          })
          setFormData({
            name: "",
            email: "",
            phone: "",
            projectType: "",
            budget: "",
            message: "",
          })
          setErrors({})
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
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, toast],
  )

  return (
    <div className="relative">
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
              className={`bg-white border text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
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
            className={`bg-white border text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
              className={`w-full px-3 py-2 bg-white border rounded-md text-black focus:outline-none focus:border-gray-400 ${
                errors.projectType ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">Select a service</option>
              <option value="web-development">Web Development</option>
              <option value="video-production">Video Production</option>
              <option value="content-strategy">Content Strategy</option>
              <option value="branding">Personal Branding</option>
              <option value="other">Other</option>
            </select>
            {errors.projectType && <p className="text-red-500 text-xs">{errors.projectType}</p>}
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
            disabled={isSubmitting}
            className="w-full py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <Send className="w-5 h-5 animate-pulse" />
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
    </div>
  )
}

export default ContactForm
