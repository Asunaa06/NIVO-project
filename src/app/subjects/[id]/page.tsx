"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, CheckCircle2, ChevronLeft, Compass, FileText, Layers3, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { fetchSubjectData, type LessonProgressRecord, type LessonRecord } from "@/lib/supabase/data"

type TabKey = "lessons" | "reviews" | "bac"

type BacExamItem = {
  year: string
  url: string
}

const reviewLabels = [
  "المراجعة السريعة",
  "التكرار المنظم",
  "أسئلة التطبيق",
  "التلخيص الأسبوعي",
  "الملخص الذهني",
  "المراجعة النهائية",
  "استعراض البكالوريا",
]

function normalizeSubjectSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    || "math"
}

function getSubjectKey(name?: string, fallback = "math") {
  const value = (name || fallback).trim().toLowerCase()

  const aliases: Record<string, string> = {
    math: "math",
    mathematics: "math",
    الرياضيات: "math",
    physics: "physics",
    فيزياء: "physics",
    chemistry: "chemistry",
    كيمياء: "chemistry",
    biology: "biology",
    أحياء: "biology",
    arabic: "arabic",
    عربية: "arabic",
    english: "english",
    انجليزي: "english",
    history: "history",
    تاريخ: "history",
    geography: "geography",
    جغرافيا: "geography",
    philosophy: "philosophy",
    فلسفة: "philosophy",
  }

  return aliases[value] || normalizeSubjectSlug(value)
}

function getLevelFromProgress(value: number) {
  if (value >= 80) return 5
  if (value >= 60) return 4
  if (value >= 40) return 3
  if (value >= 20) return 2
  return 1
}

function getBuildingImage(subjectKey: string, level: number) {
  const safeLevel = Math.min(5, Math.max(1, level))
  return `/images/subjects/${subjectKey}/level-${safeLevel}.png`
}

export default function SubjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [lessons, setLessons] = useState<LessonRecord[]>([])
  const [progress, setProgress] = useState<LessonProgressRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>("lessons")
  const [openReviewIndex, setOpenReviewIndex] = useState<number | null>(0)
  const [bacExams, setBacExams] = useState<BacExamItem[]>([])

  useEffect(() => {
    const subjectId = params?.id
    if (!subjectId) return

    const supabase = createClient()

    if (!supabase) {
      setSubject(null)
      setLessons([])
      setProgress([])
      setLoading(false)
      return
    }

    async function load() {
      try {
        const result = await fetchSubjectData(supabase, subjectId)
        if (!result.user) {
          router.push("/login")
          return
        }

        setSubject(result.subject)
        setLessons(result.lessons)
        setProgress(result.progress)
      } catch {
        setSubject(null)
        setLessons([])
        setProgress([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [params, router])

  useEffect(() => {
    async function loadBacExams() {
      const supabase = createClient()
      if (!supabase) {
        setBacExams([])
        return
      }

      try {
        const { data, error } = await supabase.storage.from("bac-exams").list("", { limit: 100 })
        if (error || !data) {
          setBacExams([])
          return
        }

        const pdfFiles = data
          .filter((item) => item.name.toLowerCase().endsWith(".pdf"))
          .sort((a, b) => (a.name > b.name ? -1 : 1))

        const mapped = pdfFiles.map((item) => {
          const { data: urlData } = supabase.storage.from("bac-exams").getPublicUrl(item.name)
          return {
            year: item.name.replace(/\.[^/.]+$/, "").replace(/^.*[-_]/, ""),
            url: urlData.publicUrl,
          }
        })

        setBacExams(mapped)
      } catch {
        setBacExams([])
      }
    }

    void loadBacExams()
  }, [])

  const subjectKey = useMemo(
    () => getSubjectKey(subject?.name, "math"),
    [subject?.name]
  )

  const masterProgress = useMemo(() => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id))
    const userLessonProgress = progress.filter((item) => lessonIds.has(item.lesson_id))

    if (!userLessonProgress.length) {
      return { percent: 0, level: 1 }
    }

    const averageLevel = userLessonProgress.reduce((total, item) => total + (typeof item.level === "number" ? item.level : 0), 0) / userLessonProgress.length
    const percentage = Math.min(100, Math.max(0, (averageLevel / 5) * 100))
    const level = getLevelFromProgress(percentage)

    return { percent: Math.round(percentage), level }
  }, [lessons, progress])

  const buildingImage = useMemo(
    () => getBuildingImage(subjectKey, masterProgress.level),
    [subjectKey, masterProgress.level]
  )

  const completedCount = useMemo(
    () => lessons.filter((lesson) => {
      const progressItem = progress.find((item) => item.lesson_id === lesson.id)
      return progressItem ? progressItem.completed : false
    }).length,
    [lessons, progress]
  )

  const levelDescription = useMemo(() => {
    if (masterProgress.percent < 20) return "مستوى 1: بناء صغير"
    if (masterProgress.percent < 40) return "مستوى 2: بناء متوسّط"
    if (masterProgress.percent < 60) return "مستوى 3: فيلا" 
    if (masterProgress.percent < 80) return "مستوى 4: مبنى حديث" 
    return "مستوى 5: أكاديمية متقدمة"
  }, [masterProgress.percent])

  const tabs: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
    { key: "lessons", label: "دروس", icon: BookOpen },
    { key: "reviews", label: "مراجعات", icon: Layers3 },
    { key: "bac", label: "بكالوريا", icon: FileText },
  ]

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-lg font-black text-[#242b38]">جاري تحميل المادة...</p>
      </main>
    )
  }

  if (!subject) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee] px-6">
        <div className="rounded-[28px] border border-[#e8dccb] bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-[#242b38]">المادة غير موجودة</h1>
          <Link href="/city" className="mt-5 inline-flex rounded-full bg-[#d9752e] px-5 py-3 text-sm font-black text-white">
            العودة إلى مدينة المواد
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] px-4 py-6 text-[#242b38] lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/city" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#6f6559]">
          <ChevronLeft className="h-4 w-4" />
          العودة إلى مدينة المواد
        </Link>

        <header className="overflow-hidden rounded-[30px] border border-[#e8dccb] bg-white shadow-[0_18px_35px_rgba(92,72,43,0.08)]">
          <div className="relative min-h-[260px] overflow-hidden bg-[#f8efe5]">
            <img
              src={buildingImage}
              alt={`مستوى بناء ${masterProgress.level} في ${subject.name}`}
              className="h-[260px] w-full object-cover"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement
                target.style.display = "none"
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1f29]/80 via-[#1b1f29]/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="mb-3 flex items-center gap-2 text-sm text-[#f7d4ae]">
                <ShieldCheck className="h-4 w-4" />
                <span>مستوى المادة</span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs opacity-80">{subject.name}</p>
                  <h1 className="mt-1 text-3xl font-black">{levelDescription}</h1>
                </div>

                <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-left backdrop-blur-sm">
                  <p className="text-[10px] opacity-80">التقدم</p>
                  <p className="text-xl font-black">{masterProgress.percent}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 p-4">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  activeTab === key
                    ? "bg-[#d9752e] text-white shadow-sm"
                    : "bg-[#fffaf4] text-[#403a35]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-7 rounded-[30px] border border-[#e8dccb] bg-white p-5 shadow-[0_16px_28px_rgba(92,72,43,0.04)] md:p-6">
          {activeTab === "lessons" && (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#d9752e]" />
                  <h2 className="text-xl font-black">سلسلة الدروس</h2>
                </div>
                <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-sm font-black text-[#d9752e]">
                  {completedCount} / {lessons.length}
                </span>
              </div>

              {lessons.length > 0 ? (
                <div className="relative space-y-4">
                  {lessons.map((lesson, index) => {
                    const lessonProgress = progress.find((item) => item.lesson_id === lesson.id)
                    const completed = Boolean(lessonProgress?.completed)

                    return (
                      <div key={lesson.id} className="relative pl-6">
                        {index < lessons.length - 1 && (
                          <div className="absolute right-[20px] top-10 h-[calc(100%-8px)] w-px bg-gradient-to-b from-[#f4d8b2] to-[#e8dccb]" />
                        )}

                        <Link
                          href={`/subject/${subject.id}/lesson/${lesson.id}`}
                          className="group relative flex items-center gap-4"
                        >
                          <div
                            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm transition ${
                              completed
                                ? "bg-[#1e8b5a] text-white"
                                : "bg-[#fffaf4] text-[#d9752e] ring-1 ring-[#f0d7b7]"
                            }`}
                          >
                            {completed ? <CheckCircle2 className="h-5 w-5" /> : <span className="h-2.5 w-2.5 rounded-full bg-[#d9752e]" />}
                          </div>

                          <div className="flex-1 rounded-[24px] border border-[#f0e5d9] bg-[#fffaf4] p-4 transition group-hover:border-[#d9752e]/40 group-hover:bg-[#fff3eb]">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-black text-[#d9752e]">درس {String(index + 1).padStart(2, "0")}</p>
                                <h3 className="mt-1 text-lg font-black text-[#242b38]">{lesson.title}</h3>
                              </div>

                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${completed ? "bg-[#ebf9f1] text-[#1e8b5a]" : "bg-[#f6efe7] text-[#6f6559]"}`}>
                                {completed ? "مكتمل" : "متاح"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#d4c2ae] bg-[#fffaf4] p-8 text-center">
                  <p className="text-lg font-black text-[#242b38]">لا توجد دروس لهذا الموضوع بعد</p>
                  <p className="mt-2 text-[#6f6559]">أضف الدروس إلى جدول <strong>lessons</strong> في Supabase.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "reviews" && (
            <>
              <div className="mb-5 flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#d9752e]" />
                <h2 className="text-xl font-black">مراجعات ليتر</h2>
              </div>

              <div className="space-y-3">
                {reviewLabels.map((label, index) => {
                  const isOpen = openReviewIndex === index

                  return (
                    <div key={label} className="overflow-hidden rounded-[22px] border border-[#f0e5d9] bg-[#fffaf4]">
                      <button
                        type="button"
                        onClick={() => setOpenReviewIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbe7d9] font-black text-[#d9752e]">
                            {index + 1}
                          </span>
                          <span className="font-black text-[#242b38]">{label}</span>
                        </span>
                        <span className={`text-xl font-black text-[#d9752e] transition-transform ${isOpen ? "rotate-180" : ""}`}>
                          ▾
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[#f0e5d9] px-4 py-4 text-sm leading-7 text-[#5c584f]">
                              <p>• مراجعة سريعة على أهم نقاط الدرس.</p>
                              <p>• أسئلة قصيرة مع تأكيد للحفظ.</p>
                              <p>• تكرار متدرج حسب مستوى الإتقان الحالي.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeTab === "bac" && (
            <>
              <div className="mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#d9752e]" />
                <h2 className="text-xl font-black">امتحانات البكالوريا</h2>
              </div>

              {bacExams.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {bacExams.map((exam) => (
                    <button
                      key={exam.url}
                      type="button"
                      onClick={() => window.open(exam.url, "_blank", "noopener,noreferrer")}
                      className="rounded-[22px] border border-[#f0e5d9] bg-[#fffaf4] p-4 text-right transition hover:-translate-y-0.5 hover:border-[#d9752e]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-black text-[#242b38]">سنة {exam.year}</span>
                        <FileText className="h-5 w-5 text-[#d9752e]" />
                      </div>
                      <p className="mt-2 text-sm text-[#6f6559]">فتح الملف في نافذة جديدة</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#d4c2ae] bg-[#fffaf4] p-8 text-center">
                  <p className="text-lg font-black text-[#242b38]">لا توجد ملفات BAC في Storage بعد</p>
                  <p className="mt-2 text-[#6f6559]">أضف ملفات PDF داخل bucket <strong>bac-exams</strong> في Supabase Storage.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}