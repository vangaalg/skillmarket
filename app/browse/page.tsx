import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import type { Skill } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Browse Skills",
  description:
    "Explore AI skills across Writing, Code, Data, Creative, Research, Business, Education and more on Skillorbit.ai.",
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
  const categoryCount = new Set(skills.map((s) => s.category)).size;

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">
            Browse skills
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-600">
            {skills.length} {skills.length === 1 ? "skill" : "skills"} across {categoryCount}{" "}
            {categoryCount === 1 ? "category" : "categories"}. Free to run.
          </p>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-5 pb-1">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={cat.key === "all" ? "#top" : `#${cat.key}`}
                className="cat-pill flex-shrink-0 border border-ink-200 bg-cream-200 text-ink text-[13px] hover:bg-coral hover:text-white hover:border-coral transition-colors"
              >
                {cat.emoji} {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <CategoryFilter skills={skills} />
      </div>
    </div>
  );
}
