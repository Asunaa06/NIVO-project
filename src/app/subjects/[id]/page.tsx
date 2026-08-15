"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BookOpen, Check, ChevronLeft, Compass } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { fetchSubjectData, type LessonRecord } from "@/lib/supabase/data"

export default function SubjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [lessons, setLessons] = useState<LessonRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subjectId = params?.id
    if (!subjectId) return

    const supabase = createClient()

    async function load() {
      try {
        const result = await fetchSubjectData(supabase, subjectId)
        if (!result.user) {
          router.push("/login")
          return
        }
        setSubject(result.subject)
        setLessons(result.lessons)
      } catch {
        setSubject(null)
        setLessons([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [params, router])

  const completedCount = useMemo(
    () => lessons.filter((lesson) => lesson.completed !== undefined && lesson.completed).length,
    [lessons]
  )

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
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] px-5 py-10 text-[#242b38]">
      <div className="mx-auto max-w-4xl">
        <Link href="/city" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f6559]">
          <ChevronLeft className="h-4 w-4" />
          العودة إلى مدينة المواد
        </Link>

        <header className="rounded-[28px] border border-[#e8dccb] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white"
              style={{ backgroundColor: subject.color || "#d9752e" }}
            >
              {subject.icon || "N"}
            </div>

            <div>
              <p className="text-sm font-bold text-[#d9752e]">المادة</p>
              <h1 className="mt-1 text-3xl font-black">{subject.name}</h1>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2 text-[#242b38]">
              <BookOpen className="h-5 w-5 text-[#d9752e]" />
              <span className="font-bold">الدروس</span>
            </div>
            <span className="text-sm font-black text-[#d9752e]">{completedCount} / {lessons.length}</span>
          </div>
        </header>

        <div className="mt-8 rounded-[28px] border border-[#e8dccb] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#d9752e]" />
            <h2 className="text-xl font-black">قائمة الدروس</h2>
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#f0e5d9] bg-[#fffaf4] p-4">
                  <div>
                    <p className="font-black text-[#242b38]">{lesson.title}</p>
                    <p className="text-sm text-[#6f6559]">رقم الدرس: {lesson.order_index ?? "-"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#eefaf3] px-2.5 py-1 text-xs font-black text-[#1f9d61]">
                      {lesson.completed ? "مكتمل" : "قيد التقدم"}
                    </span>
                    <Check className="h-4 w-4 text-[#1f9d61]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d4c2ae] bg-[#fffaf4] p-8 text-center">
              <p className="text-lg font-black text-[#242b38]">لا توجد دروس لهذا الموضوع بعد</p>
              <p className="mt-2 text-[#6f6559]">أضف الدروس إلى جدول <strong>lessons</strong> في Supabase.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}