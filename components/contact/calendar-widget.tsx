"use client"

import { useEffect, useRef } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"
import { useCursorContext } from "@/context/CursorContext"

const CalendarWidget = () => {
  const calWidgetRef = useRef<HTMLDivElement>(null)
  const { setIsInteractiveElementHovered } = useCursorContext()

  // Cal.com setup
  useEffect(() => {
    let isMounted = true

    const initCal = async () => {
      try {
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
        }
      } catch (error) {
        console.error("Failed to initialize Cal.com:", error)
      }
    }

    initCal()

    return () => {
      isMounted = false
    }
  }, [])

  // Cursor interaction handlers
  const handleCalMouseEnter = () => {
    setIsInteractiveElementHovered(true)
  }

  const handleCalMouseLeave = () => {
    setIsInteractiveElementHovered(false)
  }

  // Cleanup on unmount
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
        className="overflow-hidden"
        onMouseEnter={handleCalMouseEnter}
        onMouseLeave={handleCalMouseLeave}
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
    </div>
  )
}

export default CalendarWidget
