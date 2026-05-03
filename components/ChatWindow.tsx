"use client";

import { useEffect, useRef, useState } from "react";
import { IconMessage, IconSend } from "@/components/icons";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWindow({ skillId }: { skillId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Track session id so we don't create a new sessions row per message.
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setErr(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    try {
      const res = await fetch("/api/skills/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          skill_id: skillId,
          history: messages,
          message: text,
          session_id: sessionId ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (data.session_id && !sessionId) setSessionId(data.session_id);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-ink-200 bg-white overflow-hidden shadow-card">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 bg-cream-200">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[13px] font-medium text-ink-600">Live Session</span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto p-5 h-[440px]">
        {messages.length === 0 && (
          <div className="m-auto text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral">
              <IconMessage size={22} />
            </div>
            <div className="text-[15px] font-medium text-ink">Start the conversation</div>
            <div className="text-[13px] text-ink-600 mt-1">
              Send a message to begin using this skill.
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-coral px-4 py-2.5 text-[14px] text-white"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-cream-200 border border-ink-200 px-4 py-2.5 text-[14px] text-ink whitespace-pre-wrap"
            }
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-cream-200 border border-ink-200 px-4 py-3">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {err && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-[13px] text-red-600">
          {err}
        </div>
      )}

      <div className="flex gap-2 border-t border-ink-100 bg-cream-200 p-3">
        <input
          className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-500 outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition"
          placeholder="Message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          disabled={busy}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="flex items-center justify-center rounded-xl bg-coral px-4 py-2.5 text-white transition hover:bg-coral-600 disabled:opacity-40"
        >
          <IconSend size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
