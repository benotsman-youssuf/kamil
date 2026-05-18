import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  snippet: string;
  author: { display_name: string; username: string | null; avatar_url: string | null };
  is_fork: boolean;
  fork_count: number;
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
      const params = new URLSearchParams({
        page: String(p),
        sort,
      });
      if (search) params.set("q", search);

      const res = await fetch(`/api/discover?${params}`);
      const data: DiscoverResponse = await res.json();

      if (append) {
        setArticles((prev) => [...prev, ...data.pages]);
      } else {
        setArticles(data.pages);
      }
      setHasMore(data.has_more);
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
    <div className="space-y-6" dir="rtl">
      {/* Search + Sort */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المقالات العامة..."
            className="w-full pr-10 pl-4 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "recent" | "most_forked")}
          className="px-3 py-2.5 bg-card border rounded-xl text-sm focus:outline-none"
        >
          <option value="recent">الأحدث</option>
          <option value="most_forked">الأكثر نسخاً</option>
        </select>
      </div>

      {/* Articles */}
      {loading && page === 1 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">لا توجد مقالات عامة بعد</p>
          <p className="text-sm mt-1">شارك مقالتك الأولى لتكون هنا</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-card border rounded-xl p-4 hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/read/${article.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {article.author.avatar_url ? (
                    <img src={article.author.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                  ) : (
                    <span className="text-sm font-bold text-primary">
                      {article.author.display_name?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{article.author.display_name}</span>
                    {article.author.username && (
                      <span className="text-xs text-muted-foreground">@{article.author.username}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base mb-1">{article.title}</h3>
                  {article.snippet && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{formatDate(article.updated_at)}</span>
                    {article.fork_count > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {article.fork_count}
                      </span>
                    )}
                    {article.is_fork && (
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px]", "bg-muted text-muted-foreground")}>
                        منسوخ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => fetchArticles(page + 1, true)}
            className="px-6 py-2.5 bg-card border rounded-xl text-sm hover:bg-accent/50 transition-colors"
          >
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
}
