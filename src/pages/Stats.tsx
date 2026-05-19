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
import type { UserProfile, NoteItem, CollectionItem, StreakItem, ActivityDay, Goal } from "@/lib/qf/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { BookMarked, FileText, FolderOpen, Bookmark, Award, Flame, Calendar, TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURAH_NAMES } from "@/constants/surahs";

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

function formatDayLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
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

function ActivityHeatmap({ days }: { days: ActivityDay[] }) {
  const dayMap = new Map(days.map((d) => [d.date, d.duration ?? 0]));
  const allDays: string[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    allDays.push(d.toISOString().slice(0, 10));
  }
  const maxDuration = Math.max(...allDays.map((d) => dayMap.get(d) ?? 0), 1);

  const weeks: string[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  if (allDays.length === 0) return null;

  const startDow = new Date(allDays[0]).getDay();
  const ARABIC_DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  const dayLabels = [...ARABIC_DAYS.slice(startDow), ...ARABIC_DAYS.slice(0, startDow)];

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" /> نشاط القراءة (90 يوماً)
      </h3>
      <div className="flex gap-[3px]" dir="ltr">
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <div key={row} className="flex flex-col gap-[3px]">
            <span className="text-[9px] text-muted-foreground h-[14px] flex items-center">{dayLabels[row]}</span>
            {weeks.map((week, wi) => {
              const date = week[row];
              if (!date) return <div key={wi} style={{ width: 14, height: 14 }} />;
              const val = dayMap.get(date) ?? 0;
              const intensity = val > 0 ? Math.min(Math.ceil((val / maxDuration) * 4), 4) : 0;
              return (
                <div
                  key={wi}
                  className="rounded-sm"
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: intensity === 0
                      ? "hsl(var(--muted))"
                      : `hsl(var(--primary) / ${0.2 + intensity * 0.2})`,
                  }}
                  title={`${date}: ${Math.round(val / 60)} دقيقة`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-muted-foreground">
        <span>أقل</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="rounded-sm"
            style={{
              width: 10,
              height: 10,
              backgroundColor: level === 0
                ? "hsl(var(--muted))"
                : `hsl(var(--primary) / ${0.2 + level * 0.2})`,
            }}
          />
        ))}
        <span>أكثر</span>
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
    ]).then(([p, b, n, c, s, ad, g]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      if (b.status === "fulfilled") setBookmarkCount(b.value.data?.length ?? 0);
      if (n.status === "fulfilled") setNotes(n.value.data ?? []);
      if (c.status === "fulfilled") setCollections(c.value.data ?? []);
      if (s.status === "fulfilled") setStreaks(s.value.data);
      if (ad.status === "fulfilled") setActivityDays(ad.value.data ?? []);
      if (g.status === "fulfilled") setGoals(g.value.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const notesByDay: Record<string, number> = {};
  for (const n of notes) {
    const d = n.createdAt?.slice(0, 10);
    if (d) notesByDay[d] = (notesByDay[d] ?? 0) + 1;
  }
  const notesChart = getLast30Days().slice(-14).map((day) => ({
    date: formatDayLabel(day),
    ملاحظات: notesByDay[day] ?? 0,
  }));

  const activityByDay = new Map(activityDays.map((a) => [a.date, a.duration ?? 0]));
  const readingChart = getLast30Days().map((day) => ({
    date: formatDayLabel(day),
    وقت_القراءة: Math.round(((activityByDay.get(day) ?? 0) / 60) * 10) / 10,
  }));

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
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
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

      {streaks && (streaks.currentStreak > 0 || streaks.longestStreak > 0) && (
        <div className="bg-gradient-to-l from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums text-orange-500">{streaks.currentStreak}</div>
            <div className="text-xs text-muted-foreground">السلسلة الحالية</div>
          </div>
          <div className="mr-auto text-left" dir="ltr">
            <div className="text-xs text-muted-foreground">أطول سلسلة</div>
            <div className="text-lg font-bold tabular-nums">{streaks.longestStreak}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={BookMarked} label="الآيات المحفوظة" value={bookmarkCount} color="bg-amber-500/10 text-amber-500" />
        <StatCard icon={FileText} label="الملاحظات" value={notes.length} color="bg-emerald-500/10 text-emerald-500" />
        <StatCard icon={FolderOpen} label="المجموعات" value={collections.length} color="bg-blue-500/10 text-blue-500" />
        <StatCard icon={Bookmark} label="إجمالي المحفوظات" value={totalCollectionBookmarks} sub="في كل المجموعات" color="bg-purple-500/10 text-purple-500" />
      </div>

      {profile?.verified && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <Award className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold">حساب موثق</p>
            <p className="text-xs text-muted-foreground">عضو منذ {profile.joiningYear}</p>
          </div>
        </div>
      )}

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

      {activityDays.length > 0 && <ActivityHeatmap days={activityDays} />}

      {goals.length > 0 && <GoalProgress goals={goals} />}

      {notes.length > 0 && (
        <div className="bg-card border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> الملاحظات (14 يوماً)
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={notesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="ملاحظات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {notes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> آخر الملاحظات
          </h3>
          <div className="space-y-2">
            {notes.slice(0, 5).map((note) => {
              const range = note.ranges?.[0] || "";
              const verseKey = range.split("-")[0];
              const [chapStr, verseStr] = verseKey.split(":");
              const chapNum = parseInt(chapStr);
              const verseNum = parseInt(verseStr);
              const surahName = chapNum ? SURAH_NAMES[chapNum] || `سورة ${chapNum}` : "";
              return (
                <div
                  key={note.id}
                  className="bg-card border rounded-xl p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => {
                    if (verseKey) {
                      window.dispatchEvent(new CustomEvent("open-verse-panel", {
                        detail: { verseKey, surahName, ayaNumber: verseNum, verseText: "" },
                      }));
                    }
                  }}
                >
                  <p className="text-sm text-foreground/85 line-clamp-2 leading-relaxed">{note.body}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                    {surahName && <span>{surahName} · الآية {verseNum}</span>}
                    <span className="mr-auto">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric" }) : ""}
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
