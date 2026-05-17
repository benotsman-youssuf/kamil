"use client";

import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  fetchStreaks,
  fetchActivityDays,
  fetchBookmarks,
  fetchAllNotes,
  fetchGoals,
} from "@/lib/qf/api";
import type { UserProfile, StreakItem, ActivityDay, Goal, NoteItem } from "@/lib/qf/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame, BookMarked, FileText, Target, TrendingUp, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURAH_NAMES } from "@/constants/surahs";

// ── helpers ──────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────

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
  const last90 = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().slice(0, 10);
  });

  const byDate: Record<string, number> = {};
  for (const d of days) {
    byDate[d.date] = (d.count ?? 0) + (d.duration ?? 0);
  }

  const max = Math.max(1, ...Object.values(byDate));

  const weeks: string[][] = [];
  let week: string[] = [];
  for (const day of last90) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) weeks.push(week);

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" /> نشاط القراءة (90 يوماً)
      </h3>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {w.map((day) => {
              const val = byDate[day] || 0;
              const intensity = val === 0 ? 0 : Math.ceil((val / max) * 4);
              return (
                <div
                  key={day}
                  title={`${day}: ${val}`}
                  className={cn(
                    "h-3 w-3 rounded-sm transition-colors",
                    intensity === 0 && "bg-muted",
                    intensity === 1 && "bg-primary/20",
                    intensity === 2 && "bg-primary/40",
                    intensity === 3 && "bg-primary/65",
                    intensity === 4 && "bg-primary",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
        <span>أقل</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={cn("h-3 w-3 rounded-sm",
            i === 0 && "bg-muted",
            i === 1 && "bg-primary/20",
            i === 2 && "bg-primary/40",
            i === 3 && "bg-primary/65",
            i === 4 && "bg-primary",
          )} />
        ))}
        <span>أكثر</span>
      </div>
    </div>
  );
}

function GoalProgress({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return null;
  const active = goals.filter((g) => !g.isCompleted).slice(0, 3);
  if (active.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" /> الأهداف النشطة
      </h3>
      <div className="space-y-3">
        {active.map((goal) => {
          const pct = goal.targetAmount > 0
            ? Math.min(100, Math.round(((goal.currentAmount ?? 0) / goal.targetAmount) * 100))
            : 0;
          return (
            <div key={goal.id} className="bg-card border rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground capitalize">{goal.type}</span>
                <span className="font-semibold tabular-nums">{pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>{goal.currentAmount ?? 0}</span>
                <span>{goal.targetAmount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────

export function Stats() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streaks, setStreaks] = useState<StreakItem | null>(null);
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const from = new Date();
    from.setDate(from.getDate() - 90);

    Promise.allSettled([
      fetchUserProfile(),
      fetchStreaks(),
      fetchActivityDays({ from: from.toISOString().slice(0, 10) }),
      fetchBookmarks({ first: 1 }),
      fetchAllNotes({ limit: 50 }),
      fetchGoals(),
    ]).then(([p, s, a, b, n, g]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      if (s.status === "fulfilled") setStreaks(s.value.data);
      if (a.status === "fulfilled") setActivityDays(a.value.data ?? []);
      if (b.status === "fulfilled") setBookmarkCount(b.value.data?.length ?? 0);
      if (n.status === "fulfilled") setNotes(n.value.data ?? []);
      if (g.status === "fulfilled") setGoals(g.value.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  // Build chart data: last 30 days activity
  const last30 = getLast30Days();
  const actByDate: Record<string, number> = {};
  for (const d of activityDays) {
    actByDate[d.date] = (d.duration ?? 0);
  }
  const chartData = last30.map((day) => ({
    date: formatDayLabel(day),
    دقائق: actByDate[day] ?? 0,
  }));

  // Notes per day (last 14)
  const notesByDay: Record<string, number> = {};
  for (const n of notes) {
    const d = n.createdAt?.slice(0, 10);
    if (d) notesByDay[d] = (notesByDay[d] ?? 0) + 1;
  }
  const notesChart = getLast30Days().slice(-14).map((day) => ({
    date: formatDayLabel(day),
    ملاحظات: notesByDay[day] ?? 0,
  }));

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username || "المستخدم"
    : "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

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
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Profile header */}
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
          {streaks && streaks.currentStreak > 0 && (
            <div className="mr-auto flex items-center gap-1.5 bg-orange-500/10 text-orange-500 rounded-full px-3 py-1.5">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{streaks.currentStreak}</span>
            </div>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Flame}
          label="الإجازة الحالية"
          value={streaks?.currentStreak ?? 0}
          sub={`أطول: ${streaks?.longestStreak ?? 0} يوم`}
          color="bg-orange-500/10 text-orange-500"
        />
        <StatCard
          icon={Calendar}
          label="أيام النشاط"
          value={activityDays.length}
          sub="آخر 90 يوماً"
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={BookMarked}
          label="الآيات المحفوظة"
          value={bookmarkCount}
          color="bg-amber-500/10 text-amber-500"
        />
        <StatCard
          icon={FileText}
          label="الملاحظات"
          value={notes.length}
          color="bg-emerald-500/10 text-emerald-500"
        />
      </div>

      {/* Achievement banner if verified */}
      {profile?.verified && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <Award className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold">حساب موثق</p>
            <p className="text-xs text-muted-foreground">عضو منذ {profile.joiningYear}</p>
          </div>
        </div>
      )}

      {/* Activity heatmap */}
      <div className="bg-card border rounded-xl p-4">
        <ActivityHeatmap days={activityDays} />
      </div>

      {/* Reading activity area chart */}
      <div className="bg-card border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> وقت القراءة (30 يوماً)
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="دقائق" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorMin)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Notes bar chart */}
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

      {/* Goal progress */}
      <GoalProgress goals={goals} />

      {/* Recent notes */}
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
