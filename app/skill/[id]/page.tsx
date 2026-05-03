import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import ChatWindow from "@/components/ChatWindow";
import { IconArrowRight, IconExternalLink } from "@/components/icons";

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
    <div className="min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1 text-[13px] text-coral hover:underline mb-4"
          >
            <IconArrowRight size={14} className="rotate-180" /> Back to browse
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
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
                  <span className="text-[11px] text-ink-500">v{skill.version}</span>
                </div>
                <h1 className="text-[22px] font-semibold text-ink">{skill.name}</h1>
              </div>
            </div>
            <Link href={`/skill/${skill.id}/share`} className="btn-ghost text-[13px]">
              <IconExternalLink size={13} />
              Share
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <ChatWindow skillId={skill.id} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-3">
              About this skill
            </h2>
            <p className="text-[14px] leading-relaxed text-ink">{skill.description}</p>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white p-5 space-y-3">
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-3">
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
          </div>

          <div
            className="rounded-2xl p-5 text-[13px] leading-relaxed border border-coral/15 bg-coral-50"
          >
            <div className="font-semibold mb-1 text-coral-700">Tip</div>
            <div className="text-ink-700">
              Press <kbd className="rounded bg-white border border-ink-200 px-1.5 py-0.5 font-mono text-[11px]">Enter</kbd> to send. Skills run on Claude — responses generate in real time.
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
      <span className="text-ink-600">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
