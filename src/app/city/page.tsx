"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { fetchCityData, type SubjectRecord } from "@/lib/supabase/data"

export default function CityPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<SubjectRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      setLoading(false)
      setSubjects([])
      return
    }

    async function load() {
      try {
        const result = await fetchCityData(supabase)
        if (!result.user) {
          router.push("/login")
          return
        }
        setSubjects(result.subjects)
      } catch {
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [router])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee]">
        <p className="text-[#242b38] text-lg font-black">جاري تحميل مدينة المواد...</p>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fcf5ee] px-5 py-8 text-[#242b38]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div>
            <p className="text-sm font-bold text-[#d9752e]">مدينة المواد</p>
            <h1 className="mt-2 text-3xl font-black">اختَر مادة لتفتح أبوابها</h1>
            <p className="mt-1 text-sm text-[#6f6559]">كل مادة هي مبنى في مدينة المعرفة</p>
          </div>
        </div>

        {subjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="group rounded-[28px] border border-[#e8dccb] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white"
                    style={{ backgroundColor: subject.color || "#d9752e" }}
                  >
                    {subject.icon || "N"}
                  </div>

                  <Building2 className="h-5 w-5 text-[#d9752e]" />
                </div>

                <h2 className="mt-4 text-xl font-black">{subject.name}</h2>
                <p className="mt-2 text-sm text-[#6f6559]">
                  {subject.description || "مادة دراسية في رحلتك التعليمية"}
                </p>

                <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#6f6559]">
                  <span>الإنجاز</span>
                  <span className="text-[#d9752e]">0%</span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#f2e5d8]">
                  <div className="h-full w-0 rounded-full bg-[#d9752e]" />
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 text-sm font-bold text-[#d9752e]">
                  <span>فتح المادة</span>
                  <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#d4c2ae] bg-white p-10 text-center">
            <p className="text-lg font-black text-[#242b38]">لا توجد مواد متاحة حالياً</p>
            <p className="mt-2 text-[#6f6559]">
              أضف المواد إلى جدول <strong>subjects</strong> في Supabase لعرضها هنا.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}