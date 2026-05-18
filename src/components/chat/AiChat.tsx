import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Send, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { Message, MessageContent, MessageAvatar } from "@/components/prompt-kit/message";

export function AiChat({ close }: { close: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
    api: "/api/chat",
  });

  const busy = status === "submitted" || status === "streaming";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" as ScrollBehavior });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Kamil AI</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={close}>Close</Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
            <Sparkles className="h-8 w-8 mb-3" />
            <p className="text-sm">Ask about any verse or hadith to research and insert into your writing.</p>
          </div>
        )}

        <div className="flex flex-col gap-4 p-4">
          {messages.map((m) => (
            <Message key={m.id} className={m.role === "user" ? "flex-row-reverse" : ""}>
              {m.role === "assistant" && (
                <MessageAvatar
                  src=""
                  alt="AI"
                  fallback="K"
                />
              )}
              {m.role === "user" && (
                <MessageAvatar
                  src=""
                  alt="You"
                  fallback="U"
                />
              )}
              <MessageContent markdown={m.role === "assistant"}>
                {m.role === "user" ? m.content : m.content}
              </MessageContent>
            </Message>
          ))}

          {error && (
            <div className="text-xs text-destructive text-center">
              Error: {error.message}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex-shrink-0">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about a verse or hadith..."
            disabled={busy}
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
