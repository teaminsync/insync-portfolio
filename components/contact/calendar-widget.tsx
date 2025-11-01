"use client"

import { useEffect, useRef, useState } from "react"
import { useCursorContext } from "@/context/CursorContext"
import { trackEvent } from "@/lib/fbpixel"

const CalendarWidget = () => {
  const calWidgetRef = useRef<HTMLDivElement>(null)
  const { setIsInteractiveElementHovered } = useCursorContext()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer to load Cal.com only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    if (calWidgetRef.current) {
      observer.observe(calWidgetRef.current)
    }

    return () => observer.disconnect()
  }, [isLoaded])

  // Load Cal.com dynamically only when visible
  useEffect(() => {
    if (!isVisible || isLoaded) return

    let isMounted = true

    const loadCalWidget = async () => {
      try {
        const { getCalApi } = await import("@calcom/embed-react")

        if (!isMounted) return

        const cal = await getCalApi({ namespace: "30min" })

        if (isMounted) {
          cal("ui", {
            theme: "dark",
            cssVarsPerTheme: {
              light: { "cal-brand": "#000000" },
              dark: { "cal-brand": "#F9F4EB" },
            },
            hideEventTypeDetails: false,
            layout: "month_view",
          })
          setIsLoaded(true)
        }
      } catch (error) {
        console.error("Failed to load Cal.com:", error)
      }
    }

    loadCalWidget()

    return () => {
      isMounted = false
    }
  }, [isVisible, isLoaded])

  useEffect(() => {
    if (!isLoaded) return

    const handleCalBooking = (event: MessageEvent) => {
      // Cal.com sends booking confirmations via postMessage
      if (event.data?.type === "booking.success" || event.data?.method === "bookingConfirmed") {
        trackEvent("BookCall_Widget", {
          widget_type: "calendar",
          booking_confirmed: true,
        })
      }
    }

    window.addEventListener("message", handleCalBooking)

    return () => {
      window.removeEventListener("message", handleCalBooking)
    }
  }, [isLoaded])

  const handleCalMouseEnter = () => {
    setIsInteractiveElementHovered(true)
  }

  const handleCalMouseLeave = () => {
    setIsInteractiveElementHovered(false)
  }

  useEffect(() => {
    return () => {
      setIsInteractiveElementHovered(false)
    }
  }, [setIsInteractiveElementHovered])

  return (
    <div className="mt-12 sm:mt-16 relative z-10">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-black">SCHEDULE A CALL</h3>
      </div>

      <div
        ref={calWidgetRef}
        className="overflow-hidden min-h-[600px] bg-[#0F0F0F] rounded-lg flex items-center justify-center"
        onMouseEnter={handleCalMouseEnter}
        onMouseLeave={handleCalMouseLeave}
      >
        {!isLoaded ? (
          <div className="text-center p-8 h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4D4D4] mx-auto mb-4"></div>
            <p className="text-[#D4D4D4]">Connecting to calendar...</p>
          </div>
        ) : (
          <div className="w-full h-[600px]">
            <iframe
              src="https://cal.com/insync-solutions/30min"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a call"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarWidget
