import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import ChatWindow from "@/components/ChatWindow";
import ShareButton from "@/components/ShareButton";
import { IconArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://skillorbit.ai";

async function loadSkill(id: string): Promise<Skill | null> {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("skills_with_usage")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) {
      // Fallback if the view hasn't been created yet.
      const fb = await sb.from("skills").select("*").eq("id", id).single();
      if (fb.error || !fb.data) return null;
      return fb.data as Skill;
    }
    return data as Skill;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const skill = await loadSkill(params.id);
  if (!skill) {
    return { title: "Skill not found" };
  }
  const url = `${APP_URL}/skill/${skill.id}`;
  const title = `${skill.name} — Skillorbit.ai`;
  const description = skill.description.slice(0, 200);
  const ogImage = skill.thumbnail_url ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Skillorbit.ai",
      images: ogImage ? [{ url: ogImage, alt: skill.name }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function SkillPage({ params }: { params: { id: string } }) {
  const skill = await loadSkill(params.id);
  if (!skill) notFound();
  const meta = getCategoryMeta(skill.category);
  const shareUrl = `${APP_URL}/skill/${skill.id}`;

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
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
              {/* Thumbnail or category icon */}
              {skill.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={skill.thumbnail_url}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover border border-ink-200 flex-shrink-0"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl flex-shrink-0"
                  style={{ background: meta.lightBg }}
                >
                  {meta.emoji}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: meta.lightBg, color: meta.hex }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[11px] text-ink-500">v{skill.version}</span>
                  {typeof skill.usage_count === "number" && skill.usage_count > 0 && (
                    <span className="text-[11px] text-ink-500">
                      · {skill.usage_count.toLocaleString()} runs
                    </span>
                  )}
                </div>
                <h1 className="text-[22px] font-semibold text-ink">{skill.name}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/skill/${skill.id}/edit`} className="btn-ghost text-[13px]">
                Edit
              </Link>
              <ShareButton
                url={shareUrl}
                title={`${skill.name} on Skillorbit.ai`}
                text={skill.description}
                className="btn-primary text-[13px] px-4 py-2"
                label="Share skill"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
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
            {typeof skill.usage_count === "number" && (
              <Row label="Runs" value={skill.usage_count.toLocaleString()} />
            )}
            <Row
              label="Published"
              value={new Date(skill.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
          </div>

          {/* Share card — emphasises the platform's main motto */}
          <div className="rounded-2xl border border-coral/15 bg-coral-50 p-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-coral-700 mb-2">
              Share with friends
            </h2>
            <p className="text-[13px] leading-relaxed text-ink-700 mb-3">
              Send this skill to peers — they can run it instantly without an account.
            </p>
            <ShareButton
              url={shareUrl}
              title={`${skill.name} on Skillorbit.ai`}
              text={skill.description}
              className="btn-primary text-[13px] w-full justify-center py-2"
              label="Copy share link"
            />
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
