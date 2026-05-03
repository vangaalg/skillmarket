"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";

export default function CategoryFilter({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  // Group by category for section headers when "all" is selected.
  const grouped: { catKey: string; skills: Skill[] }[] =
    active === "all"
      ? CATEGORIES.filter((c) => c.key !== "all")
          .map((c) => ({
            catKey: c.key,
            skills: skills.filter((s) => (s.category || "other") === c.key),
          }))
          .filter((g) => g.skills.length > 0)
      : [{ catKey: active, skills: filtered }];

  return (
    <div>
      {/* Active filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.key;
          const count =
            cat.key === "all"
              ? skills.length
              : skills.filter((s) => (s.category || "other") === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className="cat-pill transition-all"
              style={{
                background: isActive ? cat.hex : "#ffffff",
                color: isActive ? "#ffffff" : "#1F1E1D",
                border: `1.5px solid ${isActive ? cat.hex : "#E1DFD7"}`,
              }}
            >
              {cat.emoji} {cat.label}
              {count > 0 && (
                <span
                  className="ml-1.5 text-[11px] font-normal opacity-80"
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m17 8-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
          </div>
          <div className="text-[17px] font-medium text-ink">No skills yet</div>
          <p className="mt-1 text-[14px] text-ink-600">Be the first to upload one.</p>
          <Link href="/upload" className="btn-primary mt-5 inline-flex">
            Upload a skill
          </Link>
        </div>
      )}

      {grouped.map(({ catKey, skills: catSkills }) => {
        if (catSkills.length === 0) return null;
        const meta = getCategoryMeta(catKey);
        return (
          <div key={catKey} id={catKey} className="mb-12">
            {active === "all" && (
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-lg"
                  style={{ background: meta.lightBg }}
                >
                  {meta.emoji}
                </span>
                <h2 className="text-[19px] font-semibold text-ink">
                  {meta.label}
                </h2>
                <span className="text-[13px] text-ink-600">
                  {catSkills.length} skill{catSkills.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catSkills.map((skill) => (
                <SkillTile key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillTile({ skill }: { skill: Skill }) {
  const meta = getCategoryMeta(skill.category);
  const timeAgo = getTimeAgo(skill.created_at);

  return (
    <article className="skill-tile group flex flex-col">
      {/* Colored accent bar */}
      <div className="h-1 w-full" style={{ background: meta.hex }} />

      <div className="flex flex-col flex-1 p-5">
        {/* Category badge + version */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{ background: meta.lightBg, color: meta.hex }}
          >
            {meta.emoji} {meta.label}
          </span>
          <span className="text-[11px] text-ink-500">v{skill.version}</span>
        </div>

        {/* Name */}
        <h3 className="text-[17px] font-semibold leading-snug text-ink group-hover:text-coral transition-colors">
          {skill.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 line-clamp-3 flex-1">
          {skill.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <span className="text-[11px] text-ink-500">{timeAgo}</span>
          <Link href={`/skill/${skill.id}`} className="btn-primary text-[13px] px-4 py-1.5">
            Start
          </Link>
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
