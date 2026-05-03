import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, clientIdFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "writing","code","data","creative","research","business","education","other",
] as const;

const MAX_DEFINITION_CHARS = 50_000;

// Partial update — every field is optional. Whatever's missing
// from the body is left untouched in the DB.
const PatchBody = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(2000).optional(),
  definition: z
    .union([
      z.string().min(1).max(MAX_DEFINITION_CHARS),
      z.record(z.unknown()).refine(
        (obj) => JSON.stringify(obj).length <= MAX_DEFINITION_CHARS,
        { message: `Definition must be under ${MAX_DEFINITION_CHARS} characters` },
      ),
    ])
    .optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  thumbnail_url: z.string().url().max(500).nullable().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("skills")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ skill: data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const rl = await checkRateLimit(clientIdFromRequest(req));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  let body: z.infer<typeof PatchBody>;
  try {
    body = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.category !== undefined) update.category = body.category;
  if (body.thumbnail_url !== undefined) update.thumbnail_url = body.thumbnail_url;
  if (body.definition !== undefined) {
    update.definition =
      typeof body.definition === "string"
        ? { source: "skill.md", content: body.definition }
        : body.definition;
  }

  if (Object.keys(update).length === 1) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("skills")
    .update(update)
    .eq("id", params.id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.code === "PGRST116" ? "Skill not found" : "Update failed" },
      { status: error.code === "PGRST116" ? 404 : 500 },
    );
  }
  return NextResponse.json({ id: data.id });
}
