import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/qf/api";
import type { UserProfile } from "@/lib/qf/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Globe, Award, FileText, Heart, Users, AlertCircle } from "lucide-react";

export function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUserProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setError("فشل تحميل الملف الشخصي"))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}
