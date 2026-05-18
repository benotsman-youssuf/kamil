import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";

export function ChatPanel({ close }: { close: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
  });

  const busy = status === "submitted" || status === "streaming";

  const latestText = useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return "";
    return last.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("\n");
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI Chat</h3>
        <Button size="sm" variant="ghost" onClick={close}>إغلاق</Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
            <div className="inline-block rounded-md px-3 py-2 text-sm bg-muted">
              {message.parts.map((part: any, i: number) =>
                part.type === "text" ? <p key={i}>{part.text}</p> : null
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t space-y-2">
        <textarea
          className="w-full rounded-md border bg-background p-2 text-sm"
          rows={3}
          value={input}
          onChange={handleInputChange}
          placeholder="اسأل عن آية أو حديث..."
        />
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const verse = latestText.match(/\[(\d+:\d+)\]/)?.[1];
              if (!verse) return;
              window.dispatchEvent(new CustomEvent("insert-verse", { detail: { verseKey: verse } }));
            }}
          >
            إدراج آية
          </Button>
          <Button type="submit" disabled={busy}>{busy ? "..." : "إرسال"}</Button>
        </div>
      </form>
    </div>
  );
}
