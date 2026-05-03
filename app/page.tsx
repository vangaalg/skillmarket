import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES, getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import FAQAccordion from "@/components/FAQAccordion";
import {
  IconArrowRight,
  IconCheck,
  IconCircleDot,
  IconGlobe,
  IconLayers,
  IconLock,
  IconPlay,
  IconRocket,
  IconSearch,
  IconShield,
  IconUnlock,
  IconUpload,
  IconZap,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skillorbit.ai — The open platform for agents and skills",
  description:
    "Discover, run, and publish Claude-powered AI agents and skills. Free, open, and community-built. No signup required.",
};

async function loadPreviewSkills(): Promise<Skill[]> {
  try {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("skills")
      .select("id,name,description,category,version,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return (data ?? []) as Skill[];
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const sb = supabaseAdmin();
    const { count: totalSkills } = await sb
      .from("skills")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);
    const { data: catData } = await sb
      .from("skills")
      .select("category")
      .eq("is_published", true);
    const uniqueCats = new Set((catData ?? []).map((r) => r.category)).size;
    return { totalSkills: totalSkills ?? 0, uniqueCats };
  } catch {
    return { totalSkills: 0, uniqueCats: 0 };
  }
}

export default async function LandingPage() {
  const [previewSkills, stats] = await Promise.all([loadPreviewSkills(), getStats()]);

  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────────────────── */}
      <section aria-label="Hero" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(217,119,87,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral-50 px-3.5 py-1 text-[12px] font-semibold uppercase tracking-widest text-coral-600 mb-7">
                <IconCircleDot size={10} />
                Open Platform · Phase 1 Live
              </div>

              <h1 className="display text-ink leading-[1.05]">
                The open platform
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #D97757 0%, #C5644A 70%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  for agents and skills.
                </span>
              </h1>

              <p className="mt-6 text-[17px] leading-[1.65] text-ink-600 max-w-lg">
                Discover Claude-powered agents and skills built by the community.
                Run any skill instantly — no signup, no cost. Publish yours in minutes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/browse" className="btn-primary px-6 py-3 text-[15px] shadow-coral">
                  Browse skills
                  <IconArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link href="/upload" className="btn-ghost px-6 py-3 text-[15px]">
                  <IconUpload size={15} />
                  Publish a skill
                </Link>
              </div>

              <p className="mt-7 text-[12px] text-ink-500 flex items-center gap-2">
                <IconShield size={14} />
                No account required · Powered by Claude · Always free
              </p>
            </div>

            <div aria-hidden className="hidden lg:block">
              <ProductMockup skills={previewSkills} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ─────────────────────────────────────────────── */}
      <section aria-label="Stats" className="border-y border-ink-200 bg-cream-200">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <dl className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <StatItem value={stats.totalSkills || "0"} label="Skills published" />
            <Divider />
            <StatItem value={stats.uniqueCats || "8"} label="Categories" />
            <Divider />
            <StatItem value="Free" label="Forever open" />
            <Divider />
            <StatItem value="Claude" label="Powered by" />
          </dl>
        </div>
      </section>

      {/* ── 3. FEATURES ──────────────────────────────────────────────── */}
      <section aria-labelledby="features-heading" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 id="features-heading" className="headline text-ink">
              Everything you need.
              <br />
              <span className="text-coral">Nothing you don't.</span>
            </h2>
            <p className="mt-4 text-[15px] text-ink-600 max-w-md mx-auto">
              A clean, fast, open platform that gets out of your way and lets the skills speak.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────── */}
      <section aria-labelledby="how-heading" className="bg-cream-200 py-20 border-y border-ink-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 id="how-heading" className="headline text-ink">
              Up and running in seconds.
            </h2>
            <p className="mt-4 text-[15px] text-ink-600">Three steps from landing to conversation.</p>
          </div>

          <ol className="grid gap-6 sm:grid-cols-3" role="list">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-2xl bg-white border border-ink-200 p-7 shadow-card"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white font-semibold text-[14px] mb-5 shadow-coral">
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden sm:block absolute -right-3 top-9 text-ink-300 z-10"
                  >
                    <IconArrowRight size={20} />
                  </div>
                )}
                <div className="mb-3 text-coral">
                  <step.icon size={22} />
                </div>
                <h3 className="text-[16px] font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-ink-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 5. CATEGORIES ────────────────────────────────────────────── */}
      <section aria-labelledby="categories-heading" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="categories-heading" className="headline text-ink">
                Skills for every need.
              </h2>
              <p className="mt-2 text-[15px] text-ink-600">Eight categories, growing daily.</p>
            </div>
            <Link href="/browse" className="text-[14px] text-coral hover:underline font-medium inline-flex items-center gap-1">
              Browse all <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
              <Link
                key={cat.key}
                href={`/browse#${cat.key}`}
                className="group rounded-2xl border border-ink-200 bg-white p-5 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-coral/30 transition-all"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ background: cat.lightBg }}
                >
                  {cat.emoji}
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-ink group-hover:text-coral transition-colors">
                    {cat.label}
                  </div>
                  <div className="text-[12px] text-ink-500 mt-0.5">
                    {CAT_DESCRIPTIONS[cat.key] ?? "Explore Skills"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. LIVE SKILLS PREVIEW ────────────────────────────────────── */}
      {previewSkills.length > 0 && (
        <section aria-labelledby="latest-heading" className="bg-cream-200 py-20 border-y border-ink-200">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <h2 id="latest-heading" className="headline text-ink">Latest skills.</h2>
                <p className="mt-2 text-[15px] text-ink-600">Fresh from the community — ready to run.</p>
              </div>
              <Link href="/browse" className="text-[14px] text-coral hover:underline font-medium inline-flex items-center gap-1">
                View all {stats.totalSkills} <IconArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previewSkills.map((skill) => (
                <SkillPreviewCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. CREATOR PITCH ────────────────────────────────────────── */}
      <section aria-labelledby="creator-heading" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl overflow-hidden grid lg:grid-cols-2 shadow-card">
            <div className="bg-ink-900 p-10 lg:p-14">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-400 mb-4">
                For creators
              </div>
              <h2 id="creator-heading" className="text-[26px] sm:text-[32px] font-semibold leading-tight text-white mb-4">
                Build once.<br />Reach everyone.
              </h2>
              <p className="text-[14px] leading-relaxed text-ink-300 mb-8">
                Write a SKILL.md, describe your idea, hit publish. Your skill is live
                instantly — no infrastructure, no billing setup, no review queue.
              </p>
              <ul className="space-y-2.5 mb-8">
                {CREATOR_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-ink-100">
                    <span className="text-coral mt-0.5 flex-shrink-0"><IconCheck size={16} strokeWidth={2.25} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/upload" className="btn-primary text-[14px]">
                Publish your skill <IconArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </div>

            <div className="p-10 lg:p-14" style={{ background: "linear-gradient(135deg, #D97757 0%, #C5644A 100%)" }}>
              <div className="text-[12px] font-semibold uppercase tracking-widest text-coral-100 mb-4">
                For everyone
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-semibold leading-tight text-white mb-4">
                Run any skill.<br />No setup required.
              </h2>
              <p className="text-[14px] leading-relaxed text-coral-50 mb-8 opacity-90">
                Browse the marketplace, find a skill that solves your problem, click
                Start. You're in a live Claude session in under a second.
              </p>
              <ul className="space-y-2.5 mb-8">
                {USER_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-white">
                    <span className="text-white/80 mt-0.5 flex-shrink-0"><IconCheck size={16} strokeWidth={2.25} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/browse" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-coral-700 hover:bg-coral-50 transition-colors">
                Browse skills <IconArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="bg-cream-200 py-20 border-y border-ink-200">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="headline text-ink">Common questions.</h2>
            <p className="mt-3 text-[15px] text-ink-600">Everything you need to know before you start.</p>
          </div>
          <div className="rounded-2xl bg-white border border-ink-200 px-6 py-2 shadow-card">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* ── 9. BOTTOM CTA ────────────────────────────────────────────── */}
      <section aria-label="Call to action" className="bg-ink-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[28px] sm:text-[36px] font-semibold leading-tight text-white mb-4">
            Ready to explore AI skills?
          </h2>
          <p className="text-[15px] text-ink-300 mb-8 max-w-md mx-auto">
            No account. No credit card. No friction. Just open the marketplace and start.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/browse" className="btn-primary px-7 py-3 text-[15px]">
              Browse skills <IconArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-7 py-3 text-[15px] font-medium text-white hover:border-white/45 hover:bg-white/5 transition-colors"
            >
              <IconUpload size={15} />
              Publish a skill
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function ProductMockup({ skills }: { skills: Skill[] }) {
  const sample = skills.slice(0, 3);
  const placeholders = [
    { name: "Resume Reviewer", description: "Get instant AI feedback on your resume's structure, language, and impact.", category: "writing" },
    { name: "SQL Assistant", description: "Write, debug, and optimise SQL queries with natural-language prompts.", category: "code" },
    { name: "Market Research", description: "Summarise competitive landscapes and surface key insights.", category: "research" },
  ];
  const cards = sample.length >= 2 ? sample : placeholders;

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <div
        className="rounded-2xl border border-ink-200 bg-white overflow-hidden shadow-[0_24px_80px_rgba(31,30,29,0.14)]"
        style={{ transform: "rotateY(-4deg) rotateX(3deg)" }}
      >
        <div className="flex items-center gap-1.5 bg-cream-200 border-b border-ink-200 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 rounded bg-white border border-ink-200 px-3 py-1 text-[11px] text-ink-500">
            skillorbit.ai/browse
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 gap-3">
          {cards.map((skill, i) => {
            const meta = getCategoryMeta(skill.category);
            return (
              <div key={i} className="rounded-xl border border-ink-200 p-3.5 flex gap-3 items-start">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: meta.lightBg }}
                >
                  {meta.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-ink truncate">{skill.name}</div>
                  <div className="text-[11px] text-ink-600 line-clamp-1 mt-0.5">{skill.description}</div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-coral px-2.5 py-0.5 text-[10px] font-medium text-white">
                  Start
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 rounded-xl bg-ink-900 px-3 py-2 text-[11px] font-semibold text-white shadow-lg flex items-center gap-1.5">
        <IconCheck size={12} strokeWidth={2.5} className="text-coral" />
        Free · No signup
      </div>
    </div>
  );
}

function SkillPreviewCard({ skill }: { skill: Skill }) {
  const meta = getCategoryMeta(skill.category);
  return (
    <article className="skill-tile group flex flex-col">
      <div className="h-[3px]" style={{ background: meta.hex }} />
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: meta.lightBg, color: meta.hex }}
          >
            {meta.emoji} {meta.label}
          </span>
          <span className="text-[11px] text-ink-500">v{skill.version}</span>
        </div>
        <h3 className="text-[16px] font-semibold text-ink group-hover:text-coral transition-colors">
          {skill.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 line-clamp-2 flex-1">
          {skill.description}
        </p>
        <div className="mt-4 pt-4 border-t border-ink-100 flex justify-end">
          <Link href={`/skill/${skill.id}`} className="btn-primary text-[13px] px-4 py-1.5">
            Start <IconArrowRight size={13} strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </article>
  );
}

type FeatureItem = {
  icon: (p: { size?: number }) => React.JSX.Element;
  title: string;
  desc: string;
  accent: string;
};

function FeatureCard({ icon: Icon, title, desc, accent }: FeatureItem) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 hover:shadow-card transition-shadow">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: accent + "1A", color: accent }}
      >
        <Icon size={20} />
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-2">{title}</h3>
      <p className="text-[13px] leading-relaxed text-ink-600">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <dt className="text-[22px] font-semibold tracking-tight text-ink">{value}</dt>
      <dd className="text-[12px] text-ink-600 mt-0.5">{label}</dd>
    </div>
  );
}

function Divider() {
  return <div aria-hidden className="hidden sm:block h-8 w-px bg-ink-200" />;
}

/* ─── Static data ──────────────────────────────────────────────────────── */

const FEATURES: FeatureItem[] = [
  { icon: IconUnlock, title: "Truly open", desc: "Anyone can publish. No gatekeeping, no review queue, no vendor lock-in.", accent: "#D97757" },
  { icon: IconZap, title: "Instant run", desc: "Click Start, get a live Claude session. No account, no configuration.", accent: "#F59E0B" },
  { icon: IconLayers, title: "Organised", desc: "Eight categories — Writing, Code, Data, Creative, Research, and more.", accent: "#8B5CF6" },
  { icon: IconUpload, title: "Bring your own", desc: "Write a SKILL.md and publish in minutes. Runs on Claude immediately.", accent: "#10B981" },
  { icon: IconLock, title: "Secure by design", desc: "API keys stay server-side. Inputs validated. Rate-limited by IP.", accent: "#E94B6F" },
  { icon: IconGlobe, title: "Deploy anywhere", desc: "Built on Next.js and Supabase. Deploy to Vercel or self-host.", accent: "#0EA5B7" },
];

const STEPS = [
  { icon: IconSearch, title: "Browse", desc: "Explore skills by category. Every skill shows what it does before you start." },
  { icon: IconPlay, title: "Start", desc: "Click Start on any skill — you're instantly in a live Claude chat. No login." },
  { icon: IconRocket, title: "Build & publish", desc: "Drop a SKILL.md, fill in a description, pick a category, hit publish." },
];

const CREATOR_BULLETS = [
  "No coding required — write plain Markdown",
  "Live on the platform immediately",
  "Version control built in",
  "Monetisation coming in Phase 2",
];

const USER_BULLETS = [
  "Zero configuration or signup",
  "Skills across 8 categories",
  "Powered by Claude · always on",
  "Free in Phase 1",
];

const CAT_DESCRIPTIONS: Record<string, string> = {
  writing: "Drafting, editing, summarising",
  code: "Debugging, generation, review",
  data: "Analysis, charts, insights",
  creative: "Ideation, design, storytelling",
  research: "Deep dives, comparisons",
  business: "Strategy, emails, planning",
  education: "Explainers, tutors, quizzes",
  other: "Everything else",
};
