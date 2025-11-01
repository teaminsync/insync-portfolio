// Facebook Pixel utility functions for tracking events
// Uses environment variable NEXT_PUBLIC_FACEBOOK_PIXEL_ID

declare global {
  interface Window {
    fbq?: (command: string, event: string, data?: Record<string, any>) => void
    _fbq?: any
  }
}

let pixelInitialized = false

/**
 * Initialize Facebook Pixel on the page
 * Should be called once in layout or root component
 */
export function fbqInit() {
  if (pixelInitialized || typeof window === "undefined") {
    return
  }

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  if (!pixelId) {
    console.warn("[v0] Facebook Pixel ID not configured. Set NEXT_PUBLIC_FACEBOOK_PIXEL_ID environment variable.")
    return
  }

  if (window.fbq) {
    pixelInitialized = true
    return
  }

  // Create the fbq queue function
  const fbq = (...args: any[]) => {
    if ((fbq as any).callMethod) {
      ;(fbq as any).callMethod.apply(fbq, args)
    } else {
      ;(fbq as any).queue.push(args)
    }
  }

  // Initialize fbq properties
  ;(fbq as any).push = fbq
  ;(fbq as any).loaded = true
  ;(fbq as any).version = "2.0"
  ;(fbq as any).queue = []
  ;(window as any).fbq = fbq

  // Create and inject the script tag
  const script = document.createElement("script")
  script.async = true
  script.src = "https://connect.facebook.net/en_US/fbevents.js"

  const firstScript = document.getElementsByTagName("script")[0]
  firstScript.parentNode?.insertBefore(script, firstScript)

  // Initialize the pixel
  ;(window as any).fbq("init", pixelId)
  ;(window as any).fbq("track", "PageView")
  ;(window as any).fbq("consent", "grant")

  pixelInitialized = true
}

/**
 * Track a custom event with Facebook Pixel
 * @param eventName - The name of the event to track
 * @param params - Optional event parameters (e.g., { value: 100, currency: 'USD' })
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || !window.fbq) {
    return
  }

  try {
    window.fbq("track", eventName, params || {})
  } catch (error) {
    console.error("[v0] Error tracking Facebook Pixel event:", error)
  }
}

/**
 * Track PageView event (useful for route changes in Next.js)
 */
export function trackPageView() {
  if (typeof window === "undefined" || !window.fbq) {
    return
  }

  try {
    window.fbq("track", "PageView")
  } catch (error) {
    console.error("[v0] Error tracking PageView:", error)
  }
}
