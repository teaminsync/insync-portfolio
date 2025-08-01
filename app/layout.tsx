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

        {/* Critical preconnects - these domains are used immediately */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="preconnect" href="https://lottie.host" crossOrigin="" />

        {/* Secondary preconnects - these domains are used later but still important */}
        <link rel="preconnect" href="https://cal.com" />
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* DNS prefetch for additional performance - lower priority */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://unpkg.com" />

        {/* Preload critical above-the-fold resources */}
        <link
          rel="preload"
          href="https://lottie.host/06e2f5f0-132f-4bee-a89e-ca0e761845c6/FIkhPQ1o6O.lottie"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* Resource hints for better loading */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#F9F4EB" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ScrollRestoration />
        <SmoothScroll>
          <CursorProvider>{children}</CursorProvider>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  )
}