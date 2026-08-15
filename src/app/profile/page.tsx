"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Award, Flame, GraduationCap, Pencil, Target, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// بيانات تجريبية
const BADGES = [
  { name: "أول 10 دروس", icon: GraduationCap, earned: true },
  { name: "سلسلة 7 أيام", icon: Flame, earned: true },
  { name: "مادة متقنة", icon: Trophy, earned: true },
  { name: "شهر كامل", icon: Award, earned: false },
]

const SUBJECT_MASTERY = [
  { name: "التسيير المحاسبي والمالي", value: 63, color: "#d9752e" },
  { name: "الاقتصاد والمناجمنت", value: 55, color: "#2f9e6b" },
  { name: "الرياضيات", value: 32, color: "#3b82f6" },
  { name: "القانون", value: 100, color: "#242b38" },
  { name: "اللغة العربية", value: 33, color: "#e0a458" },
  { name: "اللغة الفرنسية", value: 21, color: "#6366f1" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-lg font-black text-[#242b38]">جاري تحميل الملف الشخصي...</p>
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

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">الملف الشخصي</h1>
          <button className="flex items-center gap-2 rounded-xl bg-[#242b38] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90">
            <Pencil className="size-4" />
            تعديل
          </button>
        </div>

        {/* Profile Card */}
        <section className="mt-5 rounded-3xl border border-[#e8dccb] bg-white p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-3xl bg-[#d9752e] text-4xl font-black text-white">
                أ
              </div>
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h2 className="text-xl font-black">أمين بن يوسف</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-[#f3e9dd] px-3 py-1 text-xs font-bold text-[#6f6559]">تسيير واقتصاد</span>
                <span className="rounded-full bg-[#8b5cf6]/10 px-3 py-1 text-xs font-bold text-[#8b5cf6]">بكالوريا 2027</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f3e9dd]/50 p-4">
              <p className="mb-2 text-xs font-bold text-[#6f6559]">الجنس</p>
              <p className="text-base font-black">ذكر</p>
            </div>
            <div className="rounded-2xl bg-[#f3e9dd]/50 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#6f6559]">
                <Target className="size-3.5" />
                المعدل المستهدف
              </div>
              <p className="text-base font-black text-[#d9752e]">17.0 / 20</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-4 text-center">
            <div className="flex items-center justify-center text-[#d9752e]">
              <GraduationCap className="size-4" />
            </div>
            <p className="mt-1 text-xl font-black tabular-nums">92</p>
            <p className="text-xs text-[#6f6559]">دروس مكتملة</p>
          </div>
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-4 text-center">
            <div className="flex items-center justify-center text-[#d9752e]">
              <Flame className="size-4" />
            </div>
            <p className="mt-1 text-xl font-black tabular-nums">7</p>
            <p className="text-xs text-[#6f6559]">سلسلة أيام</p>
          </div>
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-4 text-center">
            <div className="flex items-center justify-center text-[#d9752e]">
              <Trophy className="size-4" />
            </div>
            <p className="mt-1 text-xl font-black tabular-nums">51%</p>
            <p className="text-xs text-[#6f6559]">التقدم العام</p>
          </div>
        </section>

        {/* Badges */}
        <section className="mt-5 rounded-3xl border border-[#e8dccb] bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-black">
            <Award className="size-5 text-[#d9752e]" />
            الشارات
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.name}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${
                    badge.earned
                      ? "border-[#d9752e]/30 bg-[#d9752e]/5"
                      : "border-[#e8dccb] bg-[#f3e9dd]/40 opacity-50"
                  }`}
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-full ${
                      badge.earned
                        ? "bg-[#d9752e] text-white"
                        : "bg-[#f3e9dd] text-[#6f6559]"
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-bold">{badge.name}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Subject Mastery */}
        <section className="mt-5 rounded-3xl border border-[#e8dccb] bg-white p-5">
          <h3 className="mb-4 font-black">إتقان المواد</h3>
          <div className="space-y-3">
            {SUBJECT_MASTERY.map((subject) => (
              <div key={subject.name} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm font-bold">{subject.name}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#f3e9dd]">
                  <div
                    className="absolute inset-y-0 right-0 rounded-full"
                    style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                  />
                </div>
                <span className="w-10 text-left text-xs font-bold tabular-nums text-[#6f6559]">
                  {subject.value}%
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}