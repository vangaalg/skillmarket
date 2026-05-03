export default function DevelopPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Develop a Skill (Phase 4)</h1>
      <p className="mt-2 text-white/70">
        Describe what you want and Claude will draft a SKILL.md for you. Coming in
        Phase 4 — the API endpoint is at <code>/api/develop</code> and is wired to
        return a 501 until implemented.
      </p>
      <div className="mt-6 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/60">
        Placeholder. The form here will POST to <code>/api/develop</code>, which
        will call Claude to generate a SKILL definition and forward it to{" "}
        <code>/api/skills/upload</code> so versioning kicks in.
      </div>
    </div>
  );
}
