import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, GitFork, Heart, Compass, Clock, ArrowUpRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  snippet: string;
  author: { display_name: string; username: string | null; avatar_url: string | null };
  is_fork: boolean;
  fork_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

interface DiscoverResponse {
  pages: Article[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Discover() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "most_forked">("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const fetchArticles = useCallback(async (p = 1, append = false) => {
    setLoading(p === 1 && !append);
    try {
      const params = new URLSearchParams({ page: String(p), sort });
      if (search) params.set("q", search);

      const res = await fetch(`/api/discover?${params}`);
      const data: DiscoverResponse = await res.json();

      const pages = data?.pages || [];
      if (append) {
        setArticles((prev) => [...prev, ...pages]);
      } else {
        setArticles(pages);
      }
      setHasMore(data?.has_more ?? false);
      setPage(p);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Compass className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">اكتشف</h1>
          <p className="text-sm text-muted-foreground">مقالات عامة من جميع المستخدمين</p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-2.5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المقالات..."
            className="w-full pr-10 pl-4 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "most_forked")}
          className="px-3.5 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value="recent">الأحدث</option>
          <option value="most_forked">الأكثر نسخاً</option>
        </select>
      </div>

      {/* Articles */}
      {loading && page === 1 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">لا توجد مقالات بعد</p>
          <p className="text-sm text-muted-foreground/60 mt-1.5">شارك أول مقال لتظهر هنا</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              variants={item}
              className="group relative bg-card border border-border/60 hover:border-primary/25 rounded-xl p-4 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/read/${article.id}`)}
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-full border-2 border-border/40 overflow-hidden shrink-0 bg-primary/5 flex items-center justify-center mt-0.5">
                  {article.author.avatar_url ? (
                    <img src={article.author.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-base font-bold text-primary font-amiri">
                      {article.author.display_name?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold font-amiri">{article.author.display_name}</span>
                    {article.author.username && (
                      <span className="text-xs text-muted-foreground">@{article.author.username}</span>
                    )}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors mr-auto shrink-0" />
                  </div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.snippet && (
                    <p className="text-sm text-muted-foreground/70 line-clamp-2 leading-relaxed font-amiri">
                      {article.snippet}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.updated_at)}
                    </span>
                    {article.like_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.like_count}
                      </span>
                    )}
                    {article.fork_count > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {article.fork_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-1">
          <button
            onClick={() => fetchArticles(page + 1, true)}
            disabled={loading}
            className="px-10 py-2.5 bg-card border border-border/60 hover:border-primary/30 rounded-xl text-sm hover:bg-accent/40 transition-all font-medium disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : "تحميل المزيد"}
          </button>
        </div>
      )}
    </div>
  );
}
