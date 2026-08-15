"use client"

import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { usePathname } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // الصفحات التي لا تحتاج sidebar و bottom nav
  const hideNavigation = pathname === "/" || pathname === "/login"

  return (
    <html
      lang="ar"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fcf5ee]">
        {!hideNavigation && <Sidebar />}
        <main className={!hideNavigation ? "lg:mr-64 lg:pb-0 pb-20" : ""}>
          {children}
        </main>
        {!hideNavigation && <BottomNav />}
      </body>
    </html>
  )
}
