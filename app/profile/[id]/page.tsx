// PHASE 3 — creator profile + analytics. Stub.
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  let skills: { id: string; name: string; description: string }[] = [];
  try {
    const sb = supabaseAdmin();
    const { data } = await sb
      .from("skills")
      .select("id,name,description")
      .eq("owner_id", params.id)
      .eq("is_published", true);
    skills = data ?? [];
  } catch {
    /* no-op */
  }
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="headline text-ink">Creator profile</h1>
      <p className="mt-2 text-[15px] text-ink-600">
        Profile page (Phase 3) — ratings, reviews, and an analytics dashboard will live here.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {skills.map((s) => (
          <li key={s.id} className="rounded-2xl border border-ink-200 bg-white p-4 hover:shadow-card transition-shadow">
            <Link href={`/skill/${s.id}`} className="text-[15px] font-medium text-ink hover:text-coral transition-colors">
              {s.name}
            </Link>
            <p className="mt-1 text-[13px] text-ink-600 line-clamp-2">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
