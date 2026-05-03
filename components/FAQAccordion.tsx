"use client";
import { useState } from "react";
import { IconChevronDown } from "@/components/icons";

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
    <div className="divide-y divide-ink-200" role="list">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} role="listitem">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 rounded-sm"
            >
              <span className="text-[15px] font-medium text-ink">{item.q}</span>
              <span
                className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-ink-600 transition-all duration-200"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  background: isOpen ? "#FAE7DD" : "#F5F4ED",
                  color: isOpen ? "#D97757" : "#7E7E7B",
                }}
                aria-hidden
              >
                <IconChevronDown size={15} strokeWidth={2} />
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <p className="pb-5 text-[14px] leading-relaxed text-ink-600">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
