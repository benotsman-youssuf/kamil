"use client";

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, BookOpen, Sparkles, ArrowRight, Loader2, Type, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTokens, login } from "@/lib/qf/auth";
import { createPage } from "@/lib/rxdb";

export function Welcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const token = getTokens()?.access_token;

  // No auto-redirect — always show the welcome page so users can create a new page.

  const handleCreatePage = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("يرجى إدخال اسم للصفحة");
      return;
    }

    setLoading(true);
    try {
      const id = await createPage(name.trim());
      navigate(`/pages/${id}`, { replace: true });
    } catch (err) {
      console.error("Error creating page:", err);
      setError("فشل إنشاء الصفحة، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (templateName: string) => {
    setName(templateName);
    setLoading(true);
    try {
      const id = await createPage(templateName);
      navigate(`/pages/${id}`, { replace: true });
    } catch (err) {
      console.error("Error creating page:", err);
      setError("فشل إنشاء الصفحة، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fafafa] via-[#fdfdfd] to-[#f8f8f8] p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8">
            <img src="/logo.png" alt="كمل" className="h-16 w-16 mx-auto rounded-xl shadow-md bg-white" />
            <h1 className="text-3xl font-extrabold mt-4 text-gray-900 font-['Alexandria']">كمّل</h1>
          </div>
          <p className="text-gray-600 mb-8">يرجى تسجيل الدخول للمتابعة</p>
          <Button 
            size="lg" 
            className="w-full gap-2" 
            onClick={() => login()}
          >
            <ArrowRight className="h-4 w-4" />
            تسجيل الدخول بحساب Quran.com
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#fdfdfd] to-[#f8f8f8] flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
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
            <p className="text-gray-600 mt-1">
              ابدأ بكتابة ملاحظاتك، آياتك، وأحاديثك المفضلة
            </p>
          </div>

          <div className="px-6 pb-6 space-y-6">
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pageName" className="text-right font-medium text-sm">
                  اسم الصفحة
                </label>
                <Input
                  id="pageName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: تدبر آيات، ملاحظات القرآن، خواطر..."
                  className="text-right"
                  disabled={loading}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-500 text-right">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full gap-2 py-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري إنشاء الصفحة...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    إنشاء والبدء بالكتابة
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 text-center mb-4">أو اختر من القوالب الجاهزة</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/50 transition-all"
                  onClick={() => handleTemplateSelect("تدبر آيات")}
                  disabled={loading}
                >
                  <BookOpen className="h-6 w-6 mx-auto text-primary" />
                  <span className="font-medium">تدبر آيات</span>
                  <span className="text-xs text-gray-500">صفحة للآيات المفضلة</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/50 transition-all"
                  onClick={() => handleTemplateSelect("خواطر وأفكار")}
                  disabled={loading}
                >
                  <Type className="h-6 w-6 mx-auto text-primary" />
                  <span className="font-medium">خواطر وأفكار</span>
                  <span className="text-xs text-gray-500">صفحة للكتابة الحرة</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">إضافة آيات</p>
            <p className="text-xs text-gray-500">اختصار: /آية</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">أحاديث</p>
            <p className="text-xs text-gray-500">اختصار: /حديث</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
              <Type className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">تنسيق غني</p>
            <p className="text-xs text-gray-500">Markdown مدعوم</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}