import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { login, logout, getTokens } from "@/lib/qf/auth";
import { fetchUserProfile } from "@/lib/qf/api";
import type { UserProfile } from "@/lib/qf/api";
import { User, LogOut, Settings, Bookmark, BookOpen, BarChart2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function UserAccount() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const tokens = getTokens();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokens?.access_token) {
      setLoading(true);
      fetchUserProfile()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [tokens?.access_token]);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "المستخدم"
    : null;

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  if (!tokens) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => login()}
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="text-xs truncate">تسجيل الدخول بحساب Quran.com</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-accent/50 transition-all duration-200">
            <Avatar className="h-8 w-8 border border-border/50">
              <AvatarImage src={user?.photoUrl || user?.avatarUrls?.small} alt={displayName || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initials || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-sm font-semibold truncate w-full">
                {loading ? "..." : displayName || "المستخدم"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-full">
                {user?.email || "Quran.com"}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-right font-amiri">حسابي</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer" onClick={() => navigate("/collections")}>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>المجلدات</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer" onClick={() => navigate("/bookmarks")}>
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span>العلامات المرجعية</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer" onClick={() => navigate("/stats")}>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>إحصائياتي</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer" onClick={() => navigate("/settings")}>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>الإعدادات</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer text-red-500 focus:text-red-500"
            onClick={logout}
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
