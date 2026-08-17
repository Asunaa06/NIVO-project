"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// أنواع الأحداث
type EventType = "review" | "lesson" | "religious" | "national"

type CalendarEvent = {
  day: number
  type: EventType
  title: string
}

const EVENT_STYLES: Record<EventType, { dot: string; label: string }> = {
  review: { dot: "bg-[#d9752e]", label: "مراجعة" },
  lesson: { dot: "bg-[#8b5cf6]", label: "درس / اختبار" },
  religious: { dot: "bg-[#1f9d61]", label: "مناسبة دينية" },
  national: { dot: "bg-[#ef4444]", label: "مناسبة وطنية" },
}

// أحداث تجريبية لشهر أوت 2026
const SAMPLE_EVENTS: CalendarEvent[] = [
  { day: 3, type: "review", title: "مراجعة: النهايات" },
  { day: 5, type: "lesson", title: "درس جديد: المتتاليات" },
  { day: 9, type: "religious", title: "يوم عاشوراء" },
  { day: 12, type: "review", title: "مراجعة: المحاسبة التحليلية" },
  { day: 14, type: "lesson", title: "اختبار تجريبي رياضيات" },
  { day: 20, type: "national", title: "عيد الاستقلال" },
  { day: 23, type: "review", title: "مراجعة: القانون التجاري" },
  { day: 28, type: "lesson", title: "درس جديد: الاحتمالات" },
]

const WEEKDAYS = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]

export default function PlannerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(7) // أوت = 7 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      setLoading(false)
      return
    }

    const client = supabase as NonNullable<typeof supabase>

    async function checkAuth() {
      const { data: { user } } = await client.auth.getUser()
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
        <p className="text-lg font-black text-[#242b38]">جاري تحميل المُنظّم...</p>
      </main>
    )
  }

  const monthNames = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
  const hijriMonths = ["محرّم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان", "رمضان", "شوّال", "ذو القعدة", "ذو الحجة"]

  // حساب أيام الشهر
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  // أول يوم في الشهر (0 = الأحد، لكن نبدأ من السبت)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  // تحويل: السبت=0، الأحد=1، ... الجمعة=6
  const startOffset = (firstDay + 1) % 7

  const eventsByDay = new Map<number, CalendarEvent[]>()
  SAMPLE_EVENTS.forEach((event) => {
    const existing = eventsByDay.get(event.day) || []
    existing.push(event)
    eventsByDay.set(event.day, existing)
  })

  function changeMonth(delta: number) {
    let newMonth = currentMonth + delta
    let newYear = currentYear
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] text-[#242b38]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-black sm:text-3xl">المُنظّم</h1>
          <p className="mt-1 text-sm text-[#6f6559]">تنظيم وقتك مع المراجعات و المناسبات — {SAMPLE_EVENTS.length} أحداث قادمة</p>
        </header>

        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#e8dccb] bg-white px-5 py-4">
          <button
            onClick={() => changeMonth(-1)}
            className="flex size-9 items-center justify-center rounded-lg text-[#6f6559] transition-colors hover:bg-[#f3e9dd] hover:text-[#242b38]"
            aria-label="الشهر السابق"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="text-center">
            <p className="text-xl font-black">{monthNames[currentMonth]} {currentYear}</p>
            <p className="text-xs text-[#6f6559]">{hijriMonths[currentMonth]} 1448 هـ</p>
          </div>

          <button
            onClick={() => changeMonth(1)}
            className="flex size-9 items-center justify-center rounded-lg text-[#6f6559] transition-colors hover:bg-[#f3e9dd] hover:text-[#242b38]"
            aria-label="الشهر التالي"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-3 sm:p-5">
          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-bold text-[#6f6559]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const events = eventsByDay.get(day) || []
              const isToday = day === 12 && currentMonth === 7 && currentYear === 2026

              return (
                <button
                  key={day}
                  className={`flex min-h-16 flex-col items-center gap-1 rounded-xl border p-1.5 text-right transition-colors sm:min-h-24 sm:p-2 ${
                    isToday
                      ? "border-[#d9752e] bg-[#d9752e]/5"
                      : "border-[#e8dccb] bg-[#fcf5ee] hover:border-[#6f6559]/30"
                  }`}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-xs font-bold sm:size-7 sm:text-sm ${
                      isToday ? "bg-[#d9752e] text-white" : "text-[#242b38]"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="flex flex-1 flex-col items-stretch gap-0.5 self-stretch">
                    {events.map((event, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 truncate rounded px-1 text-[10px] font-medium text-[#6f6559]"
                      >
                        <span className={`size-1.5 shrink-0 rounded-full ${EVENT_STYLES[event.type].dot}`} />
                        <span className="hidden truncate sm:inline">{event.title}</span>
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e8dccb] bg-white px-5 py-4">
          {(Object.keys(EVENT_STYLES) as EventType[]).map((type) => (
            <div key={type} className="flex items-center gap-2 text-sm text-[#242b38]">
              <span className={`size-3 rounded-full ${EVENT_STYLES[type].dot}`} />
              {EVENT_STYLES[type].label}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}