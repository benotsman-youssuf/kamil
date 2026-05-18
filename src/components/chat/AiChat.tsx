import { useChat } from "@ai-sdk/react";
import type { ToolInvocation } from "@ai-sdk/ui-utils";
import { Button } from "@/components/ui/button";
import { Bot, BookOpen, ScrollText, Loader2, Wrench, ChevronDown, CheckCircle, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { parseVerseMarkers, parseHadithMarkers, removeMarkers, fetchVerse } from "@/lib/quran-api";
import { toast } from "sonner";

interface EvidenceCard {
  id: string;
  type: "verse" | "hadith";
  surah?: number;
  ayah?: number;
  collection?: string;
  number?: number;
  text?: string;
  loading?: boolean;
}

function ToolCard({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  const [open, setOpen] = useState(toolInvocation.state === "result");

  const stateLabels = {
    "partial-call": "Pending",
    "call": "Running",
    "result": "Completed",
  };

  const stateIcons = {
    "partial-call": <Clock className="size-4" />,
    "call": <Clock className="size-4 animate-pulse" />,
    "result": <CheckCircle className="size-4 text-green-600" />,
  };

  const isResult = toolInvocation.state === "result";

  return (
    <div className="group mb-4 w-full rounded-md border">
      <button
        className="flex w-full items-center justify-between gap-4 p-3"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{toolInvocation.toolName}</span>
          <span className="gap-1.5 rounded-full text-xs bg-secondary px-2 py-0.5 inline-flex items-center">
            {stateIcons[toolInvocation.state]}
            {stateLabels[toolInvocation.state]}
          </span>
        </div>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-4 p-4 text-popover-foreground outline-none">
          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Parameters
            </h4>
            <pre className="rounded-md bg-muted/50 p-2 text-xs overflow-x-auto">
              {JSON.stringify((toolInvocation as { args: unknown }).args, null, 2)}
            </pre>
          </div>
          {isResult && (
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Result
              </h4>
              <pre className="rounded-md bg-muted/50 p-2 text-xs overflow-x-auto">
                {JSON.stringify((toolInvocation as { result: unknown }).result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AiChat({ close }: { close: () => void }) {
  const { messages, append, status, error } = useChat({
    api: "/api/chat",
  });

  const [evidenceCards, setEvidenceCards] = useState<EvidenceCard[]>([]);
  const processedMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;
    if (processedMessagesRef.current.has(lastMsg.id)) return;

    const textParts = lastMsg.parts.filter((p) => p.type === "text");
    const fullText = textParts.map((p) => p.text).join("");

    const verseMarkers = parseVerseMarkers(fullText);
    const hadithMarkers = parseHadithMarkers(fullText);

    const newCards: EvidenceCard[] = [
      ...verseMarkers.map((m, i) => ({
        id: `verse-${m.surah}-${m.ayah}-${i}`,
        type: "verse" as const,
        surah: m.surah,
        ayah: m.ayah,
        loading: true,
      })),
      ...hadithMarkers.map((m, i) => ({
        id: `hadith-${m.collection}-${m.number}-${i}`,
        type: "hadith" as const,
        collection: m.collection,
        number: m.number,
        text: `Hadith from ${m.collection} #${m.number}`,
      })),
    ];

    if (newCards.length > 0) {
      processedMessagesRef.current.add(lastMsg.id);

      setEvidenceCards((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueNew = newCards.filter((c) => !existingIds.has(c.id));
        if (uniqueNew.length === 0) return prev;
        return [...prev, ...uniqueNew];
      });

      newCards.forEach(async (card) => {
        if (card.type === "verse" && card.surah && card.ayah) {
          try {
            const data = await fetchVerse(card.surah, card.ayah);
            setEvidenceCards((prev) =>
              prev.map((c) =>
                c.id === card.id
                  ? { ...c, text: data.text || data.uthmani || "", loading: false }
                  : c
              )
            );
          } catch {
            setEvidenceCards((prev) =>
              prev.map((c) =>
                c.id === card.id ? { ...c, loading: false, text: "Failed to load verse" } : c
              )
            );
          }
        }
      });
    }
  }, [messages]);

  const handleInsert = (card: EvidenceCard) => {
    if (card.type === "verse") {
      window.dispatchEvent(
        new CustomEvent("insert-verse", {
          detail: {
            verseKey: `${card.surah}:${card.ayah}`,
            verseText: card.text,
            surahName: "",
            ayaNumber: card.ayah,
          },
        })
      );
      toast.success("تم إدراج الآية");
    } else if (card.type === "hadith") {
      window.dispatchEvent(
        new CustomEvent("insert-hadith", {
          detail: {
            collection: card.collection,
            hadithNumber: card.number,
            hadithText: card.text,
          },
        })
      );
      toast.success("تم إدراج الحديث");
    }
  };

  const handleSubmit = ({ text }: { text: string }) => {
    if (text.trim()) {
      append({ role: "user", content: text });
    }
  };

  const isStreaming = status === "submitted" || status === "streaming";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Kamil AI</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={close}>Close</Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-2">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Bot className="size-12" />}
                title="Start a conversation"
                description="Ask about any verse or hadith to research and insert into your writing."
              />
            ) : (
              messages.map((message) => (
                <div key={message.id}>
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <Message from={message.role === "data" ? "assistant" : message.role} key={`${message.id}-${i}`}>
                          <MessageContent>
                            <MessageResponse>
                              {message.role === "assistant"
                                ? removeMarkers(part.text)
                                : part.text}
                            </MessageResponse>
                          </MessageContent>
                        </Message>
                      );
                    }

                    if (part.type === "tool-invocation") {
                      return (
                        <ToolCard
                          key={`${message.id}-${i}`}
                          toolInvocation={part.toolInvocation}
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              ))
            )}

            {evidenceCards.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Evidence Cards
                </h4>
                {evidenceCards.map((card) => (
                  <div
                    key={card.id}
                    className="border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {card.type === "verse" ? (
                        <BookOpen className="h-4 w-4 mt-0.5 text-primary" />
                      ) : (
                        <ScrollText className="h-4 w-4 mt-0.5 text-primary" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {card.type === "verse"
                            ? `Surah ${card.surah}, Ayah ${card.ayah}`
                            : `${card.collection} #${card.number}`}
                        </p>
                        {card.loading ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-xs text-muted-foreground">Loading...</span>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2" dir="rtl">
                            {card.text}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInsert(card)}
                        disabled={card.loading}
                      >
                        Insert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-xs text-destructive text-center">
                Error: {error.message}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-2 mb-2"
        >
          <PromptInputTextarea
            placeholder="Ask about a verse or hadith..."
            disabled={isStreaming}
          />
          <PromptInputSubmit
            status={status}
            disabled={isStreaming}
          />
        </PromptInput>
      </div>
    </div>
  );
}
