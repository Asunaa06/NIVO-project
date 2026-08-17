"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Clock3, FileText, GraduationCap, MoveLeft, Play, Plus, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type SubjectRecord = {
  id: string
  name: string
  color?: string
  icon?: string
}

type LessonRecord = {
  id: string
  subject_id: string
  title: string
  order_index?: number
  content?: string
  review_method?: string
  content_url?: string
  anki_link?: string
  anki_count?: number
  bac_appearances?: number
  bac_years?: string[]
  [key: string]: unknown
}

type LessonProgressRecord = {
  lesson_id: string
  completed?: boolean
  level?: number
  [key: string]: unknown
}

type ResourceItem = {
  id: string
  lesson_id: string
  title: string
  description?: string
  link?: string
  created_by?: string
  upvotes?: number
}

export default function LessonRoomPage() {
  const params = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()
  const [subject, setSubject] = useState<SubjectRecord | null>(null)
  const [lesson, setLesson] = useState<LessonRecord | null>(null)
  const [progress, setProgress] = useState<LessonProgressRecord | null>(null)
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [sessionType, setSessionType] = useState<"free" | "countdown" | "pomodoro">("free")
  const [countdownMinutes, setCountdownMinutes] = useState(25)
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false)
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)
  const [newResource, setNewResource] = useState({ title: "", description: "", link: "" })
  const [showBacModal, setShowBacModal] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    async function load() {
      try {
        const client = supabase as NonNullable<typeof supabase>
        const {
          data: { user },
          error: authError,
        } = await client.auth.getUser()

        if (authError || !user) {
          router.push("/login")
          return
        }

        const subjectId = params?.id
        const lessonId = params?.lessonId
        if (!subjectId || !lessonId) {
          setLoading(false)
          return
        }

        const [subjectResult, lessonResult, progressResult, resourcesResult] = await Promise.all([
          client.from("subjects").select("*").eq("id", subjectId).maybeSingle(),
          client.from("lessons").select("*").eq("id", lessonId).maybeSingle(),
          client
            .from("lesson_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .maybeSingle(),
          client.from("resources").select("*").eq("lesson_id", lessonId).order("created_at", { ascending: false }),
        ])

        setCurrentUserId(user.id)
        setSubject(subjectResult.data as SubjectRecord | null)
        setLesson(lessonResult.data as LessonRecord | null)
        setProgress((progressResult.data as LessonProgressRecord | null) ?? null)
        setResources((resourcesResult.data as ResourceItem[] | null) ?? [])
      } catch {
        setSubject(null)
        setLesson(null)
        setProgress(null)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [params, router])

  const isCompleted = useMemo(() => Boolean(progress?.completed), [progress])
  const bacYears = useMemo(() => lesson?.bac_years ?? [], [lesson])

  async function saveResource() {
    const supabase = createClient()
    if (!supabase || !lesson) return

    const title = newResource.title.trim()
    const link = newResource.link.trim()
    if (!title || !link) return

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const payload = {
      lesson_id: lesson.id,
      title,
      description: newResource.description.trim() || "",
      link,
      created_by: userData.user.id,
      upvotes: 0,
    }

    const { error } = await supabase.from("resources").insert(payload)
    if (!error) {
      const { data } = await supabase.from("resources").select("*").eq("lesson_id", lesson.id).order("created_at", { ascending: false })
      setResources((data as ResourceItem[] | null) ?? [])
      setNewResource({ title: "", description: "", link: "" })
      setResourcesModalOpen(false)
    }
  }

  async function voteResource(resourceId: string) {
    const supabase = createClient()
    if (!supabase) return
    const item = resources.find((resource) => resource.id === resourceId)
    if (!item) return

    const nextVotes = (item.upvotes ?? 0) + 1
    const { data } = await supabase.from("resources").update({ upvotes: nextVotes }).eq("id", resourceId).select()
    if (data) {
      setResources((prev) => prev.map((resource) => (resource.id === resourceId ? { ...resource, upvotes: nextVotes } : resource)))
    }
  }

  function handleOpenFocusSession() {
    setSessionModalOpen(true)
  }

  function startFocusSession() {
    if (!subject || !lesson) return

    const query = new URLSearchParams({
      subjectId: subject.id,
      lessonId: lesson.id,
      type: sessionType,
    })

    if (sessionType === "countdown") {
      query.set("minutes", String(countdownMinutes || 25))
    }

    if (sessionType === "pomodoro") {
      query.set("minutes", "25")
    }

    router.push(`/focus?${query.toString()}`)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-lg font-black text-[#242b38]">جاري تجهيز غرفة الدرس...</p>
      </main>
    )
  }

  if (!subject || !lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee] px-6">
        <div className="rounded-[28px] border border-[#e8dccb] bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-[#242b38]">الدرس غير موجود</h1>
          <Link href={`/subjects/${params?.id ?? ""}`} className="mt-5 inline-flex rounded-full bg-[#d9752e] px-5 py-3 text-sm font-black text-white">
            العودة إلى المادة
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] px-4 py-6 text-[#242b38] lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/subjects/${subject.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#6f6559]">
            <MoveLeft className="h-4 w-4" />
            العودة إلى المادة
          </Link>

          <button
            type="button"
            onClick={handleOpenFocusSession}
            className="inline-flex items-center gap-2 rounded-full bg-[#d9752e] px-4 py-2.5 text-sm font-black text-white shadow-sm"
          >
            <Play className="h-4 w-4" />
            ابدأ جلسة
          </button>
        </div>

        <header className="rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#d9752e]">غرفة الدرس</p>
              <h1 className="mt-2 text-3xl font-black">{lesson.title}</h1>
            </div>

            <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black ${isCompleted ? "bg-[#ebf9f1] text-[#1e8b5a]" : "bg-[#f6efe7] text-[#6f6559]"}`}>
              {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
              {isCompleted ? "مكتمل" : "قيد الدراسة"}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#d9752e]" />
                <h2 className="text-xl font-black">محتوى الدرس</h2>
              </div>

              <div className="rounded-[22px] bg-[#fffaf4] p-5">
                <p className="text-base leading-8 text-[#5c584f] whitespace-pre-line">
                  {lesson.content || "ابدأ بحل تمارين التهيئة ثم أعد شرح الفكرة الأساسية في ثلاث خطوات قصيرة. ركز على التمارين المتدرجة، ثم خصّص 5 دقائق للمراجعة النهائية قبل الانتقال إلى الدرس التالي."}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#d9752e]" />
                <h2 className="text-xl font-black">طريقة المراجعة المقترحة</h2>
              </div>

              <div className="rounded-[22px] bg-[#fffaf4] p-5">
                <p className="text-base leading-8 text-[#5c584f] whitespace-pre-line">
                  {lesson.review_method || "راجع الفكرة الأساسية، ثم أعد شرحها بصوتك الخاص، ثم حل تمارين قصيرة من نفس النمط قبل الانتقال إلى الدرس التالي."}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#d9752e]" />
                <h3 className="text-lg font-black">خطوات الدراسة</h3>
              </div>

              <ul className="space-y-3 text-sm text-[#5c584f]">
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#d9752e]" /> قراءتك السريعة للشرح</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#d9752e]" /> تمرين واحد من السهل إلى المتوسط</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#d9752e]" /> مراجعة سريعة وتسجيل الإجابة</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#d9752e]" />
                <h3 className="text-lg font-black">مصادر الدرس</h3>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setResourcesModalOpen(true)}
                  className="flex w-full items-center justify-between gap-2 rounded-2xl bg-[#fffaf4] px-3 py-3 text-sm font-bold text-[#242b38]"
                >
                  <span>قائمة المصادر</span>
                  <Plus className="h-4 w-4 text-[#d9752e]" />
                </button>

                <a href={lesson.content_url || lesson.anki_link || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-2xl bg-[#f3e9dd] px-3 py-3 text-sm font-bold text-[#242b38]">
                  <span>فتح المحتوى</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button type="button" onClick={() => window.open(lesson.anki_link || "https://apps.ankiweb.net/", "_blank", "noopener,noreferrer")} className="flex w-full items-center justify-between gap-2 rounded-2xl bg-[#f3e9dd] px-3 py-3 text-sm font-bold text-[#242b38]">
                  <span>بطاقات أنكي {lesson.anki_count ?? 0}</span>
                  <Sparkles className="h-4 w-4 text-[#d9752e]" />
                </button>

                <button type="button" onClick={() => setShowBacModal(true)} className="flex w-full items-center justify-between gap-2 rounded-2xl bg-[#fffaf4] px-3 py-3 text-sm font-bold text-[#242b38]">
                  <span>ظهور في البكالوريا {lesson.bac_appearances ?? 0}</span>
                  <FileText className="h-4 w-4 text-[#d9752e]" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {sessionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSessionModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#242b38]">نوع الجلسة</h3>
                <button type="button" onClick={() => setSessionModalOpen(false)} className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button type="button" onClick={() => setSessionType("free")} className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-right ${sessionType === "free" ? "border-[#d9752e] bg-[#fff4ea]" : "border-[#f0e5d9] bg-[#fffaf4]"}`}>
                  <span className="font-black text-[#242b38]">جلسة حرة</span>
                  <span className="text-xl">⏱️</span>
                </button>

                <div className={`rounded-[20px] border p-3 ${sessionType === "countdown" ? "border-[#d9752e] bg-[#fff4ea]" : "border-[#f0e5d9] bg-[#fffaf4]"}`}>
                  <button type="button" onClick={() => setSessionType("countdown")} className="flex w-full items-center justify-between text-right">
                    <span className="font-black text-[#242b38]">مؤقت تنازلي</span>
                    <span className="text-xl">⏲️</span>
                  </button>

                  {sessionType === "countdown" && (
                    <div className="mt-3">
                      <label className="mb-2 block text-xs font-black text-[#6f6559]">الوقت بالدقائق</label>
                      <select value={countdownMinutes} onChange={(event) => setCountdownMinutes(Number(event.target.value))} className="w-full rounded-xl border border-[#e8dccb] bg-white px-3 py-2 text-sm outline-none">
                        {[10, 15, 20, 25, 30, 45, 60].map((minute) => <option key={minute} value={minute}>{minute} دقيقة</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <button type="button" onClick={() => setSessionType("pomodoro")} className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-right ${sessionType === "pomodoro" ? "border-[#d9752e] bg-[#fff4ea]" : "border-[#f0e5d9] bg-[#fffaf4]"}`}>
                  <span className="font-black text-[#242b38]">بومودورو</span>
                  <span className="text-xl">🍅</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSessionModalOpen(false)
                  startFocusSession()
                }}
                className="mt-5 w-full rounded-full bg-[#d9752e] px-4 py-3 text-sm font-black text-white"
              >
                موافق وبدء الجلسة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resourcesModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setResourcesModalOpen(false)}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#242b38]">المصادر</h3>
                <button type="button" onClick={() => setResourcesModalOpen(false)} className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <button type="button" onClick={() => setResourceModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#d9752e] px-3 py-2 text-xs font-black text-white">
                  <Plus className="h-3 w-3" />
                  إضافة مصدر
                </button>
              </div>

              <div className="max-h-[55vh] space-y-3 overflow-y-auto">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() => {
                        setSelectedResource(resource)
                        setResourceModalOpen(true)
                      }}
                      className="w-full rounded-[20px] border border-[#f0e5d9] bg-[#fffaf4] p-4 text-right"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-[#242b38]">{resource.title}</p>
                          {resource.description && <p className="mt-1 text-xs text-[#6f6559]">{resource.description}</p>}
                        </div>
                        {resource.created_by !== currentUserId && (
                          <span className="rounded-full bg-[#f6efe7] px-2 py-1 text-[10px] font-black text-[#6f6559]">+{resource.upvotes ?? 0}</span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#d4c2ae] bg-[#fffaf4] p-6 text-center text-sm text-[#6f6559]">
                    لا توجد مصادر مرتبطة بهذا الدرس بعد.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resourceModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => {
            setResourceModalOpen(false)
            setSelectedResource(null)
          }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-xl">
              {selectedResource ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#242b38]">تفاصيل المصدر</h3>
                    <button type="button" onClick={() => { setResourceModalOpen(false); setSelectedResource(null) }} className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3 rounded-[20px] bg-[#fffaf4] p-4 text-right">
                    <p className="font-black text-[#242b38]">{selectedResource.title}</p>
                    <p className="text-sm text-[#6f6559]">{selectedResource.description || "لا يوجد وصف"}</p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <a href={selectedResource.link || "#"} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#d9752e] px-4 py-3 text-center text-sm font-black text-white">
                      أفتح المصدر
                    </a>
                    {selectedResource.created_by !== currentUserId && (
                      <button type="button" onClick={() => voteResource(selectedResource.id)} className="flex-1 rounded-full bg-[#f3e9dd] px-4 py-3 text-sm font-black text-[#242b38]">
                        قيم المصدر
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#242b38]">إضافة مصدر</h3>
                    <button type="button" onClick={() => setResourceModalOpen(false)} className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input value={newResource.title} onChange={(event) => setNewResource((prev) => ({ ...prev, title: event.target.value }))} placeholder="عنوان المصدر" className="w-full rounded-2xl border border-[#e8dccb] bg-[#fffaf4] px-3 py-3 text-sm outline-none" />
                    <textarea value={newResource.description} onChange={(event) => setNewResource((prev) => ({ ...prev, description: event.target.value }))} placeholder="وصف المصدر" className="min-h-24 w-full rounded-2xl border border-[#e8dccb] bg-[#fffaf4] px-3 py-3 text-sm outline-none" />
                    <input value={newResource.link} onChange={(event) => setNewResource((prev) => ({ ...prev, link: event.target.value }))} placeholder="رابط المصدر" className="w-full rounded-2xl border border-[#e8dccb] bg-[#fffaf4] px-3 py-3 text-sm outline-none" />
                  </div>

                  <button type="button" onClick={saveResource} className="mt-5 w-full rounded-full bg-[#d9752e] px-4 py-3 text-sm font-black text-white">
                    حفظ المصدر
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBacModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBacModal(false)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#242b38]">سنوات البكالوريا</h3>
                <button type="button" onClick={() => setShowBacModal(false)} className="rounded-full bg-[#fffaf4] p-2 text-[#6f6559]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {bacYears.length > 0 ? (
                <div className="space-y-2">
                  {bacYears.map((year) => (
                    <div key={year} className="rounded-[18px] border border-[#f0e5d9] bg-[#fffaf4] px-4 py-3 text-right text-sm font-bold text-[#242b38]">
                      {year}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-[#d4c2ae] bg-[#fffaf4] p-6 text-center text-sm text-[#6f6559]">
                  لا توجد سنوات للبكالوريا مرتبطة بهذا الدرس.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
