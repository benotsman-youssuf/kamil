"use client";

import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  fetchBookmarks,
  fetchAllNotes,
  fetchCollections,
  fetchStreaks,
  fetchActivityDays,
  fetchGoals,
} from "@/lib/qf/api";
import type {
  UserProfile, NoteItem, CollectionItem, StreakItem, ActivityDay, Goal,
} from "@/lib/qf/api";
import { getDb } from "@/lib/rxdb";
import type { PageDocType } from "@/lib/rxdb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  BookMarked, FileText, FolderOpen, Bookmark, Award, Flame, Calendar, TrendingUp, Target, PenLine, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SURAH_NAMES } from "@/constants/surahs";

function countWordsInContent(content: string): number {
  try {
    const doc = JSON.parse(content);
    let text = "";
    function walk(node: any) {
      if (node.text) text += node.text + " ";
      if (node.content) node.content.forEach(walk);
    }
    walk(doc);
    return text.trim().split(/\s+/).filter(Boolean).length;
  } catch {
    return typeof content === "string"
      ? content.trim().split(/\s+/).filter(Boolean).length
      : 0;
  }
}

function getDateDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function getLast30Days() {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getLast365Days() {
  const days: string[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
}

function computeWritingStreak(writingDays: Set<string>) {
  const today = new Date().toISOString().slice(0, 10);
  let current = 0;
  const cursor = new Date(today);
  while (writingDays.has(cursor.toISOString().slice(0, 10))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longest = 0;
  let streak = 0;
  const sorted = [...writingDays].sort();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { streak = 1; longest = Math.max(longest, streak); continue; }
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    streak = diff === 1 ? streak + 1 : 1;
    longest = Math.max(longest, streak);
  }
  return { current, longest };
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
      <div className={cn("flex items-center justify-center h-11 w-11 rounded-xl", color || "bg-primary/10 text-primary")}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sub && <div className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function ActivityHeatmap({
  readingDays,
  writingDays,
}: {
  readingDays: Map<string, number>;
  writingDays: Set<string>;
}) {
  const allDays = getLast365Days();
  const maxDuration = Math.max(...allDays.map((d) => readingDays.get(d) ?? 0), 1);

  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  for (const day of allDays) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const ARABIC_DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  const startDow = new Date(allDays[0]).getDay();
  const dayLabels = [...ARABIC_DAYS.slice(startDow), ...ARABIC_DAYS.slice(0, startDow)];

  const monthLabels: { label: string; firstWeek: number; firstDay: number }[] = [];
  let lastMonth = "";
  for (let wi = 0; wi < weeks.length; wi++) {
    for (let di = 0; di < weeks[wi].length; di++) {
      const date = weeks[wi][di];
      if (!date) continue;
      const month = date.slice(0, 7);
      if (month !== lastMonth) {
        const monthNames = ["", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        monthLabels.push({ label: monthNames[parseInt(date.slice(5, 7))], firstWeek: wi, firstDay: di });
        lastMonth = month;
      }
    }
  }

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" /> نشاط القراءة والكتابة (365 يوماً)
      </h3>
      <div className="overflow-x-auto pb-1" dir="ltr">
        <div className="inline-flex flex-col gap-[2px]">
          <div className="flex gap-[3px] mr-[22px] mb-[1px]">
            {monthLabels.map((ml, i) => {
              const next = monthLabels[i + 1];
              const span = next ? next.firstWeek - ml.firstWeek : weeks.length - ml.firstWeek;
              const width = Math.max(span * 17 - 3, 17);
              return (
                <div key={ml.label} style={{ width }} className="text-[9px] text-muted-foreground text-right leading-none">
                  {ml.label}
                </div>
              );
            })}
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="flex gap-[3px] items-center">
              <span className="text-[9px] text-muted-foreground w-[18px] text-center">{dayLabels[row]}</span>
              {weeks.map((week, wi) => {
                const date = week[row];
                if (!date) return <div key={wi} className="w-[14px] h-[14px]" />;
                const val = readingDays.get(date) ?? 0;
                const hasWriting = writingDays.has(date);
                const intensity = val > 0 ? Math.min(Math.ceil((val / maxDuration) * 4), 4) : 0;

                let bg: string;
                if (hasWriting && val > 0) {
                  bg = `hsl(var(--primary) / ${0.3 + intensity * 0.18})`;
                } else if (hasWriting) {
                  bg = "hsl(142 70% 45% / 0.25)";
                } else if (val > 0) {
                  bg = `hsl(var(--primary) / ${0.15 + intensity * 0.2})`;
                } else {
                  bg = "hsl(var(--muted))";
                }

                return (
                  <div
                    key={wi}
                    className="rounded-sm"
                    style={{ width: 14, height: 14, backgroundColor: bg }}
                    title={`${date}: ${Math.round(val / 60)} دقيقة${hasWriting ? " + كتابة" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-muted-foreground">
        <span>أقل</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="rounded-sm"
            style={{ width: 10, height: 10, backgroundColor: level === 0 ? "hsl(var(--muted))" : `hsl(var(--primary) / ${0.15 + level * 0.2})` }}
          />
        ))}
        <span>أكثر</span>
        <span className="mx-2">|</span>
        <div className="w-[10px] h-[10px] rounded-sm" style={{ backgroundColor: "hsl(142 70% 45% / 0.25)" }} />
        <span>كتابة</span>
      </div>
    </div>
  );
}

function GoalProgress({ goals }: { goals: Goal[] }) {
  const activeGoals = goals.filter((g) => !g.isCompleted).slice(0, 3);
  if (activeGoals.length === 0) return null;

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" /> الأهداف النشطة
      </h3>
      <div className="space-y-3">
        {activeGoals.map((goal) => {
          const pct = goal.targetAmount > 0
            ? Math.min(Math.round(((goal.currentAmount ?? 0) / goal.targetAmount) * 100), 100)
            : 0;
          return (
            <div key={goal.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{goal.type}</span>
                <span className="text-muted-foreground">
                  {Math.round(goal.currentAmount ?? 0)} / {Math.round(goal.targetAmount)} ({pct}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Stats() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [streaks, setStreaks] = useState<StreakItem | null>(null);
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [pages, setPages] = useState<PageDocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const ninetyDaysAgo = getDateDaysAgo(90);

    Promise.allSettled([
      fetchUserProfile(),
      fetchBookmarks({ first: 20 }),
      fetchAllNotes({ limit: 50 }),
      fetchCollections({ first: 20 }),
      fetchStreaks(),
      fetchActivityDays({ from: ninetyDaysAgo }),
      fetchGoals(),
      getDb()
        .then((db) => db.pages.find().exec())
        .then((docs) => docs.filter((p) => !p._deleted) as PageDocType[])
        .catch(() => [] as PageDocType[]),
    ]).then(([p, b, n, c, s, ad, g, pgs]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      if (b.status === "fulfilled") setBookmarkCount(b.value.data?.length ?? 0);
      if (n.status === "fulfilled") setNotes(n.value.data ?? []);
      if (c.status === "fulfilled") setCollections(c.value.data ?? []);
      if (s.status === "fulfilled") setStreaks(s.value.data);
      if (ad.status === "fulfilled") setActivityDays(ad.value.data ?? []);
      if (g.status === "fulfilled") setGoals(g.value.data ?? []);
      if (pgs.status === "fulfilled") setPages(pgs.value);
    }).finally(() => setLoading(false));
  }, []);

  // ── Derived QF stats ──
  const notesByDay: Record<string, number> = {};
  for (const n of notes) {
    const d = n.createdAt?.slice(0, 10);
    if (d) notesByDay[d] = (notesByDay[d] ?? 0) + 1;
  }
  const notesChart = getLast30Days().map((day) => ({
    date: formatDayLabel(day),
    ملاحظات: notesByDay[day] ?? 0,
  }));

  const activityByDay = new Map(activityDays.map((a) => [a.date, a.duration ?? 0]));
  const readingChart = getLast30Days().map((day) => ({
    date: formatDayLabel(day),
    وقت_القراءة: Math.round(((activityByDay.get(day) ?? 0) / 60) * 10) / 10,
  }));

  // ── Derived Kamil stats ──
  const totalWords = pages.reduce((sum, p) => sum + countWordsInContent(p.content), 0);
  const totalPages = pages.length;

  const writingDays = new Set<string>();
  for (const p of pages) {
    const d = p.updated_at?.slice(0, 10);
    if (d) writingDays.add(d);
    const cd = p.created_at?.slice(0, 10);
    if (cd) writingDays.add(cd);
  }

  const writingStreak = computeWritingStreak(writingDays);

  const editsByDay = new Map<string, number>();
  for (const p of pages) {
    const d = p.updated_at?.slice(0, 10);
    if (d) editsByDay.set(d, (editsByDay.get(d) ?? 0) + 1);
  }
  const writingChart = getLast30Days().map((day) => ({
    date: formatDayLabel(day),
    تعديلات: editsByDay.get(day) ?? 0,
  }));

  // ── Recent activity (pages + notes) ──
  const pageActivities = pages.map((p) => ({
    id: `page-${p.id}`,
    type: "page" as const,
    title: p.title,
    body: p.description || "",
    date: p.updated_at,
    link: `/pages/${p.id}`,
  }));
  const noteActivities = notes.filter((n) => n.ranges?.length).map((n) => ({
    id: `note-${n.id}`,
    type: "note" as const,
    title: "",
    body: n.body,
    date: n.createdAt,
    link: n.ranges?.[0] || "",
    verseKey: n.ranges?.[0]?.split("-")[0] || "",
  }));
  const recentActivity = [...pageActivities, ...noteActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // ── UI ──
  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || "المستخدم"
    : "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const totalCollectionBookmarks = collections.reduce((sum, c) => sum + (c.bookmarksCount ?? 0), 0);

  if (loading) {
    return (
      <div className="space-y-5" dir="rtl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Profile ── */}
      {profile && (
        <div className="flex items-center gap-4 pb-4 border-b">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={profile.photoUrl || profile.avatarUrls?.medium} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg leading-tight">{displayName}</h2>
            {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
          </div>
        </div>
      )}

      {/* ── Reading streak ── */}
      {streaks && (streaks.currentStreak > 0 || streaks.longestStreak > 0) && (
        <div className="bg-gradient-to-l from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums text-orange-500">{streaks.currentStreak}</div>
            <div className="text-xs text-muted-foreground">سلسلة القراءة الحالية</div>
          </div>
          <div className="mr-auto text-left" dir="ltr">
            <div className="text-xs text-muted-foreground">أطول سلسلة</div>
            <div className="text-lg font-bold tabular-nums">{streaks.longestStreak}</div>
          </div>
        </div>
      )}

      {/* ── Writing streak ── */}
      {writingStreak.current > 0 && (
        <div className="bg-gradient-to-l from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-green-500/10 text-green-500 shrink-0">
            <PenLine className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums text-green-500">{writingStreak.current}</div>
            <div className="text-xs text-muted-foreground">سلسلة الكتابة الحالية</div>
          </div>
          <div className="mr-auto text-left" dir="ltr">
            <div className="text-xs text-muted-foreground">أطول سلسلة</div>
            <div className="text-lg font-bold tabular-nums">{writingStreak.longest}</div>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={BookMarked} label="الآيات المحفوظة" value={bookmarkCount} color="bg-amber-500/10 text-amber-500" />
        <StatCard icon={FileText} label="الملاحظات" value={notes.length} color="bg-emerald-500/10 text-emerald-500" />
        <StatCard icon={FolderOpen} label="المجموعات" value={collections.length} color="bg-blue-500/10 text-blue-500" />
        <StatCard icon={Bookmark} label="إجمالي المحفوظات" value={totalCollectionBookmarks} sub="في كل المجموعات" color="bg-purple-500/10 text-purple-500" />
        <StatCard icon={BookOpen} label="الصفحات" value={totalPages} color="bg-rose-500/10 text-rose-500" />
        <StatCard icon={PenLine} label="الكلمات" value={totalWords.toLocaleString("ar-SA")} color="bg-cyan-500/10 text-cyan-500" />
      </div>

      {/* ── Verified badge ── */}
      {profile?.verified && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <Award className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold">حساب موثق</p>
            <p className="text-xs text-muted-foreground">عضو منذ {profile.joiningYear}</p>
          </div>
        </div>
      )}

      {/* ── Reading chart ── */}
      {readingChart.some((d) => d.وقت_القراءة > 0) && (
        <div className="bg-card border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> وقت القراءة (30 يوماً)
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={readingChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="readingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} unit=" د" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(value: any) => [`${value} دقيقة`, "وقت القراءة"]}
              />
              <Area type="monotone" dataKey="وقت_القراءة" stroke="hsl(var(--primary))" fill="url(#readingGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Writing chart ── */}
      {writingChart.some((d) => d.تعديلات > 0) && (
        <div className="bg-card border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <PenLine className="h-4 w-4 text-primary" /> التحرير (30 يوماً)
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={writingChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(value: any) => [`${value} تعديل`, "التعديلات"]}
              />
              <Bar dataKey="تعديلات" fill="hsl(142 70% 45% / 0.7)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Combined heatmap ── */}
      {(activityDays.length > 0 || writingDays.size > 0) && (
        <ActivityHeatmap readingDays={activityByDay} writingDays={writingDays} />
      )}

      {/* ── Goals ── */}
      {goals.length > 0 && <GoalProgress goals={goals} />}

      {/* ── Notes chart ── */}
      {notesChart.some((d) => d.ملاحظات > 0) && (
        <div className="bg-card border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> الملاحظات (30 يوماً)
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={notesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="ملاحظات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Recent activity ── */}
      {recentActivity.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> آخر النشاطات
          </h3>
          <div className="space-y-2">
            {recentActivity.slice(0, 8).map((item) => {
              if (item.type === "page") {
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    className="block bg-card border rounded-xl p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title || "بدون عنوان"}</p>
                        {item.body && <p className="text-xs text-muted-foreground line-clamp-1">{item.body}</p>}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 mr-6">
                      {new Date(item.date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                    </div>
                  </a>
                );
              }
              const verseKey = item.verseKey;
              const [chapStr, verseStr] = verseKey.split(":");
              const chapNum = parseInt(chapStr);
              const verseNum = parseInt(verseStr);
              const surahName = chapNum ? SURAH_NAMES[chapNum] || `سورة ${chapNum}` : "";
              return (
                <div
                  key={item.id}
                  className="bg-card border rounded-xl p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => {
                    if (verseKey) {
                      window.dispatchEvent(new CustomEvent("open-verse-panel", {
                        detail: { verseKey, surahName, ayaNumber: verseNum, verseText: "" },
                      }));
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/85 line-clamp-2 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground mr-6">
                    {surahName && <span>{surahName} · الآية {verseNum}</span>}
                    <span className="mr-auto">
                      {new Date(item.date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
