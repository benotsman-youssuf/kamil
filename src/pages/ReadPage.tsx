import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, GitFork, Heart, Clock, User, Sun, Moon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { SharedRightPanel } from "@/components/SharedRightPanel";

interface Article {
  id: string;
  title: string;
  content: any;
  author: { display_name: string; username: string | null; avatar_url: string | null };
  is_fork: boolean;
  fork_count: number;
  like_count: number;
  liked_by_user: boolean;
  created_at: string;
  updated_at: string;
}

export function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forking, setForking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/pages?id=${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load");
        }
        return res.json();
      })
      .then((data) => {
        const page = {
          ...data.page,
          author: data.page.user_profiles || { display_name: "Unknown", username: null, avatar_url: null },
        };
        setArticle(page);
        setLiked(page.liked_by_user);
        setLikeCount(page.like_count ?? 0);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFork = async () => {
    if (!id) return;
    setForking(true);
    try {
      const token = localStorage.getItem("qf_tokens");
      if (!token) {
        navigate("/");
        return;
      }

      const tokens = JSON.parse(token);
      const res = await fetch(`/api/pages?id=${id}`, {
        method: "POST",
        headers: { "x-auth-token": tokens.access_token, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fork" }),
      });

      if (!res.ok) throw new Error("Fork failed");

      await res.json();
      window.location.reload();
    } catch {
      // silent
    } finally {
      setForking(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    const token = localStorage.getItem("qf_tokens");
    if (!token) return;

    const tokens = JSON.parse(token);
    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!liked);
    setLikeCount((c) => (prevLiked ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/pages?id=${id}`, {
        method: "POST",
        headers: { "x-auth-token": tokens.access_token, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      if (!res.ok) throw new Error("Like failed");

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.like_count);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
        <SharedRightPanel />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto text-center py-16" dir="rtl">
            <p className="text-lg text-muted-foreground">{error || "المقالة غير موجودة"}</p>
            <button
              onClick={() => navigate("/discover")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              العودة للاكتشاف
            </button>
          </div>
        </div>
        <SharedRightPanel />
      </div>
    );
  }

  const renderContent = (content: any) => {
    try {
      const nodes = typeof content === "string" ? JSON.parse(content) : content;
      if (!Array.isArray(nodes)) return null;

      return nodes.map((node: any, i: number) => renderNode(node, `c${i}`));
    } catch {
      return <p className="text-muted-foreground">خطأ في عرض المحتوى</p>;
    }
  };

  const renderNode = (node: any, key: string) => {
    if (!node) return null;

    const children = node.children?.map((child: any, i: number) => renderInline(child, `${key}-${i}`));

    switch (node.type) {
      case "h1":
        return <h1 key={key} className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>;
      case "h2":
        return <h2 key={key} className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>;
      case "h3":
        return <h3 key={key} className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>;
      case "p":
        return <p key={key} className="text-base leading-loose mb-3 last:mb-0">{children}</p>;
      case "blockquote":
        return (
          <blockquote key={key} className="border-r-4 border-primary/30 pr-4 py-2 my-3 text-muted-foreground italic">
            {children}
          </blockquote>
        );
      case "verse":
        return (
          <span
            key={key}
            className="inline-block bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 mx-1 my-1.5 text-lg font-medium text-primary font-amiri leading-relaxed cursor-pointer transition-colors hover:bg-primary/10"
            onMouseDown={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent("open-verse-panel", {
                detail: {
                  verseKey: node.verseKey,
                  surahName: node.surahName,
                  ayaNumber: node.ayaNumber,
                  verseText: node.verseText,
                },
              }));
            }}
          >
            ﴿{node.verseText || node.children?.[0]?.text || ""}﴾
            <span className="text-xs text-muted-foreground mr-1">({node.surahName}: {node.ayaNumber})</span>
          </span>
        );
      case "hadith":
        return (
          <div key={key} className="bg-muted/50 border rounded-lg p-3 my-2 cursor-pointer transition-colors hover:bg-muted/70" onMouseDown={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("open-hadith-panel", {
              detail: {
                collection: node.collection,
                bookNumber: node.bookNumber,
                hadithNumber: node.hadithNumber,
                hadithText: node.hadithText,
                hadithTextEn: node.hadithTextEn,
                grades: node.grades,
              },
            }));
          }}>
            <p className="text-base leading-loose mb-1 font-amiri">{node.hadithText || node.children?.[0]?.text || ""}</p>
            <p className="text-xs text-muted-foreground">
              [{node.collection} {node.hadithNumber}]
              {node.grades?.length ? ` · ${node.grades.map((g: any) => g.grade).join(", ")}` : ""}
            </p>
          </div>
        );
      case "ul":
        return <ul key={key} className="list-disc list-outside space-y-1 my-2 [&_ul]:pr-5">{children}</ul>;
      case "ol":
        return <ol key={key} className="list-decimal list-outside space-y-1 my-2 [&_ol]:pr-5">{children}</ol>;
      case "li":
        return <li key={key} className="text-base leading-loose">{children}</li>;
      case "lic":
        return <span key={key} className="text-base leading-loose">{children}</span>;
      case "code_block":
        return (
          <pre key={key} className="bg-muted rounded-lg p-4 my-3 overflow-x-auto text-sm">
            <code>{node.children?.[0]?.text || ""}</code>
          </pre>
        );
      default:
        return <div key={key}>{children}</div>;
    }
  };

  const renderInline = (node: any, key: string) => {
    if (!node) return null;
    if (node.text !== undefined) {
      let text = <span key={key}>{node.text}</span>;
      if (node.bold) text = <strong key={key}>{node.text}</strong>;
      if (node.italic) text = <em key={key}>{node.text}</em>;
      if (node.code) text = <code key={key} className="bg-muted px-1 py-0.5 rounded text-sm">{node.text}</code>;
      return text;
    }
    return renderNode(node, key);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto" dir="rtl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/discover")}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="العودة للاكتشاف"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Article header */}
          <div className="mb-8 pb-6 border-b">
            <h1 className="text-3xl font-bold mb-4 leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {article.author.avatar_url ? (
                    <img src={article.author.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="font-amiri">{article.author.display_name}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(article.created_at)}
              </span>
              {article.fork_count > 0 && (
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" />
                  {article.fork_count}
                </span>
              )}
            </div>
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-10">
            {renderContent(article.content)}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-2 hover:bg-red-50 hover:text-red-500 transition-colors ${liked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFork}
              disabled={forking}
              className="gap-2 hover:bg-accent transition-colors"
            >
              {forking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GitFork className="h-4 w-4" />
              )}
              <span>نسخ</span>
            </Button>
          </div>
        </div>
      </div>
      <SharedRightPanel />
    </div>
  );
}
