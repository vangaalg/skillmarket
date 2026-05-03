"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What is a Skill?",
    a: "A Skill is a Claude-powered assistant you can chat with. Each Skill has a custom definition (a SKILL.md file) written by its creator, which tells Claude how to behave, what to focus on, and how to respond. Think of it as a specialised AI tuned for a specific task.",
  },
  {
    q: "Is it free to use?",
    a: "Yes — Phase 1 is completely free. You can browse, run, and upload Skills with no account or payment required. Paid tiers for premium Skills and creator payouts are planned for a future phase.",
  },
  {
    q: "How do I upload my own Skill?",
    a: "Go to Upload → fill in a name, description, and choose a category → paste your SKILL.md definition (or drop the file from your laptop). Click Publish and your Skill is live immediately.",
  },
  {
    q: "What AI model powers the Skills?",
    a: "Skills run on Claude (claude-sonnet-4-6 by default). The model is configurable via the ANTHROPIC_MODEL environment variable if you're self-hosting.",
  },
  {
    q: "What file formats can I upload?",
    a: "The upload page accepts .md, .txt, and .json files. If your Skill is a ZIP bundle, unzip it locally and upload the SKILL.md file directly. ZIP support is coming soon.",
  },
  {
    q: "Can I update a Skill after publishing?",
    a: "Versioning is built into the database schema (skills.version column). A full update UI is part of Phase 4. For now, re-upload with the same name and new definition.",
  },
  {
    q: "Is this open source?",
    a: "The platform is built on open standards: Next.js, Supabase, and the Anthropic API. You're free to fork and self-host. Community contributions are welcome.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[#e8e8ed]" role="list">
      {FAQS.map((item, i) => (
        <div key={i} role="listitem">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 rounded-sm"
          >
            <span className="text-[15px] font-medium text-[#1d1d1f]">{item.q}</span>
            <span
              className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] text-[14px] transition-transform duration-200"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
              aria-hidden
            >
              +
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "400px" : "0px", opacity: open === i ? 1 : 0 }}
          >
            <p className="pb-5 text-[14px] leading-relaxed text-[#6e6e73]">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
