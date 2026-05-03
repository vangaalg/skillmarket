import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES, getCategoryMeta } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skill Marketplace — Open AI Skills Platform",
  description:
    "Discover, run, and publish Claude-powered AI Skills. Free, open, and community-built. No signup required.",
  openGraph: {
    title: "Skill Marketplace — Open AI Skills Platform",
    description: "Discover and run Claude-powered AI Skills. Upload yours in minutes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Marketplace — Open AI Skills Platform",
    description: "Discover and run Claude-powered AI Skills. Free, open, no signup.",
  },
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
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-white"
      >
        {/* Background gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,113,227,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0071e3]/20 bg-[#e8f1ff] px-3.5 py-1 text-[12px] font-semibold uppercase tracking-widest text-[#0071e3] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0071e3] animate-pulse" />
                Open Platform · Phase 1 Live
              </div>

              {/* H1 */}
              <h1 className="display text-[#1d1d1f] leading-[1.05]">
                The open marketplace
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #0071e3 0%, #6e40c9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  for AI Skills.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mt-5 text-[17px] leading-[1.65] text-[#6e6e73] max-w-lg">
                Discover Claude-powered Skills built by the community. Run any
                Skill instantly — no signup, no cost. Upload yours in minutes.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/browse"
                  className="btn-primary px-6 py-3 text-[15px] shadow-sm"
                >
                  Browse Skills →
                </Link>
                <Link
                  href="/upload"
                  className="btn-ghost px-6 py-3 text-[15px]"
                >
                  Upload a Skill
                </Link>
              </div>

              {/* Trust line */}
              <p className="mt-6 text-[12px] text-[#86868b] flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                No account required · Powered by Claude · Always free
              </p>
            </div>

            {/* Right — product visual */}
            <div aria-hidden className="hidden lg:block">
              <ProductMockup skills={previewSkills} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ─────────────────────────────────────────────── */}
      <section aria-label="Statistics" className="border-y border-[#e8e8ed] bg-[#f9f9fb]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <dl className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
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
      <section aria-labelledby="features-heading" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 id="features-heading" className="headline text-[#1d1d1f]">
              Everything you need.
              <br />
              <span className="text-[#0071e3]">Nothing you don't.</span>
            </h2>
            <p className="mt-4 text-[15px] text-[#6e6e73] max-w-md mx-auto">
              A clean, fast, open platform designed to get out of your way and let the Skills speak.
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
      <section aria-labelledby="how-heading" className="bg-[#f5f5f7] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 id="how-heading" className="headline text-[#1d1d1f]">
              Up and running in seconds.
            </h2>
            <p className="mt-4 text-[15px] text-[#6e6e73]">
              Three steps from landing to conversation.
            </p>
          </div>

          <ol className="grid gap-6 sm:grid-cols-3" role="list">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-2xl bg-white border border-[#e8e8ed] p-7 shadow-card"
              >
                {/* Step number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3] text-white font-semibold text-[15px] mb-5">
                  {i + 1}
                </div>
                {/* Connector arrow (hidden on last) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden sm:block absolute -right-3.5 top-10 text-[#d2d2d7] text-xl z-10"
                  >
                    →
                  </div>
                )}
                <div className="text-3xl mb-3">{step.emoji}</div>
                <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-2">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-[#6e6e73]">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 5. CATEGORIES ────────────────────────────────────────────── */}
      <section aria-labelledby="categories-heading" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="categories-heading" className="headline text-[#1d1d1f]">
                Skills for every need.
              </h2>
              <p className="mt-2 text-[15px] text-[#6e6e73]">
                Eight categories, growing daily.
              </p>
            </div>
            <Link href="/browse" className="text-[14px] text-[#0071e3] hover:underline font-medium">
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
              <Link
                key={cat.key}
                href={`/browse#${cat.key}`}
                className="group rounded-2xl border border-[#e8e8ed] bg-[#f9f9fb] p-5 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ background: cat.lightBg }}
                >
                  {cat.emoji}
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                    {cat.label}
                  </div>
                  <div className="text-[12px] text-[#86868b] mt-0.5">
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
        <section aria-labelledby="latest-heading" className="bg-[#f5f5f7] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <h2 id="latest-heading" className="headline text-[#1d1d1f]">
                  Latest Skills.
                </h2>
                <p className="mt-2 text-[15px] text-[#6e6e73]">
                  Fresh from the community — ready to run.
                </p>
              </div>
              <Link href="/browse" className="text-[14px] text-[#0071e3] hover:underline font-medium">
                View all {stats.totalSkills} →
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
      <section aria-labelledby="creator-heading" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl overflow-hidden grid lg:grid-cols-2">
            {/* Left */}
            <div className="bg-[#1d1d1f] p-10 lg:p-14">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-[#6e6e73] mb-4">
                For Creators
              </div>
              <h2 id="creator-heading" className="text-[26px] sm:text-[32px] font-semibold leading-tight text-white mb-4">
                Build once.<br />Reach everyone.
              </h2>
              <p className="text-[14px] leading-relaxed text-[#86868b] mb-8">
                Write a SKILL.md, describe your idea, hit Publish. Your Skill is
                live on the marketplace instantly. No infrastructure, no billing
                setup, no review queue — just your idea, running on Claude.
              </p>
              <ul className="space-y-2.5 mb-8">
                {CREATOR_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-[#e8e8ed]">
                    <span className="text-[#34c759] mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/upload" className="btn-primary bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] text-[14px]">
                Upload your Skill →
              </Link>
            </div>

            {/* Right */}
            <div className="bg-[#0071e3] p-10 lg:p-14">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-[#b8d4f8] mb-4">
                For Everyone
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-semibold leading-tight text-white mb-4">
                Run any Skill.<br />No setup required.
              </h2>
              <p className="text-[14px] leading-relaxed text-[#b8d4f8] mb-8">
                Browse the marketplace, find a Skill that solves your problem,
                and click Start. You're in a live Claude-powered session in
                under a second. Free. Always.
              </p>
              <ul className="space-y-2.5 mb-8">
                {USER_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-white">
                    <span className="text-white/60 mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/browse" className="btn-primary bg-white text-[#0071e3] hover:bg-[#f0f7ff] text-[14px]">
                Browse Skills →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="bg-[#f5f5f7] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="headline text-[#1d1d1f]">
              Common questions.
            </h2>
            <p className="mt-3 text-[15px] text-[#6e6e73]">
              Everything you need to know before you start.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#e8e8ed] px-6 py-2 shadow-card">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* ── 9. BOTTOM CTA ────────────────────────────────────────────── */}
      <section aria-label="Call to action" className="bg-[#1d1d1f] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[28px] sm:text-[36px] font-semibold leading-tight text-white mb-4">
            Ready to explore AI Skills?
          </h2>
          <p className="text-[15px] text-[#86868b] mb-8 max-w-md mx-auto">
            No account. No credit card. No friction. Just open the marketplace
            and start.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/browse"
              className="btn-primary bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] px-7 py-3 text-[15px]"
            >
              Browse Skills →
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-3 text-[15px] font-medium text-white hover:border-white/40 transition-colors"
            >
              Upload a Skill
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Sub-components (server, no client JS) ─────────────────────────────── */

function ProductMockup({ skills }: { skills: Skill[] }) {
  const sample = skills.slice(0, 3);
  const placeholders = [
    { name: "Resume Reviewer", description: "Get instant AI feedback on your resume's structure, language, and impact.", category: "writing" },
    { name: "SQL Assistant", description: "Write, debug, and optimise SQL queries with natural-language prompts.", category: "code" },
    { name: "Market Research", description: "Summarise competitive landscapes and surface key insights fast.", category: "research" },
  ];
  const cards = sample.length >= 2 ? sample : placeholders;

  return (
    <div
      className="relative"
      style={{ perspective: "1000px" }}
    >
      {/* Browser chrome */}
      <div
        className="rounded-2xl border border-[#d2d2d7] bg-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
        style={{ transform: "rotateY(-4deg) rotateX(3deg)" }}
      >
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 bg-[#f5f5f7] border-b border-[#e8e8ed] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 rounded bg-white border border-[#d2d2d7] px-3 py-1 text-[11px] text-[#86868b]">
            skillmarketplace.app/browse
          </div>
        </div>
        {/* Card grid */}
        <div className="p-4 grid grid-cols-1 gap-3">
          {cards.map((skill, i) => {
            const meta = getCategoryMeta(skill.category);
            return (
              <div key={i} className="rounded-xl border border-[#e8e8ed] p-3.5 flex gap-3 items-start">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: meta.lightBg }}
                >
                  {meta.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1d1d1f] truncate">{skill.name}</div>
                  <div className="text-[11px] text-[#6e6e73] line-clamp-1 mt-0.5">{skill.description}</div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-[#0071e3] px-2.5 py-0.5 text-[10px] font-medium text-white">
                  Start
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Decorative floating badge */}
      <div className="absolute -bottom-4 -right-4 rounded-xl bg-[#34c759] px-3 py-2 text-[11px] font-semibold text-white shadow-lg">
        ✓ Free · No signup
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
          <span className="text-[11px] text-[#86868b]">v{skill.version}</span>
        </div>
        <h3 className="text-[16px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
          {skill.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#6e6e73] line-clamp-2 flex-1">
          {skill.description}
        </p>
        <div className="mt-4 pt-4 border-t border-[#f0f0f2] flex justify-end">
          <Link href={`/skill/${skill.id}`} className="btn-primary text-[13px] px-4 py-1.5">
            Start →
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeatureCard({ emoji, title, desc, accent }: { emoji: string; title: string; desc: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-[#e8e8ed] bg-[#f9f9fb] p-6 hover:shadow-card transition-shadow">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
        style={{ background: accent + "18" }}
      >
        {emoji}
      </div>
      <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-2">{title}</h3>
      <p className="text-[13px] leading-relaxed text-[#6e6e73]">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <dt className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{value}</dt>
      <dd className="text-[12px] text-[#6e6e73] mt-0.5">{label}</dd>
    </div>
  );
}

function Divider() {
  return <div aria-hidden className="hidden sm:block h-8 w-px bg-[#d2d2d7]" />;
}

/* ─── Static data ──────────────────────────────────────────────────────── */

const FEATURES = [
  {
    emoji: "🔓",
    title: "Truly open",
    desc: "Anyone can publish a Skill. No gatekeeping, no review queue, no vendor lock-in. The platform is neutral.",
    accent: "#0071e3",
  },
  {
    emoji: "⚡",
    title: "Instant run",
    desc: "Click Start, get a live Claude session. No account, no configuration, no waiting. Just the conversation.",
    accent: "#ff9500",
  },
  {
    emoji: "🗂️",
    title: "Organised by category",
    desc: "Eight categories — Writing, Code, Data, Creative, Research, Business, Education, and more. Easy to browse.",
    accent: "#6e40c9",
  },
  {
    emoji: "🧩",
    title: "Bring your own Skill",
    desc: "Write a SKILL.md — plain markdown — and publish it in minutes. Your Skill runs on Claude immediately.",
    accent: "#34c759",
  },
  {
    emoji: "🔒",
    title: "Secure by design",
    desc: "Your Anthropic API key stays server-side. The browser never sees credentials. Inputs validated with Zod.",
    accent: "#ff375f",
  },
  {
    emoji: "🌐",
    title: "Deploy anywhere",
    desc: "Built on Next.js and Supabase. Deploy to Vercel in one click or self-host on any Node.js environment.",
    accent: "#00b4d8",
  },
];

const STEPS = [
  {
    emoji: "🔍",
    title: "Browse",
    desc: "Explore Skills by category or search for a specific task. Every Skill shows what it does before you start.",
  },
  {
    emoji: "▶️",
    title: "Start",
    desc: "Click Start on any Skill and you're instantly in a live Claude-powered chat. No login, no friction.",
  },
  {
    emoji: "🚀",
    title: "Build & Publish",
    desc: "Ready to share your own? Drop a SKILL.md, fill in a description, pick a category, and hit Publish.",
  },
];

const CREATOR_BULLETS = [
  "No coding required — write plain Markdown",
  "Live on the marketplace immediately",
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
