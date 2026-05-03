"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWindow({ skillId }: { skillId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
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
        body: JSON.stringify({ skill_id: skillId, history: messages, message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[#d2d2d7] bg-white overflow-hidden shadow-card">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f0f0f2] bg-[#f9f9fb]">
        <span className="h-2 w-2 rounded-full bg-[#34c759]" />
        <span className="text-[13px] font-medium text-[#6e6e73]">Live Session</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 overflow-y-auto p-5 h-[420px]">
        {messages.length === 0 && (
          <div className="m-auto text-center">
            <div className="text-4xl mb-3">💬</div>
            <div className="text-[15px] font-medium text-[#1d1d1f]">Start the conversation</div>
            <div className="text-[13px] text-[#6e6e73] mt-1">
              Send a message to begin using this Skill.
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-[#0071e3] px-4 py-2.5 text-[14px] text-white"
                : "mr-auto max-w-[78%] rounded-2xl rounded-bl-sm bg-[#f5f5f7] border border-[#e8e8ed] px-4 py-2.5 text-[14px] text-[#1d1d1f] whitespace-pre-wrap"
            }
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[#f5f5f7] border border-[#e8e8ed] px-4 py-3">
            <span className="typing-dot" />
            <span className="typing-dot animation-delay-150" />
            <span className="typing-dot animation-delay-300" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {err && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-[13px] text-red-600">
          {err}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 border-t border-[#f0f0f2] bg-[#f9f9fb] p-3">
        <input
          className="flex-1 rounded-xl border border-[#d2d2d7] bg-white px-4 py-2.5 text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition"
          placeholder="Message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          disabled={busy}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="flex items-center justify-center rounded-xl bg-[#0071e3] px-4 py-2.5 text-white transition hover:bg-[#0077ed] disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
