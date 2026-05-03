import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import ChatWindow from "@/components/ChatWindow";

export const dynamic = "force-dynamic";

async function loadSkill(id: string): Promise<Skill | null> {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb.from("skills").select("*").eq("id", id).single();
    if (error || !data) return null;
    return data as Skill;
  } catch {
    return null;
  }
}

export default async function SkillPage({ params }: { params: { id: string } }) {
  const skill = await loadSkill(params.id);
  if (!skill) notFound();
  const meta = getCategoryMeta(skill.category);

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-[#d2d2d7]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1 text-[13px] text-[#0071e3] hover:underline mb-4"
          >
            ← Back to Browse
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon circle */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl flex-shrink-0"
                style={{ background: meta.lightBg }}
              >
                {meta.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: meta.lightBg, color: meta.hex }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[11px] text-[#86868b]">v{skill.version}</span>
                </div>
                <h1 className="text-[22px] font-semibold text-[#1d1d1f]">{skill.name}</h1>
              </div>
            </div>
            <Link
              href={`/skill/${skill.id}/share`}
              className="btn-ghost text-[13px]"
            >
              Share ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Chat */}
        <div>
          <ChatWindow skillId={skill.id} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* About card */}
          <div className="rounded-2xl border border-[#d2d2d7] bg-white p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73] mb-3">
              About this Skill
            </h2>
            <p className="text-[14px] leading-relaxed text-[#1d1d1f]">
              {skill.description}
            </p>
          </div>

          {/* Details card */}
          <div className="rounded-2xl border border-[#d2d2d7] bg-white p-5 space-y-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73] mb-3">
              Details
            </h2>
            <Row label="Category" value={`${meta.emoji} ${meta.label}`} />
            <Row label="Version" value={`v${skill.version}`} />
            <Row label="Access" value="Free" />
            <Row
              label="Published"
              value={new Date(skill.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
            {/* PHASE 2: pricing badge. PHASE 3: ratings. */}
          </div>

          {/* Tip card */}
          <div
            className="rounded-2xl p-5 text-[13px] leading-relaxed"
            style={{ background: meta.lightBg, color: meta.hex }}
          >
            <div className="font-semibold mb-1">💡 Tip</div>
            <div style={{ color: "#1d1d1f", opacity: 0.75 }}>
              Press <kbd className="rounded bg-white/60 px-1 font-mono">Enter</kbd> to
              send. This Skill runs on Claude — responses are generated in real time.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-[#6e6e73]">{label}</span>
      <span className="font-medium text-[#1d1d1f]">{value}</span>
    </div>
  );
}
