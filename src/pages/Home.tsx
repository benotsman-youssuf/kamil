"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Plus, ArrowRight, Loader2, BookOpen, Type, PenTool, Sparkles } from "lucide-react";
import chrome from "@/assets/chrome-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/magicui/highlighter";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { getValidAccessToken } from "@/lib/qf/auth";
import { createPage } from "@/lib/rxdb";
import { cn } from "@/lib/utils";

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [welcomeLoading, setWelcomeLoading] = useState(false);
  const [welcomeError, setWelcomeError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowHighlight(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    const token = await getValidAccessToken();
    if (token) {
      setShowWelcome(true);
    } else {
      const loginModule = await import("@/lib/qf/auth");
      loginModule.login();
    }
    setLoading(false);
  };

  const handleCreatePage = async (e: FormEvent) => {
    e.preventDefault();
    setWelcomeError(null);
    if (!welcomeName.trim()) {
      setWelcomeError("يرجى إدخال اسم للصفحة");
      return;
    }
    setWelcomeLoading(true);
    try {
      const id = await createPage(welcomeName.trim());
      navigate(`/pages/${id}`, { replace: true });
    } catch (err) {
      setWelcomeError("فشل إنشاء الصفحة، حاول مرة أخرى");
    } finally {
      setWelcomeLoading(false);
    }
  };

  const handleTemplateSelect = async (templateName: string) => {
    setWelcomeName(templateName);
    setWelcomeLoading(true);
    try {
      const id = await createPage(templateName);
      navigate(`/pages/${id}`, { replace: true });
    } catch (err) {
      setWelcomeError("فشل إنشاء الصفحة، حاول مرة أخرى");
    } finally {
      setWelcomeLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-[#fafafa] via-[#fdfdfd] to-[#f8f8f8] text-gray-900 font-['Rubik'] flex flex-col overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Alexandria" }}
    >
      <AnimatedGridPattern
        numSquares={80}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 z-0",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "skew-y-12 pointer-events-none"
        )}
      />

      <header className="w-full flex flex-col items-center py-7 gap-3">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="شعار التطبيق"
            className="h-16 w-16 rounded-md bg-white shadow"
            draggable={false}
          />
          <span
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "Alexandria" }}
          >
            كمّل
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-20 sm:py-32">
        {!showWelcome ? (
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 font-bold"
          >
            <Badge
              asChild
              variant="outline"
              className="group mb-3 cursor-pointer rounded-full border-2 border-white/40 bg-white/60 px-4 py-2 text-base font-medium text-gray-900 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md"
            >
              <a
                href="https://cdn.jsdelivr.net/gh/benotsman-youssuf/quranJson@main/extention.crx"
                download="kamil-extension.crx"
                className="flex items-center gap-2"
              >
                <img
                  src={chrome}
                  alt="Chrome Extension"
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                />
                <span>إضافة المتصفح</span>
              </a>
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-8 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span style={{ position: "relative", display: "inline-block" }}>
              أورد{" "}
              <Highlighter action="underline" color="#FFD1DC">
                آياتك
              </Highlighter>{" "}
              مع محرر
            </span>
          </motion.h1>

          <div>
            {showHighlight ? (
              <Highlighter action="highlight" color="#87CEFA">
                <motion.h1
                  ref={headingRef}
                  className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  كمّل
                </motion.h1>
              </Highlighter>
            ) : (
              <motion.h1
                ref={headingRef}
                className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ visibility: "hidden" }}
              >
                كمّل
              </motion.h1>
            )}
          </div>

          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            لا تتكبد عناء التنقل بين التطبيقات لنقل آية
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ShimmerButton
              onClick={handleStart}
              disabled={loading}
              className="hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg"
            >
              {loading ? "يتم التحميل..." : "ابدأ الكتابة"}
            </ShimmerButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/discover")}
              className="h-11 px-6 border-gray-300 hover:border-gray-400 hover:bg-white/80 transition-all flex items-center gap-2 text-sm"
            >
              <Compass className="h-4 w-4" />
              اكتشف
            </Button>
          </motion.div>

          <motion.a
            href="https://github.com/benotsman-youssuf/kamil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            ساهم في المشروع
          </motion.a>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200/40 to-pink-200/40 rounded-2xl blur-2xl opacity-40" />
              <img
                src="/image.png"
                alt="لقطة شاشة من واجهة كمل"
                className="relative w-full h-full rounded-xl shadow-lg border border-gray-200"
                loading="lazy"
                draggable={false}
              />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <img src="/logo.png" alt="كمل" className="h-14 w-14 mx-auto rounded-xl shadow-md bg-white mb-4" />
            <h1 className="text-4xl font-extrabold text-gray-900 font-['Alexandria'] mb-2">مرحباً بك في كمّل</h1>
            <p className="text-gray-600 text-lg">مساحتك الخاصة لكتابة الأفكار والملاحظات مع الآيات والأحاديث</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg">
            <div className="text-center pb-4 pt-6 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <PenTool className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">أنشئ صفحتك الأولى</h2>
              <p className="text-gray-600 mt-1">ابدأ بكتابة ملاحظاتك، آياتك، وأحاديثك المفضلة</p>
            </div>

            <div className="px-6 pb-6 space-y-6">
              <form onSubmit={handleCreatePage} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pageName" className="text-right font-medium text-sm">اسم الصفحة</label>
                  <Input
                    id="pageName"
                    value={welcomeName}
                    onChange={(e) => setWelcomeName(e.target.value)}
                    placeholder="مثال: تدبر آيات، ملاحظات القرآن، خواطر..."
                    className="text-right"
                    disabled={welcomeLoading}
                    autoFocus
                  />
                  {welcomeError && <p className="text-sm text-red-500 text-right">{welcomeError}</p>}
                </div>

                <Button type="submit" disabled={welcomeLoading || !welcomeName.trim()} className="w-full gap-2 py-3 text-lg">
                  {welcomeLoading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> جاري إنشاء الصفحة...</>
                  ) : (
                    <><Plus className="h-5 w-5" /> إنشاء والبدء بالكتابة <ArrowRight className="h-5 w-5" /></>
                  )}
                </Button>
              </form>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 text-center mb-4">أو اختر من القوالب الجاهزة</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-24 flex flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/50 transition-all" onClick={() => handleTemplateSelect("تدبر آيات")} disabled={welcomeLoading}>
                    <BookOpen className="h-6 w-6 mx-auto text-primary" />
                    <span className="font-medium">تدبر آيات</span>
                    <span className="text-xs text-gray-500">صفحة للآيات المفضلة</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/50 transition-all" onClick={() => handleTemplateSelect("خواطر وأفكار")} disabled={welcomeLoading}>
                    <Type className="h-6 w-6 mx-auto text-primary" />
                    <span className="font-medium">خواطر وأفكار</span>
                    <span className="text-xs text-gray-500">صفحة للكتابة الحرة</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2"><Sparkles className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-gray-900">إضافة آيات</p>
              <p className="text-xs text-gray-500">اختصار: /آية</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2"><BookOpen className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-gray-900">أحاديث</p>
              <p className="text-xs text-gray-500">اختصار: /حديث</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2"><Type className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-gray-900">تنسيق غني</p>
              <p className="text-xs text-gray-500">Markdown مدعوم</p>
            </div>
          </motion.div>
        </div>
      )}
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="كمل"
              className="h-5 w-auto opacity-60"
              draggable={false}
            />
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="relative group">
              <span className="group-hover:underline decoration-2 decoration-gray-400 transition-all">
                الشروط والأحكام
              </span>
            </a>
            <a href="#" className="relative group">
              <span className="group-hover:underline decoration-2 decoration-gray-400 transition-all">
                سياسة الخصوصية
              </span>
            </a>
          </div>
          <p>© 2024 كمل. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}