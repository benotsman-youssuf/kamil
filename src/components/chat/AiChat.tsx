"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import {
  Bot,
  BookOpen,
  ScrollText,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Square,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
  ConversationDownload,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@/components/ai-elements/sources";
import {
  parseVerseMarkers,
  parseHadithMarkers,
  removeMarkers,
  fetchVerse,
} from "@/lib/quran-api";
import { fetchHadithByNumber } from "@/lib/hadith/api";
import { toast } from "sonner";

// ─── Config ───────────────────────────────────────────────────────────────────

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  "What does the Quran say about patience?",
  "Find hadiths on seeking knowledge",
  "Explain Ayat al-Kursi",
  "Verses about mercy and forgiveness",
  "Hadiths on honesty",
  "What does Islam say about family?",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EvidenceCard {
  id: string;
  type: "verse" | "hadith";
  surah?: number;
  ayah?: number;
  collection?: string;
  number?: number;
  text?: string;
  loading?: boolean;
  bookNumber?: string;
  hadithTextEn?: string;
  grades?: { grade: string; graded_by: string }[];
  chapterTitle?: string;
}

// Map from assistant message ID -> evidence cards found in that message
type EvidenceMap = Record<string, EvidenceCard[]>;

// ─── EvidenceCardItem ─────────────────────────────────────────────────────────

const EvidenceCardItem = memo(function EvidenceCardItem({
  card,
  onInsert,
}: {
  card: EvidenceCard;
  onInsert: (card: EvidenceCard) => void;
}) {
  const label =
    card.type === "verse"
      ? `Surah ${card.surah}:${card.ayah}`
      : `${card.collection} #${card.number}`;

  const description = card.loading
    ? undefined
    : card.type === "hadith" && card.hadithTextEn
    ? card.hadithTextEn
    : card.text;

  return (
    <Source
      title={label}
      description={
        card.loading ? (
          <Shimmer>Loading…</Shimmer>
        ) : (
          description
        )
      }
    >
      <div className="flex items-start justify-between gap-3 py-2">
        <div className="flex items-start gap-2 min-w-0">
          {card.type === "verse" ? (
            <BookOpen className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          ) : (
            <ScrollText className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          )}

          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium leading-none">{label}</p>

            {card.chapterTitle && (
              <p className="text-xs text-muted-foreground">{card.chapterTitle}</p>
            )}

            {card.loading ? (
              <Shimmer>Loading content…</Shimmer>
            ) : (
              <>
                {card.text && (
                  <p
                    className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                    dir="rtl"
                  >
                    {card.text}
                  </p>
                )}
                {card.hadithTextEn && (
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    {card.hadithTextEn}
                  </p>
                )}
                {card.grades && card.grades.length > 0 && (
                  <span className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground">
                    {card.grades[0].grade}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="shrink-0 h-7 text-xs"
          onClick={() => onInsert(card)}
          disabled={card.loading}
        >
          Insert
        </Button>
      </div>
    </Source>
  );
});

// ─── MessageEvidenceBlock ─────────────────────────────────────────────────────

const MessageEvidenceBlock = memo(function MessageEvidenceBlock({
  cards,
  onInsert,
}: {
  cards: EvidenceCard[];
  onInsert: (card: EvidenceCard) => void;
}) {
  if (cards.length === 0) return null;

  const verseCount = cards.filter((c) => c.type === "verse").length;
  const hadithCount = cards.filter((c) => c.type === "hadith").length;

  const triggerLabel = [
    verseCount > 0 && `${verseCount} verse${verseCount !== 1 ? "s" : ""}`,
    hadithCount > 0 && `${hadithCount} hadith${hadithCount !== 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mt-3 ml-2">
      <Sources>
        <SourcesTrigger>{triggerLabel}</SourcesTrigger>
        <SourcesContent>
          {cards.map((card) => (
            <EvidenceCardItem key={card.id} card={card} onInsert={onInsert} />
          ))}
        </SourcesContent>
      </Sources>
    </div>
  );
});

// ─── AiChat ───────────────────────────────────────────────────────────────────

export function AiChat({ close }: { close: () => void }) {
  // ── Restore persisted messages safely ────────────────────────────────────
  const initialMessages = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("kamil-ai-chat-messages");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const { messages, sendMessage, stop, status, error, setMessages } = useChat({
    transport: chatTransport,
    messages: initialMessages,
  });

  const [evidenceByMessage, setEvidenceByMessage] = useState<EvidenceMap>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const processedRef = useRef<Set<string>>(new Set());

  const isStreaming = status === "submitted" || status === "streaming";
  const isAssistantStreaming =
    isStreaming && messages[messages.length - 1]?.role === "assistant";

  // ── Persist messages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      localStorage.setItem("kamil-ai-chat-messages", JSON.stringify(messages));
    } catch {
      /* quota exceeded — silently skip */
    }
  }, [messages]);

  // ── Process evidence cards (after streaming completes) ────────────────────
  useEffect(() => {
    // Wait until the stream is fully settled before parsing markers
    if (status === "streaming" || status === "submitted") return;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;
    if (processedRef.current.has(lastMsg.id)) return;

    const fullText = lastMsg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

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
        loading: true,
      })),
    ];

    if (newCards.length === 0) return;

    processedRef.current.add(lastMsg.id);
    const msgId = lastMsg.id;

    setEvidenceByMessage((prev) => {
      const existing = prev[msgId] ?? [];
      const existingIds = new Set(existing.map((c) => c.id));
      const fresh = newCards.filter((c) => !existingIds.has(c.id));
      return fresh.length ? { ...prev, [msgId]: [...existing, ...fresh] } : prev;
    });

    // Patch helper — updates a single card inside a specific message
    const patch = (cardId: string, update: Partial<EvidenceCard>) =>
      setEvidenceByMessage((prev) => ({
        ...prev,
        [msgId]: (prev[msgId] ?? []).map((c) =>
          c.id === cardId ? { ...c, ...update } : c
        ),
      }));

    // Fetch each card concurrently
    for (const card of newCards) {
      if (card.type === "verse" && card.surah && card.ayah) {
        fetchVerse(card.surah, card.ayah)
          .then((data) =>
            patch(card.id, {
              text: data.text || data.uthmani || "",
              loading: false,
            })
          )
          .catch(() => patch(card.id, { loading: false, text: "Failed to load verse" }));
      } else if (card.type === "hadith" && card.collection && card.number) {
        fetchHadithByNumber(card.collection, String(card.number))
          .then((data) =>
            patch(card.id, {
              text: data.ar.text || data.en.text || "",
              loading: false,
              bookNumber: data.bookNumber,
              hadithTextEn: data.en.text,
              grades: data.ar.grades,
              chapterTitle:
                data.chapterTitle?.ar || data.chapterTitle?.en || "",
            })
          )
          .catch(() =>
            patch(card.id, { loading: false, text: "Failed to load hadith" })
          );
      }
    }
  }, [messages, status]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    if (isStreaming) stop();
    setMessages([]);
    setEvidenceByMessage({});
    processedRef.current.clear();
    setInput("");
    localStorage.removeItem("kamil-ai-chat-messages");
    toast.success("تم مسح المحادثة");
  }, [isStreaming, stop, setMessages]);

  const handleInsert = useCallback((card: EvidenceCard) => {
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
    } else {
      window.dispatchEvent(
        new CustomEvent("insert-hadith", {
          detail: {
            collection: card.collection,
            hadithNumber: String(card.number),
            hadithText: card.text,
            bookNumber: card.bookNumber,
            hadithTextEn: card.hadithTextEn,
            grades: card.grades,
            chapterTitle: card.chapterTitle,
          },
        })
      );
      toast.success("تم إدراج الحديث");
    }
  }, []);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => {
      if (!text.trim()) return;
      sendMessage({ text });
      setInput("");
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleRetry = useCallback(() => {
    const lastUserText = [...messages]
      .reverse()
      .find((m) => m.role === "user")
      ?.parts.find((p) => p.type === "text")?.text;
    if (lastUserText) sendMessage({ text: lastUserText });
  }, [messages, sendMessage]);

  // ── Render ────────────────────────────────────────────────────────────────

  const totalEvidence = Object.values(evidenceByMessage).flat().length;

  return (
    <div className="h-full flex flex-col">
      {/* ── Header ── */}
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Kamil AI</h3>
          {messages.length > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {messages.length} msg{messages.length !== 1 ? "s" : ""}
              {totalEvidence > 0 && ` · ${totalEvidence} source${totalEvidence !== 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <ConversationDownload
              messages={messages}
              filename="kamil-chat.md"
            />
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleReset}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button size="sm" variant="ghost" onClick={close}>
            Close
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-2">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              /* ── Empty state with suggestion chips ── */
              <div className="flex flex-col items-center gap-6">
                <ConversationEmptyState
                  icon={<Bot className="size-12" />}
                  title="Kamil AI"
                  description="Ask about any verse or hadith to research and insert into your writing."
                />
                <Suggestions>
                  {SUGGESTIONS.map((s) => (
                    <Suggestion
                      key={s}
                      suggestion={s}
                      onClick={() => handleSuggestion(s)}
                    >
                      {s}
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            ) : (
              /* ── Message list ── */
              messages.map((message) => (
                <div key={message.id} className="group">
                  {message.parts.map((part, i) => {
                    /* Text part */
                    if (part.type === "text") {
                      const displayText =
                        message.role === "assistant"
                          ? removeMarkers(part.text)
                          : part.text;

                      return (
                        <div key={`${message.id}-text-${i}`} className="relative">
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{displayText}</MessageResponse>
                            </MessageContent>
                          </Message>

                          {/* Copy button — visible on hover for assistant messages */}
                          {message.role === "assistant" && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 right-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => handleCopy(displayText, message.id)}
                                title="Copy"
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    /* Tool-use part */
                    if (part.type === "dynamic-tool") {
                      return (
                        <Tool key={`${message.id}-tool-${i}`}>
                          <ToolHeader
                            type={part.type}
                            state={part.state}
                            toolName={part.toolName}
                          />
                          <ToolContent>
                            <ToolInput input={part.input} />
                            <ToolOutput
                              output={part.output}
                              errorText={part.errorText}
                            />
                          </ToolContent>
                        </Tool>
                      );
                    }

                    return null;
                  })}

                  {/* Per-message evidence cards, rendered after the assistant reply */}
                  {message.role === "assistant" &&
                    evidenceByMessage[message.id]?.length > 0 && (
                      <MessageEvidenceBlock
                        cards={evidenceByMessage[message.id]}
                        onInsert={handleInsert}
                      />
                    )}
                </div>
              ))
            )}

            {/* ── Shimmer loading state ── */}
            {isStreaming && !isAssistantStreaming && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}

            {/* ── Error state with retry ── */}
            {error && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-destructive">
                <span>{error.message}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs gap-1"
                  onClick={handleRetry}
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </Button>
              </div>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* ── Prompt input ── */}
        <PromptInput onSubmit={handleSubmit} className="mt-2 mb-2">
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask about a verse or hadith…"
          />

          {isStreaming ? (
            /* Stop button during streaming */
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-1.5 right-1.5 h-8 w-8"
              onClick={stop}
              title="Stop generation"
            >
              <Square className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <PromptInputSubmit
              status="ready"
              disabled={!input.trim()}
              className="absolute bottom-1.5 right-1.5"
            />
          )}
        </PromptInput>
      </div>
    </div>
  );
}