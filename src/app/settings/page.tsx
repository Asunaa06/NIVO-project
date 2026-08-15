"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ChevronLeft, Globe, Lock, LogOut, Palette, Sun } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState<"ar" | "fr">("ar")

  useEffect(() => {
    const supabase = createClient()

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setLoading(false)
    }

    void checkAuth()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-lg font-black text-[#242b38]">جاري تحميل الإعدادات...</p>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] text-[#242b38]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <Link href="/city" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#d9752e] text-lg font-black text-white">N</span>
            <span className="text-xl font-black tracking-tight">Nivo</span>
          </Link>
          <p className="hidden text-sm font-medium text-[#6f6559] sm:block">التعلم الذكي يبدأ من هنا</p>
        </header>

        <h1 className="text-2xl font-black">الإعدادات</h1>
        <p className="mt-1 text-sm text-[#6f6559]">تحكم في تجربتك على منصة Nivo</p>

        {/* Appearance */}
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-black text-[#6f6559]">
            <Palette className="size-4" />
            المظهر
          </h2>
          <div className="rounded-3xl border border-[#e8dccb] bg-white p-2">
            <div className="flex items-center gap-3 rounded-2xl p-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f3e9dd] text-[#6f6559]">
                <Sun className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">الوضع الداكن</p>
                <p className="text-xs text-[#6f6559]">بدّل بين المظهر الفاتح والداكن</p>
              </div>
              <button
                role="switch"
                aria-checked={darkMode}
                aria-label="الوضع الداكن"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  darkMode ? "bg-[#d9752e]" : "bg-[#6f6559]/30"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
                    darkMode ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-black text-[#6f6559]">
            <Globe className="size-4" />
            اللغة
          </h2>
          <div className="rounded-3xl border border-[#e8dccb] bg-white p-2">
            <div className="flex items-center gap-3 rounded-2xl p-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f3e9dd] text-[#6f6559]">
                <Globe className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">لغة الواجهة</p>
                <p className="text-xs text-[#6f6559]">اختر لغة عرض المنصة</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("ar")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                    language === "ar"
                      ? "bg-[#d9752e] text-white"
                      : "bg-[#f3e9dd] text-[#6f6559]"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLanguage("fr")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                    language === "fr"
                      ? "bg-[#d9752e] text-white"
                      : "bg-[#f3e9dd] text-[#6f6559]"
                  }`}
                >
                  Français
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-black text-[#6f6559]">
            <Bell className="size-4" />
            الإشعارات
          </h2>
          <div className="rounded-3xl border border-[#e8dccb] bg-white p-2">
            <div className="flex items-center gap-3 rounded-2xl p-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f3e9dd] text-[#6f6559]">
                <Bell className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">تذكيرات المراجعة</p>
                <p className="text-xs text-[#6f6559]">إشعار عند حلول موعد مراجعة درس</p>
              </div>
              <button
                role="switch"
                aria-checked={notifications}
                aria-label="الإشعارات"
                onClick={() => setNotifications(!notifications)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  notifications ? "bg-[#d9752e]" : "bg-[#6f6559]/30"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
                    notifications ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-black text-[#6f6559]">
            <Lock className="size-4" />
            الأمان
          </h2>
          <div className="rounded-3xl border border-[#e8dccb] bg-white p-2">
            <button className="flex w-full items-center gap-3 rounded-2xl p-3 text-right transition-colors hover:bg-[#f3e9dd]/60">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f3e9dd] text-[#6f6559]">
                <Lock className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">تغيير كلمة المرور</span>
                <span className="block text-xs text-[#6f6559]">حدّث كلمة المرور الخاصة بك</span>
              </span>
              <ChevronLeft className="size-5 text-[#6f6559] transition-transform" />
            </button>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ef4444]/30 bg-[#ef4444]/5 py-3.5 text-sm font-bold text-[#ef4444] transition-colors hover:bg-[#ef4444]/10"
        >
          <LogOut className="size-5" />
          تسجيل الخروج
        </button>

        <p className="mt-6 text-center text-xs text-[#6f6559]">Nivo · الإصدار 1.0.0</p>
      </div>
    </main>
  )
}