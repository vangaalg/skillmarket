import { IconSparkles } from "@/components/icons";

export default function DevelopPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-widest text-coral-600">
        <IconSparkles size={11} strokeWidth={2} />
        Phase 4 · Coming soon
      </div>
      <h1 className="headline text-ink mt-2">Develop a skill with AI</h1>
      <p className="mt-3 text-[15px] text-ink-600">
        Describe what you want and Claude will draft a SKILL.md for you. The API endpoint is at{" "}
        <code className="bg-cream-200 px-1.5 py-0.5 rounded text-[13px]">/api/develop</code> and is wired to return 501 until implemented.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-[14px] text-ink-600">
        Placeholder. The form here will POST to <code className="bg-cream-200 px-1 rounded">/api/develop</code>,
        which will call Claude to generate a skill definition and forward it to{" "}
        <code className="bg-cream-200 px-1 rounded">/api/skills/upload</code> so versioning kicks in.
      </div>
    </div>
  );
}
