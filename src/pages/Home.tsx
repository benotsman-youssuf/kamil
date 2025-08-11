"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/magicui/highlighter";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

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
      const page = await db.pages.get(1);

      if (!page) {
        await db.pages.add({
          id: 1,
          name: "مرحباً بك",
          content: JSON.stringify([
            {
              type: "h1",
              id: "welcome-header",
              children: [{ text: "مرحباً بك في كَمِّل" }],
            },
            {
              type: "ul",
              id: "quick-tips",
              children: [
                { type: "li", children: [{ text: "➕ اضغط على (إضافة) لإنشاء صفحة جديدة" }] },
                { type: "li", children: [{ text: "💾 اضغط على (حفظ) لتخزين التغييرات" }] },
                { type: "li", children: [{ text: "🔍 اكتب / لإدراج آية قرآنية" }] },
              ],
            },
            {
              type: "p",
              id: "get-started",
              children: [{ text: "ابدأ الآن 🚀" }],
            },
          ]),
          description: "دليل البداية السريعة",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      navigate(`/pages/1`);
    } catch (error) {
      console.error("Error creating page:", error);
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
          <span className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Alexandria" }}>
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
              variant="outline"
              className="mb-3 cursor-pointer rounded-[14px] border border-white/40 bg-white/60 backdrop-blur-md shadow-sm text-base"
            >
              <SparklesIcon className="mr-2 h-9 w-9 fill-[#EEBDE0] stroke-1 text-neutral-800" />
               محرر نصوص PWA 
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

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ShimmerButton
              onClick={handleStart}
              disabled={loading}
              className="hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              {loading ? "يتم التحميل..." : "ابدأ الكتابة"}
            </ShimmerButton>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-2"
            >
              <a href="https://github.com/benotsman-youssuf/kamil" target="_blank" rel="noopener noreferrer">
                ساهم في المشروع
              </a>
              <Github className="h-6 w-6" />
            </Button>
          </motion.div>

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
            <img src="/logo.png" alt="كمل" className="h-5 w-auto opacity-60" draggable={false} />
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
