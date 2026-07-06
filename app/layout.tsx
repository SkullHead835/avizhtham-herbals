import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ShopProvider } from "@/components/shop-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "Avizhtham Herbal's Clinic | Natural Herbal Wellness Solutions",
  description:
    "Experience natural healing through traditional herbal care. Premium quality ayurvedic and herbal products for wellness and health. Pure herbs, powerful benefits, natural healing.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <ShopProvider>
          {children}
          <Toaster position="top-right" />
        </ShopProvider>
        <Analytics />
      </body>
    </html>
  )
}
