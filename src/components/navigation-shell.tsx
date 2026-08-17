"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavigation =
    ["/", "/login", "/subscription", "/lesson", "/focus"].includes(pathname) ||
    pathname.startsWith("/subjects/") ||
    pathname.startsWith("/subject/")

  return (
    <>
      {!hideNavigation && <Sidebar />}
      <main className={!hideNavigation ? "lg:mr-64 lg:pb-0 pb-20" : ""}>{children}</main>
      {!hideNavigation && <BottomNav />}
    </>
  )
}
