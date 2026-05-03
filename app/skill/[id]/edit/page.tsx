import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { Skill } from "@/lib/types";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

async function loadSkill(id: string): Promise<Skill | null> {
  try {
    const sb = supabaseAdmin();
    const { data } = await sb.from("skills").select("*").eq("id", id).single();
    return (data as Skill) ?? null;
  } catch {
    return null;
  }
}

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const skill = await loadSkill(params.id);
  if (!skill) notFound();

  // Definition can be either a JSON object with { source, content } or a raw string.
  // Normalise to a string the form can render.
  const def = skill.definition as { content?: string } | string | null;
  const definitionStr =
    typeof def === "string"
      ? def
      : def && typeof def === "object" && typeof def.content === "string"
        ? def.content
        : JSON.stringify(skill.definition, null, 2);

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="headline text-ink">Edit skill</h1>
          <p className="mt-2 text-[15px] text-ink-600">
            Update the thumbnail, description, definition, or category. Changes go
            live immediately.
          </p>
          <p className="mt-3 text-[12px] text-ink-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-50 px-2.5 py-0.5 font-medium text-coral-700">
              Phase 1 · open editing
            </span>{" "}
            Anyone can edit any skill while authentication is being wired up.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <EditForm
          id={skill.id}
          initial={{
            name: skill.name,
            description: skill.description,
            category: skill.category,
            thumbnail_url: skill.thumbnail_url ?? null,
            definition: definitionStr,
          }}
        />
      </div>
    </div>
  );
}
