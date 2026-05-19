"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDb } from "@/lib/rxdb";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { FileEdit, CloudSync, Share2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const features = [
  {
    icon: FileEdit,
    title: "تحرير النصوص",
    desc: "محرر نصوص متكامل يدعم الآيات القرآنية والأحاديث النبوية مع تنسيق غني",
  },
  {
    icon: CloudSync,
    title: "مزامنة تلقائية",
    desc: "احفظ ومزامن محتواك تلقائياً عبر جميع أجهزتك بأمان",
  },
  {
    icon: Share2,
    title: "نشر ومشاركة",
    desc: "انشر صفحاتك للعالم وشارك معرفتك مع الآخرين بسهولة",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateFirstPage = async () => {
    setLoading(true);
    try {
      const db = await getDb();
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
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("حدث خطأ أثناء إنشاء الصفحة", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 z-0",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "pointer-events-none"
        )}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="شعار كمّل"
              className="h-12 w-12 rounded-xl bg-white shadow-sm ring-1 ring-border/20"
              draggable={false}
            />
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: "Alexandria" }}
            >
              كمّل
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">
            محررك القرآني الأول
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10">
            دوّن آياتك، أنشئ مجموعاتك، وشارك معرفتك مع العالم
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-card border rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ShimmerButton
            onClick={handleCreateFirstPage}
            disabled={loading}
            className="hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            {loading ? "يتم الإنشاء..." : "أنشئ صفحتك الأولى"}
          </ShimmerButton>
          <Button
            variant="outline"
            onClick={() => navigate("/discover")}
            className="gap-2"
          >
            <Compass className="h-4 w-4" />
            اكتشف المقالات العامة
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
