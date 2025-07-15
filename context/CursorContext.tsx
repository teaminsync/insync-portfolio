"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CursorContextType {
  isInteractiveElementHovered: boolean
  setIsInteractiveElementHovered: (hovered: boolean) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isInteractiveElementHovered, setIsInteractiveElementHovered] = useState(false)

  return (
    <CursorContext.Provider value={{ isInteractiveElementHovered, setIsInteractiveElementHovered }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursorContext = () => {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error("useCursorContext must be used within a CursorProvider")
  }
  return context
}
