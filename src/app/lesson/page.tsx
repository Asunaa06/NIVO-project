"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CircleCheck,
  ExternalLink,
  FileText,
  History,
  Lightbulb,
  Link as LinkIcon,
  MonitorPlay,
  Play,
  Plus,
  RotateCcw,
  Star,
  Upload,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Source = {
  id: string
  title: string
  description: string
  url: string
  type: "video" | "pdf" | "link"
  rating: number
  votes: number
  isMine?: boolean
}

const SAMPLE_SOURCES: Source[] = [
  {
    id: "1",
    title: "شرح النهايات — الأستاذ بلقاسم",
    description: "شرح مبسط مع أمثلة محلولة من مواضيع البكالوريا",
    url: "https://youtube.com",
    type: "video",
    rating: 5,
    votes: 128,
  },
  {
    id: "2",
    title: "ملخص رفع حالات عدم التعيين",
    description: "ورقة واحدة تلخص كل الحالات",
    url: "https://example.com",
    type: "pdf",
    rating: 4,
    votes: 64,
    isMine: true,
  },
  {
    id: "3",
    title: "تمارين متدرجة في الاستمرارية",
    description: "سلسلة تمارين من السهل إلى الصعب",
    url: "https://example.com",
    type: "link",
    rating: 4,
    votes: 41,
  },
]

const SOURCE_ICONS = {
  video: MonitorPlay,
  pdf: FileText,
  link: LinkIcon,
}

export default function LessonPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [router])

  function toggleTimer() {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsRunning(false)
    } else {
      setIsRunning(true)
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
  }

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
    setSeconds(0)
  }

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-lg font-black text-[#242b38]">جاري تحميل غرفة الدرس...</p>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] text-[#242b38]">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-[#e8dccb] bg-white/60 px-5 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-black sm:text-3xl">النهايات و الاستمرارية</h1>
          <p className="text-sm text-[#6f6559]">الرياضيات • غرفة الدراسة</p>
        </div>
        <Link
          href="/city"
          className="flex items-center gap-1.5 rounded-full border border-[#e8dccb] bg-white px-4 py-2 text-sm font-medium text-[#242b38] transition-colors hover:border-[#d9752e] hover:text-[#d9752e]"
        >
          المدينة
          <ArrowRight className="size-4" />
        </Link>
      </header>

      <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Timer */}
          <div className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#6f6559]/40" />
                <h2 className="text-sm font-bold">مؤقّت الدراسة</h2>
              </div>
              <button
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-[#6f6559] transition-colors hover:bg-[#f3e9dd] hover:text-[#242b38]"
                aria-label="سجل الجلسات"
              >
                <History className="size-4" />
                <span>مصباح الجلسات</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-5 py-4">
              <p className="font-mono text-5xl font-black tabular-nums tracking-tight sm:text-6xl">
                {formatTime(seconds)}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="flex items-center gap-2 rounded-full bg-[#d9752e] px-8 py-3 text-base font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  <Play className="size-5" />
                  {isRunning ? "إيقاف" : "ابدأ"}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex size-12 items-center justify-center rounded-full border border-[#e8dccb] bg-[#fcf5ee] text-[#6f6559] transition-colors hover:text-[#242b38]"
                  aria-label="إعادة الضبط"
                >
                  <RotateCcw className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#d9752e]/15 text-[#d9752e]">
                <BookOpen className="size-4" />
              </span>
              <h2 className="text-lg font-black">محتوى الدرس</h2>
            </div>

            <p className="leading-relaxed text-[#6f6559]">
              دراسة نهاية دالة عند نقطة و عند اللانهاية، مع استعمال المبرهنات الأساسية و رفع حالات عدم التعيين.
              تشمل هذه الوحدة الاستمرارية على مجال و مبرهنة القيم المتوسطة.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-lg bg-[#f3e9dd] px-3 py-1.5 text-xs font-bold">
                <Boxes className="size-4 text-[#d9752e]" />
                المستوى الحالي: Nv3
              </span>
            </div>
          </section>

          {/* Sources */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#8b5cf6]/15 text-[#8b5cf6]">
                  <LinkIcon className="size-4" />
                </span>
                مصادر تعليمية
              </h2>
              <button className="flex items-center gap-1.5 rounded-lg bg-[#f3e9dd] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[#8b5cf6] hover:text-white">
                <Plus className="size-4" />
                أضف مصدرًا
              </button>
            </div>

            <ul className="space-y-3">
              {SAMPLE_SOURCES.map((source) => {
                const Icon = SOURCE_ICONS[source.type]
                return (
                  <li
                    key={source.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[#e8dccb] bg-[#fcf5ee] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6]">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate font-bold hover:text-[#d9752e]"
                        >
                          {source.title}
                        </a>
                        <p className="truncate text-sm text-[#6f6559]">{source.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < source.rating
                                ? "fill-[#d9752e] text-[#d9752e]"
                                : "fill-transparent text-[#6f6559]/40"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#6f6559]">
                        {source.rating}.{source.votes % 10} ({source.votes} صوت)
                        {source.isMine ? " • مصدرك" : ""}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-5">
          {/* Active Review */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">المراجعة النشطة</h2>
              <span className="flex items-center gap-1.5 rounded-lg bg-[#d9752e]/10 px-3 py-1 text-sm font-bold text-[#d9752e]">
                الدرج 3 / 7
              </span>
            </div>

            <div className="mb-5 rounded-2xl bg-[#f3e9dd] p-4">
              <p className="text-sm font-medium text-[#6f6559]">الأسلوب المقترح للمراجعة</p>
              <p className="mt-1 text-base font-bold">حل تمارين</p>
            </div>

            <p className="mb-2 text-sm font-bold">كيف وجدت هذا الدرس؟</p>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                    difficulty === d
                      ? "border-[#d9752e] bg-[#fcf5ee] text-[#d9752e]"
                      : "border-[#e8dccb] text-[#6f6559] hover:border-[#6f6559]/40"
                  }`}
                >
                  {d === "easy" ? "سهل" : d === "medium" ? "متوسط" : "صعب"}
                </button>
              ))}
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d9752e] py-3.5 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95">
              <CircleCheck className="size-5" />
              إنهاء المراجعة
            </button>
          </section>

          {/* Stats */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f3e9dd] p-4 text-center">
                <p className="text-3xl font-black text-[#d9752e]">6×</p>
                <p className="mt-1 text-xs text-[#6f6559]">ظهور في البكالوريا</p>
              </div>
              <a
                href="https://ankiweb.net"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-2xl bg-[#8b5cf6]/10 p-4 text-center transition-colors hover:bg-[#8b5cf6]/20"
              >
                <p className="flex items-center gap-1 text-3xl font-black text-[#8b5cf6]">
                  <Boxes className="size-6" />
                  24
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#8b5cf6]">
                  بطاقات Anki
                  <ExternalLink className="size-3" />
                </p>
              </a>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 py-2.5 text-sm font-bold transition-colors border-[#e8dccb] hover:border-[#d9752e] hover:text-[#d9752e]">
              <Lightbulb className="size-4" />
              سنوات ظهور الدرس
            </button>
          </section>

          {/* Personal Summary */}
          <section className="rounded-3xl border border-[#e8dccb] bg-white p-6">
            <h2 className="mb-4 text-lg font-black">ملخّصك الشخصي</h2>
            <button className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#e8dccb] bg-[#fcf5ee] py-8 text-[#6f6559] transition-colors hover:border-[#d9752e] hover:text-[#d9752e]">
              <Upload className="size-7" />
              <span className="text-sm font-medium">اضغط لرفع ملخّص (PDF أو PNG)</span>
            </button>
            <input type="file" accept="application/pdf,image/png" className="hidden" />
          </section>
        </div>
      </div>
    </main>
  )
}