"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Lightbulb, Pause, Play, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const DEFAULT_TIPS = [
  "قسّم وقتك إلى ثلاث فترات قصيرة بدلًا من جلسة واحدة طويلة.",
  "ابدأ بسؤال واحد ثم اكتب فكرة رئيسية في سطرين فقط.",
  "المراجعة القصيرة المتكررة أفضل من الحفظ العشوائي.",
  "حدّد هدفك اليومي قبل أن تبدأ كل جلسة.",
  "اشرب كوب ماء كل 15 دقيقة لتحافظ على تركيزك.",
]

type TipRecord = {
  id: string
  text: string
}

type ResourceRecord = {
  id: string
  lesson_id: string
  title: string
  description?: string
  link?: string
  created_by?: string
  upvotes?: number
}

type LessonRecord = {
  id: string
  title: string
  anki_link?: string
  [key: string]: unknown
}

export default function FocusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [currentTip, setCurrentTip] = useState<TipRecord | null>(null)
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [lesson, setLesson] = useState<LessonRecord | null>(null)
  const [showResourcesSheet, setShowResourcesSheet] = useState(false)
  const [tips, setTips] = useState<TipRecord[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sessionType = (searchParams?.get("type") as "free" | "countdown" | "pomodoro") || "free"
  const minutes = parseInt(searchParams?.get("minutes") || "25", 10)
  const targetSeconds = sessionType === "free" ? Infinity : minutes * 60
  const lessonId = searchParams?.get("lessonId")

  useEffect(() => {
    const supabase = createClient()
    if (!supabase || !lessonId) return

    async function load() {
      try {
        const client = supabase as NonNullable<typeof supabase>
        const {
          data: { user },
        } = await client.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        const [lessonResult, tipsResult, resourcesResult] = await Promise.all([
          client.from("lessons").select("*").eq("id", lessonId).maybeSingle(),
          client.from("tips").select("*").order("created_at", { ascending: false }).limit(50),
          client.from("resources").select("*").eq("lesson_id", lessonId),
        ])

        setLesson(lessonResult.data as LessonRecord | null)
        const loadedTips = tipsResult.data as TipRecord[]
        if (loadedTips.length > 0) {
          setTips(loadedTips)
          setCurrentTip(loadedTips[Math.floor(Math.random() * loadedTips.length)])
        } else {
          const defaultTips: TipRecord[] = DEFAULT_TIPS.map((text, i) => ({ id: `default-${i}`, text }))
          setTips(defaultTips)
          setCurrentTip(defaultTips[0])
        }
        setResources((resourcesResult.data as ResourceRecord[]) ?? [])
      } catch {
        const defaultTips: TipRecord[] = DEFAULT_TIPS.map((text, i) => ({ id: `default-${i}`, text }))
        setTips(defaultTips)
        setCurrentTip(defaultTips[0])
        setLesson(null)
      }
    }

    void load()
  }, [lessonId, router])

  useEffect(() => {
    if (!isRunning) return

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (sessionType !== "free" && prev + 1 >= targetSeconds) {
          setIsRunning(false)
          return targetSeconds
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, sessionType, targetSeconds])

  const displayMinutes = Math.floor(seconds / 60)
  const displaySeconds = seconds % 60
  const displayHours = Math.floor(displayMinutes / 60)

  const formatTime = () => {
    if (sessionType === "free") {
      return `${String(displayHours).padStart(2, "0")}:${String(displayMinutes % 60).padStart(2, "0")}:${String(displaySeconds).padStart(2, "0")}`
    }
    const remainingMinutes = Math.max(0, minutes - displayMinutes)
    const remainingSeconds = displaySeconds === 0 ? 0 : 60 - displaySeconds
    return `${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds === 60 ? 0 : remainingSeconds).padStart(2, "0")}`
  }

  const handleTipChange = () => {
    if (tips.length > 0) {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)])
    }
  }

  return (
    <main dir="rtl" className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#fcf5ee] via-[#fff8f0] to-[#fcf5ee] px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              className="absolute h-96 w-96 rounded-full bg-[#d9752e]"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute right-0 top-0 rounded-full bg-white/60 p-2 backdrop-blur text-[#6f6559] transition hover:bg-white"
        >
          ×
        </button>

        {lesson && (
          <div className="mb-8">
            <p className="text-sm font-black text-[#d9752e]">الدرس الحالي</p>
            <h1 className="mt-2 text-3xl font-black text-[#242b38]">{lesson.title}</h1>
          </div>
        )}

        <div className="mb-8 rounded-[40px] border border-[#e8dccb]/30 bg-white/60 p-12 shadow-xl backdrop-blur">
          <p className="font-mono text-7xl font-black tabular-nums tracking-tight text-[#242b38]">
            {formatTime()}
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d9752e] text-white shadow-lg transition hover:scale-110 active:scale-95"
          >
            {isRunning ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false)
              setSeconds(0)
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#e8dccb] bg-white text-[#d9752e] transition hover:bg-[#fffaf4]"
          >
            ↻
          </button>
        </div>

        {currentTip && (
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 flex items-start gap-3 rounded-[24px] border border-[#fbe7d9] bg-[#fffaf4] p-4"
          >
            <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-[#d9752e]" />
            <div className="flex-1">
              <p className="text-xs font-black text-[#d9752e]">نصيحة التركيز</p>
              <p className="mt-1 text-sm font-medium text-[#5c584f]">{currentTip.text}</p>
            </div>

            <button
              type="button"
              onClick={handleTipChange}
              className="mt-1 shrink-0 text-[#6f6559] transition hover:text-[#d9752e]"
            >
              ↻
            </button>
          </motion.div>
        )}

        <div className="fixed inset-x-0 bottom-0 border-t border-[#e8dccb] bg-white/80 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-md justify-around gap-2">
            <button
              type="button"
              onClick={() => setShowResourcesSheet(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#fffaf4] py-3 text-sm font-black text-[#d9752e] transition hover:bg-[#fff3eb]"
            >
              <span className="text-xl">📚</span>
              المصادر
            </button>

            <a
              href={lesson?.anki_link || "https://apps.ankiweb.net/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#fffaf4] py-3 text-sm font-black text-[#d9752e] transition hover:bg-[#fff3eb]"
            >
              <span className="text-xl">🃏</span>
              أنكي
            </a>

            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#fffaf4] py-3 text-sm font-black text-[#d9752e] transition hover:bg-[#fff3eb]"
            >
              <span className="text-xl">📄</span>
              ملخص
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResourcesSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResourcesSheet(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[40px] border border-[#e8dccb] bg-white"
            >
              <div className="flex max-h-[60vh] flex-col">
                <div className="flex items-center justify-between border-b border-[#e8dccb] p-5">
                  <h2 className="text-lg font-black text-[#242b38]">المصادر</h2>
                  <button
                    type="button"
                    onClick={() => setShowResourcesSheet(false)}
                    className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]"
                  >
                    ×
                  </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-4">
{resources.length > 0 ? (
                    resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-[#f0e5d9] bg-[#fffaf4] p-4 transition hover:border-[#d9752e]/40"
                      >
                        <span className="font-black text-[#242b38]">{resource.title}</span>
                        <span className="text-[#d9752e]">→</span>
                      </a>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-8 text-sm text-[#6f6559]">
                      لا توجد مصادر
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
