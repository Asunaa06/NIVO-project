"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  CalendarDays,
  Flame,
  Layers3,
  LineChart,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fcf5ee] text-[#202737]"
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="border-b border-[#eadfd4] bg-[#fcf5ee]">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[20px] font-black">Nivo</span>

            <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[#df762f] text-[14px] font-black text-white">
              N
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-7 text-[14px] text-[#77736e]">

            <a href="#features" className="transition hover:text-[#202737]">
              المميزات
            </a>

            <a href="#method" className="transition hover:text-[#202737]">
              المنهجية
            </a>

            <a href="#gamification" className="transition hover:text-[#202737]">
              التحفيز
            </a>

          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">

            <Link
              href="/login"
              className="text-[13px] font-medium text-[#55514d] transition hover:text-[#202737]"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/subscription"
              className="rounded-full bg-[#df762f] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#c9661f]"
            >
              ابدأ الآن
            </Link>

          </div>

        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-5 pb-[105px] pt-[75px]">

        <div className="grid grid-cols-2 items-center gap-[45px]">

          {/* ================= HERO TEXT ================= */}

          <div className="order-1">

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfd4] bg-[#fffaf5] px-3 py-1.5 text-[13px] font-bold text-[#887e75]">

              بكالوريا 2027 — شعبة تسيير واقتصاد

              <Sparkles
                size={11}
                className="text-[#df762f]"
              />

            </div>


            <h1 className="text-[68px] font-black leading-[1.12] tracking-[-1.5px]">

              التعلم الذكي
              <br />
              يبدأ من هنا.

            </h1>


            <p className="mt-5 max-w-[470px] text-[18px] leading-[2] text-[#6f6a65]">

              Nivo منصة تجمع بين المراجعة المتباعدة، نظام ليتر، وعلم
              النفس التربوي لتثبيت دروسك في الذاكرة طويلة المدى. لا
              تنسَ ما تدرسه اليوم.

            </p>


            {/* Buttons */}
            <div className="mt-6 flex items-center gap-2">

              <Link
                href="/subscription"
                className="rounded-lg bg-[#df762f] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#c9661f]"
              >
                رحلتك نحو 20/20 تبدأ هنا
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-[#e5dbd2] bg-[#fffaf5] px-4 py-2.5 text-[13px] font-bold text-[#6f6a65] transition hover:border-[#df762f] hover:text-[#202737]"
              >
                اكتشف المميزات
              </a>

            </div>


            {/* Stats */}
            <div className="mt-7 flex items-center justify-start gap-8">

              <Stat
                label="خوارزمية المراجعة"
                value="SM-2"
              />

              <Stat
                label="أدراج ليتر"
                value="7 مستويات"
              />

              <Stat
                label="مواد الشعبة"
                value="10 مواد"
              />

            </div>

          </div>


          {/* ================= HERO IMAGE ================= */}

          <div className="relative order-2">

            <div className="relative mx-auto max-w-[480px]">

              {/* Image */}
              <div className="rounded-[25px] border border-[#eadfd4] bg-[#f8eee4] p-2.5 shadow-[0_18px_45px_rgba(45,38,30,0.08)]">

                <img
                  src="/nivo-city.png"
                  alt="Nivo City"
                  className="block aspect-square w-full rounded-[19px] object-cover"
                />

              </div>


              {/* Floating top badge */}

              <div className="absolute -right-[3px] -top-[10px] flex items-center gap-2 rounded-lg border border-[#e9dfd6] bg-white px-3 py-2 text-[11px] font-bold shadow-[0_7px_20px_rgba(40,35,30,0.12)]">

                <Sparkles
                  size={12}
                  className="text-[#8269c3]"
                />

                مراجعة ذكية

              </div>


              {/* Floating bottom badge */}

              <div className="absolute -bottom-3 left-[8px] flex items-center gap-2 rounded-lg border border-[#e9dfd6] bg-white px-3 py-2 shadow-[0_7px_20px_rgba(40,35,30,0.12)]">

                <Flame
                  size={13}
                  className="text-[#df762f]"
                />

                <span className="text-[11px] font-bold">
                  سلسلة 12 يوم
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="mx-auto max-w-[1400px] scroll-mt-[80px] px-5 pb-[100px]"
      >

        <div className="mx-auto max-w-[600px] text-center">

          <h2 className="text-[36px] font-black leading-[1.3]">
            كل ما تحتاجه لتتفوق، في مكان واحد
          </h2>

          <p className="mt-3 text-[14px] leading-7 text-[#817b75]">
            Nivo ليست مجرد منصة دروس، بل نظام متكامل يجمع التكنولوجيا
            والتصميم وعلم النفس التربوي.
          </p>

        </div>


        {/* Cards */}

        <div className="mt-12 grid grid-cols-2 gap-4">

          {/* أدراج ليتر */}
          <FeatureCard
            href="/dashboard"
            icon={<Layers3 size={19} />}
            iconStyle="bg-[#eee9ff] text-[#8269c3]"
            title="أدراج ليتر"
            text="ستة أدراج تنقل بينها دروسك حسب إتقانك، مع تغير ألوان الملفات."
          />


          {/* المراجعة المتباعدة */}
          <FeatureCard
            href="/dashboard"
            icon={<RefreshCw size={19} />}
            iconStyle="bg-[#fff0e6] text-[#df762f]"
            title="المراجعة المتباعدة"
            text="خوارزمية SM-2 تعيد جدولة كل درس في الوقت المثالي قبل أن تنساه تماماً."
          />


          {/* المنظم الذكي */}
          <FeatureCard
            href="/planner"
            icon={<CalendarDays size={19} />}
            iconStyle="bg-[#fff0e6] text-[#d99465]"
            title="المنظم الذكي"
            text="تقويم بالتواريخ الهجرية والميلادية، الأعياد الجزائرية ومواعيد المراجعة."
          />


          {/* مديرة الموارد */}
          <FeatureCard
            href="/city"
            icon={<BarChart3 size={19} />}
            iconStyle="bg-[#e6f5ed] text-[#4d9b6e]"
            title="مديرة الموارد"
            text="عالم متفاعل، كل بناء مادة وثلاثة ألوان: دروس، مراجعة، بكالوريا."
          />


          {/* تقييم المصادر */}
          <FeatureCard
            href="/lesson"
            icon={<Award size={19} />}
            iconStyle="bg-[#e6f5ed] text-[#4d9b6e]"
            title="تقييم المصادر"
            text="قيّم أفضل مصادر يوتيوب والملخصات بخمس نجوم وشاركها مع زملائك."
          />


          {/* إحصائيات دقيقة */}
          <FeatureCard
            href="/statistics"
            icon={<LineChart size={19} />}
            iconStyle="bg-[#eee9ff] text-[#8269c3]"
            title="إحصائيات دقيقة"
            text="تحليل نقاط القوة والضعف وتوزيع وقتك على المواد وتطور مستواك."
          />

        </div>

      </section>


      {/* =====================================================
          SCIENTIFIC METHOD
      ===================================================== */}

      <section
        id="method"
        className="scroll-mt-[64px] bg-[#222c3b] px-5 py-[70px] text-white"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="text-center">

            <h2 className="text-[38px] font-black">
              المنهجية العلمية وراء Nivo
            </h2>

            <p className="mt-3 text-[14px] text-white/55">
              نظام ليتر مدمج مع المراجعة المتباعدة (SM-2) —
              طريقة مثبتة علمياً لمحاربة النسيان.
            </p>

          </div>


          {/* Four steps */}

          <div className="mt-10 grid grid-cols-4 gap-4">

            <MethodCard
              href="/city"
              number="1"
              title="ادرس الدرس"
              text="ابدأ درساً من مديرة المواد، وسجل وقت دراستك بالمؤقت الذكي."
            />

            <MethodCard
              href="/lesson"
              number="2"
              title="قيّم إتقانك"
              text="بعد المراجعة، حدد سهل، متوسط، أو صعب — لضبط الجدولة القادمة."
            />

            <MethodCard
              href="/dashboard"
              number="3"
              title="انتقل بين الأدراج"
              text="يرتفع الدرس درجة عند النجاح، فتتباعد المراجعات: 1، 2، 4، 7، 14، 30، 60 يوماً."
            />

            <MethodCard
              href="/statistics"
              number="4"
              title="لن تنسى أبداً"
              text="تثبت المعلومات في الذاكرة طويلة المدى قبل موعد البكالوريا بأمان."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          GAMIFICATION / CTA
      ===================================================== */}

      <section
        id="gamification"
        className="mx-auto max-w-[1400px] scroll-mt-[64px] px-5 py-[75px]"
      >

        <div className="grid grid-cols-2 items-center gap-[70px]">


          {/* ================= RIGHT TEXT ================= */}

          <div>

            <h2 className="text-[40px] font-black leading-[1.3]">

              الدراسة تصبح لعبة
              <br />
              تستحق الاستمرار

            </h2>

            <p className="mt-4 max-w-[500px] text-[14px] leading-7 text-[#817b75]">

              حولنا كل جلسة مراجعة إلى إنجاز، نقاط، مستويات، وسلاسل
              تبقيك متحمساً حتى يوم البكالوريا.

            </p>


            <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6">

              <Info
                icon={<Flame size={16} />}
                title="السلسلة اليومية"
                text="حافظ على دراستك يوماً بعد يوم واحصد سلسلة لا تنقطع."
              />

              <Info
                icon={<Award size={16} />}
                title="الشارات"
                text="أنجز 10 دروس، سلسلة 7 أيام، والمزيد من الشارات الأخرى بانتظارك."
              />

              <Info
                icon={<Target size={16} />}
                title="هدفك الشخصي"
                text="حدد هدفك المستهدف وتابع إنجازاتك خطوة بخطوة."
              />

              <Info
                icon={<BarChart3 size={16} />}
                title="مستويات Nivo"
                text="كل مادة تتطور من N1 إلى N7 كلما راجعت أكثر."
              />

            </div>

          </div>


          {/* ================= ORANGE CTA ================= */}

          <div className="relative overflow-hidden rounded-[28px] bg-[#df762f] p-9 text-white shadow-[0_20px_50px_rgba(220,110,40,0.20)]">

            <div className="relative">

              <p className="text-[13px] font-bold text-white/75">
                مديرة المعرفة في انتظارك
              </p>

              <h3 className="mt-3 text-[32px] font-black leading-[1.5]">

                انضم إلى Nivo وابدأ
                <br />
                رحلتك نحو التفوق اليوم.

              </h3>

              <Link
                href="/subscription"
                className="mt-5 inline-flex rounded-lg bg-[#202a39] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#151d29]"
              >
                ابدأ مجاناً
              </Link>

              <p className="mt-4 text-[11px] text-white/65">
                التعلم الذكي يبدأ من هنا — لا تنسَ بعد اليوم.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#eadfd4] bg-white">

        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5">

          <p className="text-[11px] text-[#77736e]">
            © 2026 Nivo — منصة تعليمية لطلاب البكالوريا في الجزائر
          </p>

          <p className="text-[13px] font-bold text-[#34302c]">
            التعلم الذكي يبدأ من هنا.
          </p>

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <p className="text-[10px] text-[#9a938d]">
        {label}
      </p>

      <p className="mt-1 text-[18px] font-black">
        {value}
      </p>
    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  href,
  icon,
  iconStyle,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  iconStyle: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group block min-h-[155px] rounded-[17px] border border-[#e7ddd4] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#df762f] hover:shadow-[0_12px_35px_rgba(40,35,30,0.07)]"
    >

      <div
        className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full ${iconStyle}`}
      >
        {icon}
      </div>

      <h3 className="text-[18px] font-black">
        {title}
      </h3>

      <p className="mt-3 text-[13px] leading-7 text-[#8b8580]">
        {text}
      </p>

    </Link>
  );
}


/* =========================================================
   METHOD CARD
========================================================= */

function MethodCard({
  href,
  number,
  title,
  text,
}: {
  href: string;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="block min-h-[170px] rounded-[15px] border border-white/[0.08] bg-[#2b3545] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#e77b31]/60 hover:bg-[#333e51]"
    >

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e77b31] text-[13px] font-black">
        {number}
      </div>

      <h3 className="text-[16px] font-black">
        {title}
      </h3>

      <p className="mt-3 text-[13px] leading-7 text-white/50">
        {text}
      </p>

    </Link>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function Info({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0e6] text-[#df762f]">
        {icon}
      </div>

      <div>

        <h3 className="text-[14px] font-black">
          {title}
        </h3>

        <p className="mt-1 text-[12px] leading-6 text-[#89827c]">
          {text}
        </p>

      </div>

    </div>
  );
}