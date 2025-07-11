"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const hamburgerRef = useRef<HTMLDivElement>(null)
  const mobileHamburgerRef = useRef<HTMLDivElement>(null) // Separate ref for mobile

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 50)

      // Only update clip paths when menu is closed
      if (!isOpen) {
        updateClipPaths()
      }
    }

    const updateClipPaths = () => {
      // Include all dark sections
      const darkSections = document.querySelectorAll("#about, #portfolio, #process, footer")

      // Update logo clip path
      if (logoRef.current) {
        updateElementClipPath(logoRef.current, darkSections)
      }

      // Update desktop hamburger menu clip path (only when scrolled)
      if (hamburgerRef.current && scrolled) {
        updateElementClipPath(hamburgerRef.current, darkSections)
      }

      // Update mobile hamburger menu clip path (always)
      if (mobileHamburgerRef.current) {
        updateElementClipPath(mobileHamburgerRef.current, darkSections)
      }
    }

    const updateElementClipPath = (element: HTMLElement, darkSections: NodeListOf<Element>) => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementBottom = rect.bottom

      let whiteRanges: Array<[number, number]> = []

      // Start with the full element as white
      let currentWhiteStart = 0
      let currentWhiteEnd = rect.height

      darkSections.forEach((section) => {
        const sectionRect = section.getBoundingClientRect()
        const sectionTop = sectionRect.top
        const sectionBottom = sectionRect.bottom

        // Check if dark section intersects with element
        if (sectionTop < elementBottom && sectionBottom > elementTop) {
          // Calculate intersection relative to element
          const intersectionStart = Math.max(0, sectionTop - elementTop)
          const intersectionEnd = Math.min(rect.height, sectionBottom - elementTop)

          // Remove the dark area from white ranges
          if (intersectionStart <= currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
            // Dark section covers entire element
            whiteRanges = []
            currentWhiteStart = currentWhiteEnd = -1
          } else if (intersectionStart <= currentWhiteStart && intersectionEnd < currentWhiteEnd) {
            // Dark section covers top part
            currentWhiteStart = intersectionEnd
          } else if (intersectionStart > currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
            // Dark section covers bottom part
            currentWhiteEnd = intersectionStart
          } else if (intersectionStart > currentWhiteStart && intersectionEnd < currentWhiteEnd) {
            // Dark section is in the middle
            whiteRanges.push([currentWhiteStart, intersectionStart])
            currentWhiteStart = intersectionEnd
          }
        }
      })

      // Add remaining white range if valid
      if (currentWhiteStart < currentWhiteEnd && currentWhiteStart !== -1) {
        whiteRanges.push([currentWhiteStart, currentWhiteEnd])
      }

      // Create clip path for white text
      let whiteClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
      if (whiteRanges.length > 0) {
        const polygons = whiteRanges
          .map(([start, end]) => {
            const startPercent = (start / rect.height) * 100
            const endPercent = (end / rect.height) * 100
            return `0% ${startPercent}%, 100% ${startPercent}%, 100% ${endPercent}%, 0% ${endPercent}%`
          })
          .join(", ")
        whiteClipPath = `polygon(${polygons})`
      }

      // Create clip path for black text (inverse of white)
      let blackClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      if (whiteRanges.length > 0) {
        // For simplicity, we'll use the complement approach
        if (whiteRanges.length === 1) {
          const [start, end] = whiteRanges[0]
          const startPercent = (start / rect.height) * 100
          const endPercent = (end / rect.height) * 100

          if (start > 0 && end < rect.height) {
            // White section is in middle, so black is top and bottom
            blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%, 0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
          } else if (start === 0) {
            // White section is at top, black is at bottom
            blackClipPath = `polygon(0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
          } else if (end === rect.height) {
            // White section is at bottom, black is at top
            blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%)`
          }
        } else {
          // Multiple white ranges - use full black as fallback
          blackClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
        }
      }

      // Apply clip paths to white and black text layers
      const whiteLayer = element.querySelector(".text-white-layer") as HTMLElement
      const blackLayer = element.querySelector(".text-black-layer") as HTMLElement

      if (whiteLayer) {
        whiteLayer.style.clipPath = blackClipPath // White text shows where it should be white
      }
      if (blackLayer) {
        blackLayer.style.clipPath = whiteClipPath // Black text shows where it should be black
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", () => {
      if (!isOpen) {
        updateClipPaths()
      }
    })

    // Initial update only if menu is closed
    if (!isOpen) {
      updateClipPaths()
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateClipPaths)
    }
  }, [scrolled, isOpen])

  // Effect to handle menu open/close clip path changes
  useEffect(() => {
    if (isOpen) {
      // When menu opens, force white text to be visible for all elements
      const logoWhiteLayer = logoRef.current?.querySelector(".text-white-layer") as HTMLElement
      const logoBlackLayer = logoRef.current?.querySelector(".text-black-layer") as HTMLElement
      const hamburgerWhiteLayer = hamburgerRef.current?.querySelector(".text-white-layer") as HTMLElement
      const hamburgerBlackLayer = hamburgerRef.current?.querySelector(".text-black-layer") as HTMLElement
      const mobileHamburgerWhiteLayer = mobileHamburgerRef.current?.querySelector(".text-white-layer") as HTMLElement
      const mobileHamburgerBlackLayer = mobileHamburgerRef.current?.querySelector(".text-black-layer") as HTMLElement

      if (logoWhiteLayer) logoWhiteLayer.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      if (logoBlackLayer) logoBlackLayer.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
      if (hamburgerWhiteLayer) hamburgerWhiteLayer.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      if (hamburgerBlackLayer) hamburgerBlackLayer.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
      if (mobileHamburgerWhiteLayer)
        mobileHamburgerWhiteLayer.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      if (mobileHamburgerBlackLayer) mobileHamburgerBlackLayer.style.clipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
    } else {
      // When menu closes, restore normal clip path behavior
      setTimeout(() => {
        const darkSections = document.querySelectorAll("#about, #portfolio, #process, footer")
        if (logoRef.current) {
          updateElementClipPath(logoRef.current, darkSections)
        }
        if (hamburgerRef.current && scrolled) {
          updateElementClipPath(hamburgerRef.current, darkSections)
        }
        if (mobileHamburgerRef.current) {
          updateElementClipPath(mobileHamburgerRef.current, darkSections)
        }
      }, 100)
    }

    const updateElementClipPath = (element: HTMLElement, darkSections: NodeListOf<Element>) => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementBottom = rect.bottom

      let whiteRanges: Array<[number, number]> = []

      // Start with the full element as white
      let currentWhiteStart = 0
      let currentWhiteEnd = rect.height

      darkSections.forEach((section) => {
        const sectionRect = section.getBoundingClientRect()
        const sectionTop = sectionRect.top
        const sectionBottom = sectionRect.bottom

        // Check if dark section intersects with element
        if (sectionTop < elementBottom && sectionBottom > elementTop) {
          // Calculate intersection relative to element
          const intersectionStart = Math.max(0, sectionTop - elementTop)
          const intersectionEnd = Math.min(rect.height, sectionBottom - elementTop)

          // Remove the dark area from white ranges
          if (intersectionStart <= currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
            // Dark section covers entire element
            whiteRanges = []
            currentWhiteStart = currentWhiteEnd = -1
          } else if (intersectionStart <= currentWhiteStart && intersectionEnd < currentWhiteEnd) {
            // Dark section covers top part
            currentWhiteStart = intersectionEnd
          } else if (intersectionStart > currentWhiteStart && intersectionEnd >= currentWhiteEnd) {
            // Dark section covers bottom part
            currentWhiteEnd = intersectionStart
          } else if (intersectionStart > currentWhiteStart && intersectionEnd < currentWhiteEnd) {
            // Dark section is in the middle
            whiteRanges.push([currentWhiteStart, intersectionStart])
            currentWhiteStart = intersectionEnd
          }
        }
      })

      // Add remaining white range if valid
      if (currentWhiteStart < currentWhiteEnd && currentWhiteStart !== -1) {
        whiteRanges.push([currentWhiteStart, currentWhiteEnd])
      }

      // Create clip path for white text
      let whiteClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
      if (whiteRanges.length > 0) {
        const polygons = whiteRanges
          .map(([start, end]) => {
            const startPercent = (start / rect.height) * 100
            const endPercent = (end / rect.height) * 100
            return `0% ${startPercent}%, 100% ${startPercent}%, 100% ${endPercent}%, 0% ${endPercent}%`
          })
          .join(", ")
        whiteClipPath = `polygon(${polygons})`
      }

      // Create clip path for black text (inverse of white)
      let blackClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      if (whiteRanges.length > 0) {
        // For simplicity, we'll use the complement approach
        if (whiteRanges.length === 1) {
          const [start, end] = whiteRanges[0]
          const startPercent = (start / rect.height) * 100
          const endPercent = (end / rect.height) * 100

          if (start > 0 && end < rect.height) {
            // White section is in middle, so black is top and bottom
            blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%, 0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
          } else if (start === 0) {
            // White section is at top, black is at bottom
            blackClipPath = `polygon(0% ${endPercent}%, 100% ${endPercent}%, 100% 100%, 0% 100%)`
          } else if (end === rect.height) {
            // White section is at bottom, black is at top
            blackClipPath = `polygon(0% 0%, 100% 0%, 100% ${startPercent}%, 0% ${startPercent}%)`
          }
        } else {
          // Multiple white ranges - use full black as fallback
          blackClipPath = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
        }
      }

      // Apply clip paths to white and black text layers
      const whiteLayer = element.querySelector(".text-white-layer") as HTMLElement
      const blackLayer = element.querySelector(".text-black-layer") as HTMLElement

      if (whiteLayer) {
        whiteLayer.style.clipPath = blackClipPath // White text shows where it should be white
      }
      if (blackLayer) {
        blackLayer.style.clipPath = whiteClipPath // Black text shows where it should be black
      }
    }
  }, [isOpen, scrolled])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <>
      {/* Fixed Navigation Items - Right Side with Responsive Positioning */}
      <div className="fixed top-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 md:pt-8 lg:pt-12 xl:pt-16 flex items-start">
        {/* Desktop Navigation - Show full menu when not scrolled, hamburger when scrolled */}
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
              {/* Black hamburger layer */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-black-layer absolute inset-0 flex items-center justify-center text-black"
              >
                {isOpen ? (
                  <X size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                ) : (
                  <Menu size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                )}
              </motion.button>

              {/* White hamburger layer */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-white-layer absolute inset-0 flex items-center justify-center text-white"
              >
                {isOpen ? (
                  <X size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                ) : (
                  <Menu size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                )}
              </motion.button>

              {/* Invisible base layer */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center opacity-0"
              >
                {isOpen ? (
                  <X size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                ) : (
                  <Menu size={28} className="sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile/Tablet Menu Button - Always visible on mobile and tablet with color-changing */}
        <motion.div className="lg:hidden relative" ref={mobileHamburgerRef}>
          {/* Black hamburger layer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-black-layer absolute inset-0 flex items-center justify-center text-black touch-manipulation"
          >
            {isOpen ? (
              <X size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            ) : (
              <Menu size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            )}
          </motion.button>

          {/* White hamburger layer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-white-layer absolute inset-0 flex items-center justify-center text-white touch-manipulation"
          >
            {isOpen ? (
              <X size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            ) : (
              <Menu size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            )}
          </motion.button>

          {/* Invisible base layer for layout */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center opacity-0 touch-manipulation"
          >
            {isOpen ? (
              <X size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            ) : (
              <Menu size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Scrolling Logo - Left Side with Responsive Positioning */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 z-50 px-6 sm:px-7 md:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-7 md:pt-8 lg:pt-12 xl:pt-16"
      >
        <motion.a
          href="#home"
          ref={logoRef}
          whileHover={{ scale: 1.05 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-tight relative block"
        >
          {/* Black logo layer */}
          <div className="text-black-layer absolute inset-0 text-black">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1, // Keep opacity at 1 always
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                solutions
              </motion.span>
              <motion.span>.</motion.span>
            </div>
          </div>

          {/* White logo layer */}
          <div className="text-white-layer absolute inset-0 text-white">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1, // Keep opacity at 1 always
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                solutions
              </motion.span>
              <motion.span>.</motion.span>
            </div>
          </div>

          {/* Invisible base layer for layout */}
          <div className="opacity-0">
            <div className="flex items-center">
              <span>insync</span>
              <motion.span
                animate={{
                  width: scrolled ? 0 : "auto",
                  marginLeft: scrolled ? 0 : "0.25rem",
                  opacity: 1, // Keep opacity at 1 always
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

      {/* Mobile/Hamburger Menu with Responsive Design */}
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
