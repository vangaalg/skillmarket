import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Browse Skills — Skill Marketplace",
  description: "Explore all AI Skills across Writing, Code, Data, Creative, Research, Business, Education and more.",
};

async function loadSkills(): Promise<Skill[]> {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("skills")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Skill[];
  } catch {
    return [];
  }
}

export default async function BrowsePage() {
  const skills = await loadSkills();

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-[#d2d2d7]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
            Browse Skills
          </h1>
          <p className="mt-1.5 text-[15px] text-[#6e6e73]">
            {skills.length} Skills across {new Set(skills.map((s) => s.category)).size} categories. Free to run.
          </p>

          {/* Category quick-scroll strip */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-5 pb-1">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={cat.key === "all" ? "#top" : `#${cat.key}`}
                className="cat-pill flex-shrink-0 border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-[13px] hover:bg-[#0071e3] hover:text-white hover:border-[#0071e3] transition-colors"
              >
                {cat.emoji} {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <CategoryFilter skills={skills} />
      </div>
    </div>
  );
}
