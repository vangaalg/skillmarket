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
    <div>
      <h1 className="text-2xl font-semibold text-white">Creator Profile</h1>
      <p className="mt-1 text-white/70">
        Profile page (Phase 3) — ratings, reviews, and an analytics dashboard
        will live here.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {skills.map((s) => (
          <li key={s.id} className="rounded-lg border border-white/10 bg-panel p-4">
            <Link href={`/skill/${s.id}`} className="text-white">{s.name}</Link>
            <p className="mt-1 text-sm text-white/60 line-clamp-2">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
