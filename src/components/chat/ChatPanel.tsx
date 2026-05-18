import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import type { VerseEvidence, HadithEvidence } from "@/types/ai-evidence";

function extractEvidence(
  parts: any[]
): { verses: VerseEvidence[]; hadiths: HadithEvidence[] } {
  const verses: VerseEvidence[] = [];
  const hadiths: HadithEvidence[] = [];

  for (const part of parts) {
    if (part.type === "tool-invocation" && part.toolInvocation?.state === "result") {
      const { toolName, result } = part.toolInvocation;
      if (toolName === "search_quran" && result?.verses) {
        verses.push(...result.verses);
      }
      if (toolName === "search_hadith" && result?.hadiths) {
        hadiths.push(...result.hadiths);
      }
    }
  }

  return { verses, hadiths };
}

export function ChatPanel({ close }: { close: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
  });

  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h3 className="text-sm font-semibold">AI Chat</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={close}>إغلاق</Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 mb-2" />
            <p className="text-sm">اسأل عن آية أو حديث...</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={message.role === "user" ? "text-right" : "text-left"}>
              <div className="inline-block rounded-md px-3 py-2 text-sm bg-muted max-w-[85%]">
                {message.parts?.map((part: any, i: number) =>
                  part.type === "text" ? <p key={i} className="whitespace-pre-wrap">{part.text}</p> : null
                )}
              </div>
            </div>
            {message.role === "assistant" && message.parts && (
              <EvidenceCards 
                parts={message.parts as any[]} 
                messageId={message.id}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t space-y-2 flex-shrink-0">
        <textarea
          className="w-full rounded-md border bg-background p-2 text-sm resize-none"
          rows={3}
          value={input}
          onChange={handleInputChange}
          placeholder="اسأل عن آية أو حديث..."
        />
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={busy}>
            {busy ? "..." : "إرسال"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function EvidenceCards({
  parts,
  messageId,
}: {
  parts: any[];
  messageId: string;
}) {
  const { verses, hadiths } = useMemo(() => extractEvidence(parts), [parts]);

  if (verses.length === 0 && hadiths.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {verses.map((v, i) => (
        <EvidenceCard
          key={`${messageId}-v-${i}`}
          primary={`﴿${v.arabicText}﴾`}
          secondary={`${v.surahName || ""} — ${v.verseKey || ""}`}
          onInsert={() => {
            window.dispatchEvent(
              new CustomEvent("insert-verse", {
                detail: {
                  verseKey: v.verseKey,
                  verseText: v.arabicText,
                  surahName: v.surahName || "",
                  ayaNumber: v.ayahNumber || 0,
                },
              })
            );
          }}
        />
      ))}
      {hadiths.map((h, i) => (
        <EvidenceCard
          key={`${messageId}-h-${i}`}
          primary={`﴿${h.arabicText}﴾`}
          secondary={`${h.collection} ${h.hadithNumber}`}
          grades={h.grades}
          onInsert={() => {
            window.dispatchEvent(
              new CustomEvent("insert-hadith", {
                detail: {
                  collection: h.collection,
                  bookNumber: h.bookNumber || "",
                  hadithNumber: h.hadithNumber,
                  hadithText: h.arabicText,
                  hadithTextEn: h.englishText || "",
                  grades: h.grades || [],
                },
              })
            );
          }}
        />
      ))}
    </div>
  );
}

function EvidenceCard({
  primary,
  secondary,
  grades,
  onInsert,
}: {
  primary: string;
  secondary: string;
  grades?: Array<{ graded_by?: string; grade: string }>;
  onInsert: () => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-card p-2 text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate leading-relaxed">{primary}</p>
        <p className="text-xs text-muted-foreground truncate">{secondary}</p>
        {grades && grades.length > 0 && (
          <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
            {grades.map((g) => g.grade).join(" | ")}
          </p>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={onInsert} className="flex-shrink-0">
        إدراج
      </Button>
    </div>
  );
}
