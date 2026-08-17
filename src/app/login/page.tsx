"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetError, setResetError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!supabase) {
      setError("خدمة تسجيل الدخول غير متاحة حاليًا. الرجاء مراجعة إعدادات Supabase.")
      setLoading(false)
      return
    }

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

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetError(null)

    const trimmedEmail = resetEmail.trim()
    if (!trimmedEmail) {
      setResetError("يرجى إدخال البريد الإلكتروني أولاً")
      return
    }

    if (!supabase) {
      setResetError(
        "خدمة استعادة كلمة المرور غير متاحة حاليًا. أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في ملف .env.local ثم أعد التشغيل."
      )
      return
    }

    setResetLoading(true)

    try {
      const { error: resetPasswordError } = await supabase.auth.resetPasswordForEmail(trimmedEmail)

      if (resetPasswordError) {
        throw resetPasswordError
      }

      setToast({
        type: "success",
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      })
      setShowForgotModal(false)
      setResetEmail("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء إرسال رابط الاستعادة"
      setResetError(message)
      setToast({
        type: "error",
        message: message,
      })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf5ee] px-4 py-10">
      {toast && (
        <div className="fixed left-1/2 top-5 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg backdrop-blur-sm">
          <div
            className={[
              "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
              toast.type === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700",
            ].join(" ")}
          >
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} className="text-current opacity-80 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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

            <div className="flex items-center justify-end text-sm">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setResetEmail(email || "")
                  setResetError(null)
                  setShowForgotModal(true)
                }}
                className="font-bold text-[#d9752e] transition hover:text-[#c45c1f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                نسيت كلمة المرور؟
              </button>
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

      {showForgotModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#242b38]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[#e8dccb] bg-white p-6 shadow-[0_25px_60px_rgba(36,43,56,0.25)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#242b38]">استعادة كلمة المرور</h2>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false)
                  setResetError(null)
                }}
                className="rounded-full p-2 text-[#6f6559] transition hover:bg-[#f6efe7] hover:text-[#242b38]"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="mb-2 block text-sm font-bold text-[#242b38]">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d9752e]" />
                  <input
                    id="reset-email"
                    type="email"
                    dir="ltr"
                    required
                    disabled={resetLoading}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#e8dccb] bg-[#fcf5ee] py-3 pr-11 pl-4 text-left text-sm text-[#242b38] outline-none transition placeholder:text-[#b8a895] focus:border-[#d9752e] focus:ring-2 focus:ring-[#d9752e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {resetError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {resetError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false)
                    setResetError(null)
                  }}
                  className="rounded-xl border border-[#e8dccb] px-4 py-2.5 text-sm font-bold text-[#242b38] transition hover:bg-[#f6efe7]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="rounded-xl bg-[#d9752e] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-[#d9752e]/30 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "جاري الإرسال..." : "إرسال"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
