import Link from "next/link"
import { Check, Crown, Users, Calendar, Sparkles, ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react"
import { SocialLinks } from "@/components/social-links"

type Plan = {
  id: string
  name: string
  price: number
  unit: string
  note?: string
  badge?: string
  featured?: boolean
  icon: React.ReactNode
  perks: string[]
}

const formatPrice = (price: number) => price.toLocaleString("en-US").replace(/,/g, ".")

const plans: Plan[] = [
  {
    id: "term",
    name: "الفصل الواحد",
    price: 800,
    unit: "دج / للفصل",
    icon: <Calendar className="h-6 w-6" />,
    perks: [
      "وصول كامل لمدة فصل دراسي واحد",
      "نظام المراجعة الذكية (Spaced Repetition)",
      "مدينة المواد والدروس التفاعلية",
      "مثالي لتجربة المنصة",
    ],
  },
  {
    id: "annual",
    name: "الاشتراك السنوي",
    price: 2400,
    unit: "دج / للسنة كاملة",
    badge: "الأكثر شعبية",
    featured: true,
    icon: <Crown className="h-6 w-6" />,
    perks: [
      "وصول كامل طوال السنة الدراسية",
      "جميع المواد والدروس والبكالوريات السابقة",
      "المخطط الذكي (Planner) والإحصائيات",
      "الشارات والمكافآت والسلسلة اليومية",
      "أولوية في الدعم والميزات الجديدة",
    ],
  },
  {
    id: "group",
    name: "عرض المجموعة",
    price: 2000,
    unit: "دج / للطالب سنوياً",
    note: "عند اشتراك 3 طلاب معاً",
    badge: "توفير أكبر",
    icon: <Users className="h-6 w-6" />,
    perks: [
      "نفس مزايا الاشتراك السنوي كاملة",
      "توفير 400 دج لكل طالب",
      "ادرسوا معاً وحفّزوا بعضكم البعض",
      "سعر خاص للمجموعات من 3 طلاب",
    ],
  },
]

export default function SubscriptionPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f6efe7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#fff0e6] px-3 py-1 text-xs font-bold text-[#d9752e]">
            <Sparkles className="h-3.5 w-3.5" />
            رحلتك نحو 20/20 تبدأ هنا
          </div>
          <h1 className="text-balance text-4xl font-black text-[#242b38] md:text-5xl">
            اختر خطتك وابدأ التفوق مع <span className="text-[#d9752e]">Nivo</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-[#6f6559]">
            استثمر في نجاحك في البكالوريا. خطط مرنة تناسب الجميع، مع نظام مراجعة ذكي يضمن أنك
            <span className="font-bold text-[#242b38]"> لن تنسى بعد اليوم.</span>
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={[
                "relative flex flex-col rounded-[30px] border-[2px] p-5 pt-6 shadow-[0_10px_30px_rgba(36,43,56,0.06)]",
                plan.featured
                  ? "border-[#d9752e] bg-[#242b38] text-white shadow-[0_18px_40px_rgba(217,117,46,0.22)] md:-translate-y-1"
                  : "border-[#d9752e] bg-white text-[#242b38]",
              ].join(" ")}
            >
              {plan.badge && (
                <span
                  className={[
                    "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[12px] font-black shadow-md",
                    plan.featured ? "bg-[#d9752e] text-white" : "bg-[#fff0e6] text-[#d9752e]",
                  ].join(" ")}
                >
                  {plan.badge}
                </span>
              )}

              <div className="mb-4 flex justify-center">
                <div
                  className={[
                    "inline-flex h-14 w-14 items-center justify-center rounded-full border-2",
                    plan.featured
                      ? "border-[#d9752e] bg-[#d9752e] text-white"
                      : "border-[#d9752e] bg-[#fff0e6] text-[#d9752e]",
                  ].join(" ")}
                >
                  {plan.icon}
                </div>
              </div>

              <h2 className="text-center text-[26px] font-black leading-tight text-current">{plan.name}</h2>

              {plan.note && (
                <p className="mt-2 text-center text-[13px] font-bold text-[#d9752e]">{plan.note}</p>
              )}

              <div className="mt-5 flex items-end justify-center gap-2 text-right">
                <span className="text-[40px] font-black leading-none text-current">{formatPrice(plan.price)}</span>
                <span
                  className={[
                    "pb-1 text-[14px] font-medium",
                    plan.featured ? "text-white/75" : "text-[#6f6559]",
                  ].join(" ")}
                >
                  {plan.unit}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-right">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start justify-end gap-2 text-right">
                    <span className={plan.featured ? "text-white/90" : "text-[#6f6559]"}>{perk}</span>
                    <Check
                      className={[
                        "mt-1 h-4 w-4 shrink-0",
                        plan.featured ? "text-[#d9752e]" : "text-[#d9752e]",
                      ].join(" ")}
                    />
                  </li>
                ))}
              </ul>

              <a
                href="#payment"
                className={[
                  "mt-7 inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-3 text-[18px] font-black transition duration-200",
                  plan.featured
                    ? "border-[#d9752e] bg-[#d9752e] text-white hover:brightness-110"
                    : "border-[#d9752e] bg-transparent text-[#d9752e] hover:bg-[#d9752e] hover:text-white",
                ].join(" ")}
              >
                <ArrowLeft className="h-4 w-4" />
                اشترك الآن
              </a>
            </div>
          ))}
        </div>

        <div
          id="payment"
          className="mx-auto mt-14 max-w-3xl scroll-mt-8 rounded-[30px] border border-[#e8dccb] bg-white p-8 text-center shadow-lg shadow-black/5"
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#d9752e]">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-black text-[#242b38]">كيفية الدفع وتفعيل الاشتراك</h3>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-[#6f6559]">
            بعد اختيار الخطة المناسبة، تواصل معنا عبر إحدى منصات التواصل بالأسفل
            <span className="font-bold text-[#242b38]"> وأرسل لنا صورة إثبات الدفع</span> ليتم تفعيل حسابك مباشرة.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6f6559]">
            <ShieldCheck className="h-5 w-5 text-[#d9752e]" />
            تفعيل سريع وآمن خلال دقائق من استلام الإثبات
          </div>

          <div className="mt-8">
            <p className="mb-4 font-bold text-[#242b38]">تواصل معنا وأرسل إثبات الدفع عبر:</p>
            <SocialLinks />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-[#6f6559]">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-black text-[#d9752e] hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  )
}
