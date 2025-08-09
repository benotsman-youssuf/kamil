import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Rocket, BookOpen, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(var(--vh,1vh)*100)] bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Top nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-600/10 ring-1 ring-emerald-600/20" />
          <span className="text-xl font-bold tracking-tight text-emerald-700">إتقان</span>
        </div>
        <nav className="hidden gap-7 text-sm text-emerald-900/80 md:flex">
          <a href="#features" className="hover:text-emerald-700">المزايا</a>
          <a href="#showcase" className="hover:text-emerald-700">العرض</a>
          <a href="#faq" className="hover:text-emerald-700">الأسئلة</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/pages/1">
            <Button className="group rounded-xl bg-emerald-700 px-4 text-white hover:bg-emerald-800">
              ابدأ الآن
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-12 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16 lg:gap-14 lg:py-24">
          <div className="[direction:rtl]">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs text-emerald-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              بناء مستقبل التقنيات القرآنية
            </p>
            <h1 className="text-balance text-4xl font-black leading-tight text-emerald-900 sm:text-5xl md:text-6xl">
              خدمة كتاب الله غايتُنا الكبرى
            </h1>
            <p className="mt-5 max-w-prose text-pretty text-lg leading-8 text-emerald-900/70">
              نبني أكبر مجتمع مطوّرين للأدوات والخدمات القرآنية مفتوحة المصدر، لنجعل الوصول للقرآن أسهل وأجمل لجميع المسلمين حول العالم.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pages/1">
                <Button size="lg" className="rounded-xl bg-emerald-700 px-6 text-white hover:bg-emerald-800">انضم الآن</Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="rounded-xl border-emerald-200 bg-white/70 text-emerald-800 hover:bg-emerald-50">استكشف المزايا</Button>
              </a>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-1 shadow-2xl shadow-emerald-900/10">
              <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white">
                <div className="grid w-full grid-cols-3 gap-2 p-4 sm:gap-3 sm:p-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-100"
                    >
                      <div className="flex h-full items-center justify-center">
                        <Sparkles className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center [direction:rtl]">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">لماذا مجتمعنا؟</h2>
          <p className="mt-3 text-emerald-900/70">قيمة عالية، جودة تنفيذ، وتأثير واسع.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Rocket className="h-5 w-5 text-emerald-700" />} title="انطلاقة سريعة" desc="قوالب جاهزة ومكتبات قوية لتسريع التطوير." />
          <Feature icon={<Shield className="h-5 w-5 text-emerald-700" />} title="ثقة واستقرار" desc="معايير جودة صارمة ومراجعات مجتمعية." />
          <Feature icon={<Users className="h-5 w-5 text-emerald-700" />} title="مجتمع داعم" desc="تعلّم وتعاون مع نخبة من المطورين." />
          <Feature icon={<BookOpen className="h-5 w-5 text-emerald-700" />} title="توثيق شامل" desc="أدلة واضحة وأمثلة عملية لكل أداة." />
          <Feature icon={<Sparkles className="h-5 w-5 text-emerald-700" />} title="تجربة أنيقة" desc="تصاميم جميلة ومتّسقة مبنية على Tailwind." />
          <Feature icon={<ArrowRight className="h-5 w-5 text-emerald-700" />} title="جاهز للإنتاج" desc="أداء عالي وقابلية توسّع على المدى الطويل." />
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-3 mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-14 text-white sm:mx-auto sm:max-w-7xl sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_100%_-50%,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative grid items-center gap-8 md:grid-cols-2 [direction:rtl]">
          <div>
            <h3 className="text-3xl font-black leading-tight sm:text-4xl">ساهم اليوم في بناء أدوات تخدم القرآن الكريم</h3>
            <p className="mt-3 text-white/85">انضم إلى مئات المساهمين، وابدأ أول مساهمة لك الآن.</p>
          </div>
          <div className="flex justify-start gap-3 md:justify-end">
            <Link to="/pages/1">
              <Button size="lg" className="rounded-xl bg-white px-6 text-emerald-800 hover:bg-emerald-50">ابدأ المساهمة</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="rounded-xl border-white/40 bg-transparent text-white hover:bg-white/10">تعرّف أكثر</Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 pb-10 text-sm text-emerald-900/60 [direction:rtl]">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-emerald-100 pt-6 sm:flex-row">
          <p>© {new Date().getFullYear()} إتقان. جميع الحقوق محفوظة.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-emerald-800">سياسة الخصوصية</a>
            <a href="#" className="hover:text-emerald-800">الشروط</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-emerald-100/60 opacity-0 blur-2xl transition group-hover:opacity-100" />
      <div className="flex items-center gap-3 [direction:rtl]">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600/10 ring-1 ring-emerald-600/20">
          {icon}
        </span>
        <div>
          <h3 className="font-semibold text-emerald-900">{title}</h3>
          <p className="mt-1 text-sm text-emerald-900/70">{desc}</p>
        </div>
      </div>
    </div>
  );
}