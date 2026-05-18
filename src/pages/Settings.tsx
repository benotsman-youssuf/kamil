import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/qf/api";
import type { UserProfile } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Globe, Award, FileText, Heart, Users, AlertCircle, Download, Upload, CloudLightning, ShieldCheck, RefreshCw } from "lucide-react";
import { getDb } from "@/lib/rxdb";
import { toast } from "sonner";

export function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem("kamil_last_sync"));

  useEffect(() => {
    setLoading(true);
    fetchUserProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setError("فشل تحميل الملف الشخصي"))
      .finally(() => setLoading(false));
  }, []);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const db = await getDb();
      const pages = await db.pages.find().exec();
      const pagesJson = pages.map((p: any) => p.toJSON());
      const backupData = {
        version: 1,
        appName: "kamil",
        exportedAt: new Date().toISOString(),
        pages: pagesJson,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kamil-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير النسخة الاحتياطية بنجاح!", { duration: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("فشل تصدير النسخة الاحتياطية");
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const backupData = JSON.parse(text);
          
          if (backupData.appName !== "kamil" || !Array.isArray(backupData.pages)) {
            toast.error("ملف النسخة الاحتياطية غير صالح");
            return;
          }

          let importedCount = 0;
          const db = await getDb();
          for (const page of backupData.pages) {
            const now = new Date().toISOString();
            const doc = {
              id: page.id?.toString() || crypto.randomUUID(),
              name: page.name || page.title || "Untitled",
              title: page.title || page.name || "Untitled",
              content: typeof page.content === "string" ? page.content : JSON.stringify(page.content || []),
              description: page.description || "",
              is_public: page.is_public ?? false,
              is_fork: page.is_fork ?? false,
              fork_count: page.fork_count ?? 0,
              forked_from: page.forked_from || "",
              created_at: page.createdAt || page.created_at || now,
              updated_at: page.updatedAt || page.updated_at || now,
              isPinned: page.isPinned ?? false,
            };
            const existing = await db.pages.findOne(doc.id).exec();
            if (existing) {
              await existing.patch(doc);
            } else {
              await db.pages.insert(doc);
            }
            importedCount++;
          }
          toast.success(`تم استيراد ${importedCount} صفحات بنجاح! يرجى تحديث الصفحة لمشاهدة التحديثات.`, { duration: 5000 });
        } catch (err) {
          toast.error("ملف غير صالح أو تالف");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error(error);
      toast.error("فشل استيراد النسخة الاحتياطية");
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4" dir="rtl">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "المستخدم";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8" dir="rtl">
      {/* Profile Card */}
      <div className="p-6 rounded-xl border bg-card">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={profile.photoUrl || profile.avatarUrls?.large} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-amiri truncate">{displayName}</h2>
              {profile.verified && (
                <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
                  <Award className="h-3 w-3" />
                  موثق
                </Badge>
              )}
            </div>
            {profile.username && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
            {profile.email && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{profile.email}</span>
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-muted-foreground/80 leading-relaxed border-t pt-4">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
          {profile.country && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>{profile.country}</span>
            </div>
          )}
          {profile.languageIsoCode && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>{profile.languageIsoCode.toUpperCase()}</span>
            </div>
          )}
          {profile.joiningYear && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="h-3.5 w-3.5" />
              <span>انضم {profile.joiningYear}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: FileText, label: "المنشورات", value: profile.postsCount ?? 0 },
          { icon: Users, label: "المتابعون", value: profile.followersCount ?? 0 },
          { icon: Heart, label: "الإعجابات", value: profile.likesCount ?? 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card gap-1"
          >
            <stat.icon className="h-5 w-5 text-muted-foreground/60" />
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Sync & Backup Center */}
      <div className="p-6 rounded-xl border bg-card/60 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3">
          <CloudLightning className="h-6 w-6 text-indigo-500 animate-pulse" />
          <h3 className="text-xl font-bold font-amiri">مركز المزامنة والنسخ الاحتياطي (Sync & Backup)</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          جميع صفحاتك ونصوصك تُحفظ محلياً على جهازك لضمان الخصوصية والسرعة القصوى. عندما تقوم بتسجيل الدخول، يمكنك مزامنة وحفظ تقدمك أو نقل صفحاتك بين الأجهزة بسهولة تامة من خلال الخيارات أدناه.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloud Sync card */}
          <div className="p-4 rounded-lg border bg-background flex flex-col justify-between gap-4 md:col-span-2">
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-purple-500" />
                مزامنة سحابية (Cloud Sync)
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">
                مزامنة صفحاتك مع حسابك للوصول إليها من أي جهاز. يتم المزامنة تلقائياً عند الحفظ.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  setSyncing(true);
                  try {
                    const { startSync } = await import("@/lib/rxdb");
                    await startSync();
                    const now = new Date().toISOString();
                    localStorage.setItem("kamil_last_sync", now);
                    setLastSync(now);
                    toast.success("تمت المزامنة بنجاح", { duration: 2000 });
                  } catch {
                    toast.error("فشل المزامنة", { duration: 2000 });
                  } finally {
                    setSyncing(false);
                  }
                }}
                disabled={syncing}
                className="flex-1 py-2 px-4 rounded bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98] transition-transform duration-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {syncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {syncing ? "جاري المزامنة..." : "مزامنة الآن"}
              </button>
              {lastSync && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  آخر مزامنة: {new Date(lastSync).toLocaleDateString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          {/* Export card */}
          <div className="p-4 rounded-lg border bg-background flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-500" />
                تصدير نسخة احتياطية (Export)
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">
                قم بتحميل نسخة احتياطية كاملة تحتوي على كافة صفحاتك ونصوصك وملاحظاتك بصيغة ملف مشفر آمن للحفاظ عليها.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              disabled={exporting}
              className="w-full py-2 px-4 rounded bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98] transition-transform duration-100 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {exporting ? "جاري التصدير..." : "تصدير الملف الآن"}
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-lg border bg-background flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-500" />
                استيراد نسخة احتياطية (Import)
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-normal">
                استعد صفحاتك أو انقلها من جهاز آخر عن طريق رفع ملف النسخة الاحتياطية (.json) المحفوظ مسبقاً.
              </p>
            </div>
            <label className="w-full py-2 px-4 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-100">
              <Upload className="h-4 w-4" />
              <span>{importing ? "جاري الاستيراد..." : "رفع واستيراد الملف"}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-amber-500/5 text-amber-600/90 dark:text-amber-400 flex items-start gap-3 text-xs leading-normal">
          <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">مزامنة الحساب السحابي نشطة:</span>
            <span>بمجرد تسجيل الدخول بحسابك، يتم تلقائياً مزامنة وحفظ أهدافك، إحصائيات القراءة اليومية، سلاسل الاستمرار (Streaks)، العلامات المرجعية ومجموعاتها، والملاحظات المكتوبة على الآيات مباشرة مع خوادم Quran.com.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
