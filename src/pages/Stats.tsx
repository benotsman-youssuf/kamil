"use client";

import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  fetchBookmarks,
  fetchAllNotes,
  fetchCollections,
} from "@/lib/qf/api";
import type { UserProfile, NoteItem, CollectionItem } from "@/lib/qf/api";
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
} from "recharts";
import { BookMarked, FileText, FolderOpen, Bookmark, Award } from "lucide-react";
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

// ── Main page ─────────────────────────────────────────────────────

export function Stats() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      fetchUserProfile(),
      fetchBookmarks({ first: 20 }),
      fetchAllNotes({ limit: 50 }),
      fetchCollections({ first: 20 }),
    ]).then(([p, b, n, c]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      if (b.status === "fulfilled") setBookmarkCount(b.value.data?.length ?? 0);
      if (n.status === "fulfilled") setNotes(n.value.data ?? []);
      if (c.status === "fulfilled") setCollections(c.value.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

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
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
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
        <StatCard
          icon={FolderOpen}
          label="المجموعات"
          value={collections.length}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={Bookmark}
          label="إجمالي المحفوظات"
          value={totalCollectionBookmarks}
          sub="في كل المجموعات"
          color="bg-purple-500/10 text-purple-500"
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
