"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("يرجى تأكيد بريدك الإلكتروني أولاً")
        } else {
          setError(signInError.message)
        }
        return
      }

      if (data?.user) {
        setSuccess(true)
        setEmail("")
        setPassword("")
        // إعادة التوجيه إلى الصفحة الرئيسية بعد ثانية
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (err) {
      setError("حدث خطأ. يرجى المحاولة لاحقاً")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee] px-4 py-10">
      <div className="w-full max-w-md">
        {/* ================= LOGO SECTION ================= */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-[#242b38]">Nivo</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9752e] text-2xl font-black text-white">
              N
            </span>
          </div>
        </div>

        {/* ================= LOGIN FORM ================= */}
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(217,117,46,0.25)]">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#fff0e6] px-4 py-2 text-sm font-bold text-[#d9752e]">
              <Sparkles className="h-4 w-4" />
              بكالوريا 2027 — شعبة تسيير واقتصاد
            </div>
            <h1 className="text-3xl font-black text-[#242b38]">
              مرحباً بعودتك إلى <span className="text-[#d9752e]">Nivo</span>
            </h1>
            <p className="mt-3 text-base text-[#6f6559]">
              سجّل الدخول لتكمل رحلتك نحو 20/20
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              ✅ تم تسجيل الدخول بنجاح! جاري التحويل...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#242b38]">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d9752e]" />
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#e8dccb] bg-[#fcf5ee] py-3 pr-11 pl-4 text-left text-sm text-[#242b38] outline-none transition placeholder:text-[#b8a895] focus:border-[#d9752e] focus:ring-2 focus:ring-[#d9752e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#242b38]">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d9752e]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e8dccb] bg-[#fcf5ee] py-3 pr-11 pl-11 text-sm text-[#242b38] outline-none transition placeholder:text-[#b8a895] focus:border-[#d9752e] focus:ring-2 focus:ring-[#d9752e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9752e] transition hover:text-[#c45c1f] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#6f6559]">
                <input type="checkbox" disabled={loading} className="h-4 w-4 rounded accent-[#d9752e] disabled:opacity-50 disabled:cursor-not-allowed" />
                تذكّرني
              </label>
              <a href="#" className="font-bold text-[#d9752e] hover:text-[#c45c1f] transition">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#d9752e] py-3.5 text-lg font-black text-white shadow-lg shadow-[#d9752e]/30 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#6f6559]">
            لست مشتركاً بعد؟{" "}
            <Link href="/subscription" className="inline-flex items-center gap-1 font-black text-[#d9752e] hover:text-[#c45c1f] transition">
              اشترك الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
