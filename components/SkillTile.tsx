import Link from "next/link";
import type { Skill } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import { IconArrowRight } from "@/components/icons";

// Generates a deterministic warm gradient from the skill name so
// every thumbnail-less skill still gets a unique-looking tile.
function gradientFor(name: string, hex: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const angle = h % 360;
  return `linear-gradient(${angle}deg, ${hex}E6 0%, ${hex}99 100%)`;
}

function timeAgo(dateStr: string) {
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

export default function SkillTile({
  skill,
  rank,
}: {
  skill: Skill;
  rank?: number;
}) {
  const meta = getCategoryMeta(skill.category);

  return (
    <Link
      href={`/skill/${skill.id}`}
      className="skill-tile-pop group flex flex-col overflow-hidden bg-white"
    >
      {/* ── Thumbnail / hero ── */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ background: gradientFor(skill.name, meta.hex) }}
      >
        {skill.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={skill.thumbnail_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[64px] drop-shadow-md opacity-90">{meta.emoji}</span>
          </div>
        )}

        {/* Gradient legibility overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Rank badge (top-right) */}
        {rank !== undefined && (
          <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900/90 text-white text-[11px] font-semibold backdrop-blur-sm">
            #{rank}
          </span>
        )}

        {/* Category pill (bottom-left) */}
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm shadow-sm"
          style={{ color: meta.hex }}
        >
          {meta.emoji} {meta.label}
        </span>

        {/* Usage count (bottom-right) */}
        {typeof skill.usage_count === "number" && skill.usage_count > 0 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-ink-700 backdrop-blur-sm shadow-sm">
            {skill.usage_count.toLocaleString()} runs
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-[16px] font-semibold leading-snug text-ink group-hover:text-coral transition-colors">
          {skill.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 line-clamp-2 flex-1">
          {skill.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="text-[11px] text-ink-500">
            v{skill.version} · {timeAgo(skill.created_at)}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-coral group-hover:translate-x-0.5 transition-transform">
            Start
            <IconArrowRight size={14} strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
