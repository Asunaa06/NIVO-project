"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookCheck, Flame, Target, TrendingDown, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// بيانات تجريبية
const SUBJECT_PROGRESS = [
  { name: "الرياضيات", value: 72, color: "#d9752e" },
  { name: "الفيزياء", value: 55, color: "#1f9d61" },
  { name: "الكيمياء", value: 48, color: "#8b5cf6" },
  { name: "اللغة العربية", value: 80, color: "#f59e0b" },
  { name: "اللغة الفرنسية", value: 45, color: "#ef4444" },
  { name: "التاريخ", value: 60, color: "#0ea5e9" },
]

const TIME_DISTRIBUTION = [
  { name: "الرياضيات", value: 35, color: "#d9752e" },
  { name: "الفيزياء", value: 20, color: "#1f9d61" },
  { name: "اللغة العربية", value: 15, color: "#f59e0b" },
  { name: "اللغة الفرنسية", value: 10, color: "#ef4444" },
  { name: "أخرى", value: 20, color: "#8b5cf6" },
]

const WEEKLY_LEVELS = [
  { week: "أ1", value: 1 },
  { week: "أ2", value: 2 },
  { week: "أ3", value: 2 },
  { week: "أ4", value: 3 },
  { week: "أ5", value: 3 },
  { week: "أ6", value: 4 },
  { week: "أ7", value: 4 },
  { week: "أ8", value: 5 },
]

const STRENGTHS = [
  { name: "اللغة العربية", value: 80 },
  { name: "الرياضيات", value: 72 },
]

const WEAKNESSES = [
  { name: "القانون", value: 38 },
  { name: "اللغة الفرنسية", value: 45 },
]

export default function StatisticsPage() {
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
        <p className="text-lg font-black text-[#242b38]">جاري تحميل الإحصائيات...</p>
      </main>
    )
  }

  const maxTimeValue = Math.max(...TIME_DISTRIBUTION.map((t) => t.value))
  const maxLevel = Math.max(...WEEKLY_LEVELS.map((w) => w.value))

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] text-[#242b38]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-black sm:text-3xl">الإحصائيات و التحليل</h1>
          <p className="mt-1 text-sm text-[#6f6559]">تابع تقدمك و اكتشف نقاط قوتك و ضعفك</p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl border border-[#e8dccb] bg-white p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9752e]/15 text-[#d9752e]">
              <BookCheck className="size-6" />
            </span>
            <div>
              <p className="text-2xl font-black">48</p>
              <p className="text-sm text-[#6f6559]">دروس مكتملة</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-[#e8dccb] bg-white p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9752e]/15 text-[#d9752e]">
              <Flame className="size-6" />
            </span>
            <div>
              <p className="text-2xl font-black">12</p>
              <p className="text-sm text-[#6f6559]">أيام متتالية</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-[#e8dccb] bg-white p-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9752e]/15 text-[#d9752e]">
              <Target className="size-6" />
            </span>
            <div>
              <p className="text-2xl font-black">17/20</p>
              <p className="text-sm text-[#6f6559]">المعدل المستهدف</p>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Subject Progress */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <h2 className="mb-4 text-lg font-black">نسبة الإنجاز في كل مادة</h2>
            <div className="space-y-4">
              {SUBJECT_PROGRESS.map((subject) => (
                <div key={subject.name}>
                  <div className="mb-1 flex items-center justify-between text-sm font-medium">
                    <span>{subject.name}</span>
                    <span className="font-bold">{subject.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e9dd]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${subject.value}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Time Distribution */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <h2 className="mb-4 text-lg font-black">توزيع وقت الدراسة</h2>
            <div className="flex h-[280px] items-end justify-around gap-3 px-2">
              {TIME_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-sm font-black">{item.value}%</span>
                  <div
                    className="w-full rounded-t-xl transition-all"
                    style={{
                      height: `${(item.value / maxTimeValue) * 200}px`,
                      backgroundColor: item.color,
                    }}
                  />
                  <span className="text-xs font-medium text-[#6f6559]">{item.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Weekly Evolution */}
        <section className="mt-5 rounded-3xl border border-[#e8dccb] bg-white p-6">
          <h2 className="mb-4 text-lg font-black">تطوّر المستوى عبر الأسابيع</h2>
          <div className="flex h-[200px] items-end justify-around gap-2 px-2">
            {WEEKLY_LEVELS.map((week) => (
              <div key={week.week} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-[#6f6559]">N{week.value}</span>
                <div
                  className="w-full rounded-t-lg bg-[#d9752e] transition-all"
                  style={{ height: `${(week.value / maxLevel) * 150}px` }}
                />
                <span className="text-xs font-medium text-[#6f6559]">{week.week}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {/* Strengths */}
          <section className="rounded-3xl border border-[#1f9d61]/30 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <TrendingUp className="size-5 text-[#1f9d61]" />
              نقاط القوة
            </h2>
            <ul className="space-y-3">
              {STRENGTHS.map((item) => (
                <li key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm font-medium">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e9dd]">
                    <div
                      className="h-full rounded-full bg-[#1f9d61]"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Weaknesses */}
          <section className="rounded-3xl border border-[#ef4444]/30 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <TrendingDown className="size-5 text-[#ef4444]" />
              نقاط الضعف
            </h2>
            <ul className="space-y-3">
              {WEAKNESSES.map((item) => (
                <li key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm font-medium">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e9dd]">
                    <div
                      className="h-full rounded-full bg-[#ef4444]"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}