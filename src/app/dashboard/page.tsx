"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { BookCheck, ChevronLeft, Clock, Flame, Rocket, Sparkles, Target, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { fetchDashboardData, type DashboardData } from "@/lib/supabase/data"

// بيانات تجريبية للمراجعات
const SAMPLE_REVIEWS = [
  { id: "1", title: "الاحتمالات", subject: "الرياضيات", box: 1, boxLabel: "جديد", status: "اليوم", color: "bg-red-500/10 text-red-600 ring-red-500/30" },
  { id: "2", title: "وظائف المؤسسة", subject: "الاقتصاد والمناجمنت", box: 1, boxLabel: "جديد", status: "متأخّر 2 يوم", color: "bg-red-500/10 text-red-600 ring-red-500/30" },
  { id: "3", title: "الاشتقاقية", subject: "الرياضيات", box: 2, boxLabel: "بداية", status: "متأخّر 1 يوم", color: "bg-orange-500/10 text-orange-600 ring-orange-500/30" },
  { id: "4", title: "النهايات والاتصال", subject: "الرياضيات", box: 3, boxLabel: "تحسّن", status: "اليوم", color: "bg-amber-500/10 text-amber-600 ring-amber-500/30" },
  { id: "5", title: "حساب النتائج", subject: "التسيير المحاسبي والمالي", box: 3, boxLabel: "تحسّن", status: "اليوم", color: "bg-amber-500/10 text-amber-600 ring-amber-500/30" },
  { id: "6", title: "الدوال العددية", subject: "الرياضيات", box: 5, boxLabel: "جيد جداً", status: "اليوم", color: "bg-lime-500/10 text-lime-700 ring-lime-500/30" },
]

const BADGES = [
  { name: "أول 10 دروس", desc: "أكملت أول 10 دروس في رحلتك", icon: Rocket, earned: true },
  { name: "سلسلة 7 أيام", desc: "راجعت دروسك 7 أيام متتالية", icon: Flame, earned: true },
  { name: "متقن الرياضيات", desc: "وصلت بدرس إلى الدرج السابع", icon: Trophy, earned: true },
  { name: "سلسلة 30 يوم", desc: "ثابر لمدة شهر كامل", icon: Trophy, earned: false },
  { name: "خبير المصادر", desc: "قيّمت 20 مصدراً تعليمياً", icon: Sparkles, earned: false },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      setError("بيانات Supabase غير مهيأة بعد. الرجاء إعداد المتغيرات البيئية.")
      setLoading(false)
      return
    }

    async function load() {
      try {
        const result = await fetchDashboardData(supabase)

        if (!result?.user) {
          router.push("/login")
          return
        }

        setData(result)
      } catch (err) {
        console.error(err)
        setError("تعذر تحميل بيانات لوحة التحكم من Supabase.")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [router])

  const summary = useMemo(() => {
    if (!data) return { completed: 0, due: 0, streak: 0, total: 0, goal: 0 }

    const completed = data.progress.filter((item) => item.completed).length
    const due = data.progress.filter((item) => !item.completed || (item.next_review_date && new Date(item.next_review_date) <= new Date())).length
    const streak = data.profile?.current_streak ?? 0
    const goal = 0

    return {
      completed,
      due,
      streak,
      total: data.lessons.length,
      goal,
    }
  }, [data])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <div className="text-center">
          <div className="text-3xl font-black text-[#242b38]">Nivo</div>
          <p className="mt-2 text-[#6f6559]">جاري تحميل لوحة التحكم...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee] px-6">
        <div className="max-w-md rounded-3xl border border-[#e8dccb] bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-black text-[#242b38]">حدثت مشكلة في الاتصال</p>
          <p className="mt-3 text-[#6f6559]">{error}</p>
          <Link href="/login" className="mt-6 inline-flex rounded-lg bg-[#d9752e] px-5 py-3 text-sm font-black text-white">
            العودة للتسجيل
          </Link>
        </div>
      </main>
    )
  }

  const userName = data?.profile?.full_name || data?.user?.email || "الطالب"

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] text-[#242b38]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black md:text-3xl">أهلاً، {userName}</h1>
            <p className="mt-1 text-[#6f6559]">هذه مهامك ومراجعاتك لهذا اليوم. لن تنسى بعد اليوم.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
            <div className="flex size-11 items-center justify-center rounded-xl text-[#d9752e] bg-[#d9752e]/10">
              <Flame className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-black">{summary.streak} يوم</p>
            <p className="text-sm text-[#6f6559]">السلسلة اليومية</p>
          </div>

          <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
            <div className="flex size-11 items-center justify-center rounded-xl text-[#1f9d61] bg-[#1f9d61]/10">
              <BookCheck className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-black">{summary.completed} / {summary.total}</p>
            <p className="text-sm text-[#6f6559]">دروس مكتملة</p>
          </div>

          <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
            <div className="flex size-11 items-center justify-center rounded-xl text-[#8b5cf6] bg-[#8b5cf6]/10">
              <Clock className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-black">{summary.due}</p>
            <p className="text-sm text-[#6f6559]">مراجعات اليوم</p>
          </div>

          <div className="rounded-2xl border border-[#e8dccb] bg-white p-5">
            <div className="flex size-11 items-center justify-center rounded-xl text-[#d9752e] bg-[#d9752e]/10">
              <Target className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-black">{summary.goal}/20</p>
            <p className="text-sm text-[#6f6559]">المعدل المستهدف</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Today's Reviews */}
          <div className="lg:col-span-2">
            <section className="rounded-2xl border border-[#e8dccb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">مراجعات اليوم</h2>
                <span className="rounded-full bg-[#d9752e]/10 px-3 py-1 text-sm font-bold text-[#d9752e]">
                  {SAMPLE_REVIEWS.length} درس
                </span>
              </div>

              <ul className="flex flex-col gap-2">
                {SAMPLE_REVIEWS.map((review) => (
                  <li key={review.id}>
                    <Link
                      href="/lesson"
                      className="flex items-center gap-3 rounded-xl border border-[#e8dccb] p-3 transition-colors hover:bg-[#f3e9dd]"
                    >
                      <span className={`flex size-11 items-center justify-center rounded-lg text-sm font-black ring-1 ${review.color}`}>
                        {review.box}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{review.title}</p>
                        <p className="text-sm text-[#6f6559]">
                          {review.subject} · درج {review.box} ({review.boxLabel})
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-[#d9752e]">{review.status}</span>
                      <ChevronLeft className="size-5 shrink-0 text-[#6f6559]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* CTA */}
            <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#d9752e] to-[#b85f22] p-5 text-white">
              <Sparkles className="size-6" />
              <h2 className="mt-3 text-xl font-black">جاهز لدرس جديد؟</h2>
              <p className="mt-1 text-sm opacity-90">استكشف مدينة المواد وابدأ رحلتك اليوم.</p>
              <Link
                href="/city"
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#242b38] py-2.5 text-sm font-bold text-white transition hover:bg-[#242b38]/80"
              >
                ابدأ درساً جديداً
              </Link>
            </section>

            {/* Streak */}
            <section className="rounded-2xl border border-[#e8dccb] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#d9752e]/10">
                  <Flame className="size-6 text-[#d9752e]" />
                </div>
                <div>
                  <p className="text-2xl font-black">{summary.streak} يوم</p>
                  <p className="text-sm text-[#6f6559]">سلسلة متتالية</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < Math.min(summary.streak, 7) ? "bg-[#d9752e]" : "bg-[#f3e9dd]"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-[#6f6559]">لا تكسر السلسلة — راجع درساً اليوم!</p>
            </section>

            {/* Badges */}
            <section className="rounded-2xl border border-[#e8dccb] bg-white p-5">
              <h2 className="mb-4 text-lg font-bold">شاراتك</h2>
              <ul className="grid grid-cols-1 gap-2">
                {BADGES.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <li
                      key={badge.name}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        badge.earned
                          ? "border-[#e8dccb] bg-white"
                          : "border-dashed border-[#e8dccb] opacity-55"
                      }`}
                    >
                      <div className={`flex size-9 items-center justify-center rounded-lg ${
                        badge.earned ? "bg-[#d9752e]/10 text-[#d9752e]" : "bg-[#f3e9dd] text-[#6f6559]"
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{badge.name}</p>
                        <p className="truncate text-xs text-[#6f6559]">{badge.desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}