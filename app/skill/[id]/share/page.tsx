import Link from "next/link";

export default function SharePage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="headline text-ink">Share skill</h1>
      <p className="mt-3 text-[15px] text-ink-600">
        Phase 2 will add a polished share view (no auth wall, attribution, OG image).
        For now, the canonical URL is below.
      </p>
      <div className="mt-5 rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] font-mono text-ink">
        <Link href={`/skill/${params.id}`} className="text-coral hover:underline">
          /skill/{params.id}
        </Link>
      </div>
    </div>
  );
}
