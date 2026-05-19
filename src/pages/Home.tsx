"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import chrome from "@/assets/chrome-logo.svg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/magicui/highlighter";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

import { getDb } from "@/lib/rxdb";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    title: "تحرير النصوص",
    desc: "محرر نصوص متكامل يدعم الآيات القرآنية والأحاديث النبوية مع تنسيق غني",
  },
  {
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "مزامنة تلقائية",
    desc: "احفظ ومزامن محتواك تلقائياً عبر جميع أجهزتك بأمان",
  },
  {
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: "نشر ومشاركة",
    desc: "انشر صفحاتك للعالم وشارك معرفتك مع الآخرين بسهولة",
  },
];

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowHighlight(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const db = await getDb();
      const pages = await db.pages.find().exec();

      if (pages.length === 0) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await db.pages.insert({
          id,
          name: "صفحتي الأولى",
          title: "صفحتي الأولى",
          content: JSON.stringify([]),
          description: "",
          created_at: now,
          updated_at: now,
          is_public: false,
          is_fork: false,
          fork_count: 0,
          forked_from: "",
        });
        navigate(`/pages/${id}`);
      } else {
        navigate(`/pages/${pages[0].id}`);
      }
    } catch (error) {
      console.error("Error navigating:", error);
      alert("حدث خطأ أثناء تحميل الصفحة، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-[#fafafa] via-[#fdfdfd] to-[#f8f8f8] text-gray-900 font-['Rubik'] flex flex-col overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Alexandria" }}
    >
      {/* Background Pattern */}
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

      {/* Header */}
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-20 sm:py-32">
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

          {/* Main Heading */}
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

          {/* Highlighted Title */}
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

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            لا تتكبد عناء التنقل بين التطبيقات لنقل آية
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                    <Icon />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-gray-800">{f.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ShimmerButton
              onClick={handleStart}
              disabled={loading}
              className="hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              {loading ? "يتم التحميل..." : "اكتب"}
            </ShimmerButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/discover")}
              className="border-gray-300 hover:border-gray-400 hover:bg-white/80 transition-colors flex items-center gap-2"
            >
              <Compass className="h-4 w-4" />
              اكتشف المقالات
            </Button>
          </motion.div>

          {/* GitHub Link */}
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

          {/* Screenshot */}
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
      </main>

      {/* Footer */}
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
