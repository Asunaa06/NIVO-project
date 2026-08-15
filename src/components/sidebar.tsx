"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Map, BookOpen, CalendarDays, ChartColumn, LogOut, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  {
    label: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "مدينة المواد",
    href: "/city",
    icon: Map,
  },
  {
    label: "غرفة الدرس",
    href: "/lesson",
    icon: BookOpen,
  },
  {
    label: "المُنظّم",
    href: "/planner",
    icon: CalendarDays,
  },
  {
    label: "الإحصائيات",
    href: "/statistics",
    icon: ChartColumn,
  },
  {
    label: "الإعدادات",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside
      dir="rtl"
      className="fixed right-0 top-0 z-40 hidden h-screen w-64 flex-col border-l border-[#e8dccb] bg-white shadow-lg lg:flex"
    >
      {/* Logo */}
      <div className="border-b border-[#e8dccb] px-6 py-5">
        <Link href="/dashboard" className="text-2xl font-black text-[#242b38]">
          Nivo
        </Link>
        <p className="mt-1 text-xs text-[#6f6559]">منصة التعليم الذكية</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-[#fff0e6] text-[#d9752e]"
                  : "text-[#6f6559] hover:bg-[#fffaf4]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-[#e8dccb] px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-[#e8dccb] bg-white px-4 py-3 text-sm font-bold text-[#d9752e] transition hover:bg-[#fff0e6]"
        >
          <LogOut className="h-5 w-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}