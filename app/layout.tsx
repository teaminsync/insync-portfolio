import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SmoothScroll from "@/components/smooth-scroll"
import ScrollRestoration from "@/components/scroll-restoration"
import { Toaster } from "@/components/ui/toaster"
import { CursorProvider } from "@/context/CursorContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InSync Solutions - Digital Innovation & Strategy",
  description:
    "Strategy-led. Result-focused. Always in sync with your vision. Comprehensive digital solutions crafted with precision and creativity.",
  keywords: "web development, video production, content strategy, digital solutions, branding",
  authors: [{ name: "InSync Solutions" }],
  openGraph: {
    title: "InSync Solutions - Digital Innovation & Strategy",
    description: "Strategy-led. Result-focused. Always in sync with your vision.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ScrollRestoration />
        <SmoothScroll>
          <CursorProvider>
            {" "}
            {/* Wrap children with CursorProvider */}
            {children}
          </CursorProvider>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  )
}