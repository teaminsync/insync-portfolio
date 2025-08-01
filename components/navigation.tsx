"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

// Throttle utility function
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const logoRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef = useRef<HTMLDivElement>(null)
  const mobileHamburgerRef = useRef<HTMLDivElement>(null)

  // Memoized dark sections selector
  const darkSectionsSelector = useMemo(() => "#about, #portfolio, #process, footer", [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Memoized clip path update function
  const updateElementClipPath = useCallback((element: HTMLElement, darkSections: NodeListOf<Element>) => {
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top
    const elementBottom = rect.bottom

    let whiteRanges: Array<[number, number]> = []
    let currentWhiteStart = 0
    let currentWhiteEnd = rect.height

    darkSections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect()
      const sectionTop = sectionRect.top
      const sectionBottom = sectionRect.bottom

      if (sectionTop < elementBottom && sectionBottom > elementTop) {
        const intersectionStart = Math.max(0, sectionTop - elementTop)
        const intersectionEnd = Math.min(rect.height, sectionBottom - elementTop)

        if (intersectionStart <= currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
          whiteRanges = []
          currentWhiteStart = currentWhiteEnd = -1
        } else if (intersectionStart <= currentWhiteStart && intersectionEnd < currentWhiteEnd) {
          currentWhiteStart = intersectionEnd
        } else if (intersectionStart > currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
          currentWhiteEnd = intersectionStart
        } else if (intersectionStart > currentWhiteStart && intersectionEnd < currentWhiteEnd) {
          whiteRanges.push([currentWhiteStart, intersectionStart])
          currentWhiteStart = intersectionEnd
        }
      }
    })

    if (currentWhiteStart < currentWhiteEnd && currentWhiteStart !== -1) {
      whiteRanges.push([currentWhiteStart, currentWhiteEnd])
    }

    // Create clip paths
    let whiteClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
    let blackClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

    if (whiteRanges.length > 0) {
      const polygons = whiteRanges
        .map(([start, end]) => {
          const startPercent = (start / rect.height) * 100
          const endPercent = (end / rect.height) * 100
          return `0% ${startPercent}%, 100% ${startPercent}%, 100% ${endPercent}%, 0% ${endPercent}%`
        })
        .join(", ")
      whiteClipPath = `polygon(${polygons})`

      if (whiteRanges.length === 1) {
        const [start, end] = whiteRanges[0]
        const startPercent = (start / rect.height) * 100
        const endPercent = (end / rect.height) * 100

        if (start > 0 && end < rect.height) {
          blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%, 0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
        } else if (start === 0) {
          blackClipPath = `polygon(0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
        } else if (end === rect.height) {
          blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%)`
        }
      } else {
        blackClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
      }
    }

    // Apply clip paths
    const whiteLayer = element.querySelector(".text-white-layer") as HTMLElement
    const blackLayer = element.querySelector(".text-black-layer") as HTMLElement

    if (whiteLayer) whiteLayer.style.clipPath = blackClipPath
    if (blackLayer) blackLayer.style.clipPath = whiteClipPath
  }, [])

  // Memoized update function for all elements
  const updateAllClipPaths = useCallback(() => {
    if (!isMounted) return

    const darkSections = document.querySelectorAll(darkSectionsSelector)

    if (logoRef.current) {
      updateElementClipPath(logoRef.current, darkSections)
    }

    if (hamburgerRef.current && scrolled) {
      updateElementClipPath(hamburgerRef.current, darkSections)
    }

    if (mobileHamburgerRef.current) {
      updateElementClipPath(mobileHamburgerRef.current, darkSections)
    }
  }, [isMounted, scrolled, updateElementClipPath, darkSectionsSelector])

  // Throttled scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 50)

      if (!isOpen) {
        updateAllClipPaths()
      }
    }, 16), // ~60fps
    [isOpen, updateAllClipPaths],
  )

  // Throttled resize handler
  const handleResize = useCallback(
    throttle(() => {
      if (!isOpen) {
        updateAllClipPaths()
      }
    }, 100),
    [isOpen, updateAllClipPaths],
  )

  useEffect(() => {
    if (!isMounted) return

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    // Initial update
    if (!isOpen) {
      updateAllClipPaths()
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [isMounted, isOpen, handleScroll, handleResize, updateAllClipPaths])

  // Handle menu open/close clip path changes
  useEffect(() => {
    if (!isMounted) return

    const setClipPath = (element: HTMLElement | null, whiteClip: string, blackClip: string) => {
      if (!element) return
      const whiteLayer = element.querySelector(".text-white-layer") as HTMLElement
      const blackLayer = element.querySelector(".text-black-layer") as HTMLElement
      if (whiteLayer) whiteLayer.style.clipPath = whiteClip
      if (blackLayer) blackLayer.style.clipPath = blackClip
    }

    if (isOpen) {
      // Force white text when menu is open
      const fullClip = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      const emptyClip = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"

      setClipPath(logoRef.current, fullClip, emptyClip)
      setClipPath(hamburgerRef.current, fullClip, emptyClip)
      setClipPath(mobileHamburgerRef.current, fullClip, emptyClip)
    } else {
      // Restore normal behavior after a brief delay
      setTimeout(updateAllClipPaths, 100)
    }
  }, [isOpen, isMounted, updateAllClipPaths])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ]

  if (!isMounted) {
    return null // Prevent hydration issues
  }

  return (
    <>
      {/* Fixed Navigation Items - Right Side */}
      <div className="fixed top-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 md:pt-8 lg:pt-12 xl:pt-16 flex items-start">
        <AnimatePresence mode="wait">
          {!scrolled ? (
            <motion.div
              key="full-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex items-center space-x-6 xl:space-x-10"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative text-sm lg:text-base font-medium tracking-wide transition-colors text-black"
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="hamburger-menu"
              ref={hamburgerRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block relative"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-black-layer absolute inset-0 flex items-center justify-center text-black"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-white-layer absolute inset-0 flex items-center justify-center text-white"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center opacity-0"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile/Tablet Menu Button */}
        <motion.div className="lg:hidden relative" ref={mobileHamburgerRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-black-layer absolute inset-0 flex items-center justify-center text-black touch-manipulation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-white-layer absolute inset-0 flex items-center justify-center text-white touch-manipulation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center opacity-0 touch-manipulation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </motion.div>
      </div>

      {/* Scrolling Logo - Left Side */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 z-50 px-6 sm:px-7 md:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-7 md:pt-8 lg:pt-12 xl:pt-16"
      >
        <motion.a
          href="#"
          ref={logoRef}
          whileHover={{ scale: 1.05 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-tight relative block"
        >
          <div className="text-black-layer absolute inset-0 text-black">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                solutions
              </motion.span>
              <motion.span>.</motion.span>
            </div>
          </div>
          <div className="text-white-layer absolute inset-0 text-white">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                solutions
              </motion.span>
              <motion.span>.</motion.span>
            </div>
          </div>
          <div className="opacity-0">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                solutions
              </motion.span>
              <motion.span>.</motion.span>
            </div>
          </div>
        </motion.a>
      </motion.nav>

      {/* Mobile/Hamburger Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 sm:space-y-10 md:space-y-12 px-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white touch-manipulation"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
