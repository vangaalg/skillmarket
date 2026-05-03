// PHASE 2 — public share page for a Skill.
// Today this is just a placeholder that points back to the Skill page.
import Link from "next/link";

export default function SharePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-white">Share Skill</h1>
      <p className="mt-2 text-white/70">
        Phase 2 will add a polished public-share view (no auth wall, attribution,
        OG image). For now, the canonical URL is below.
      </p>
      <div className="mt-4 rounded-md bg-white/5 px-3 py-2 text-sm">
        <Link href={`/skill/${params.id}`}>/skill/{params.id}</Link>
      </div>
    </div>
  );
}
