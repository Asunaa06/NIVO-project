"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Map, BookOpen, CalendarDays, ChartColumn, Settings } from "lucide-react"

const navItems = [
  {
    label: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "المدينة",
    href: "/city",
    icon: Map,
  },
  {
    label: "الدرس",
    href: "/lesson",
    icon: BookOpen,
  },
  {
    label: "المُنظّم",
    href: "/planner",
    icon: CalendarDays,
  },
  {
    label: "إحصائيات",
    href: "/statistics",
    icon: ChartColumn,
  },
  {
    label: "إعدادات",
    href: "/settings",
    icon: Settings,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden items-center justify-around border-t border-[#e8dccb] bg-white px-2 py-2 shadow-lg shadow-black/5"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold transition ${
              isActive
                ? "text-[#d9752e]"
                : "text-[#6f6559] hover:text-[#242b38]"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}