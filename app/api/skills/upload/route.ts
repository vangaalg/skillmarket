import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "writing","code","data","creative","research","business","education","other",
] as const;

const Body = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  definition: z.union([z.string().min(1), z.record(z.unknown())]),
  category: z.enum(VALID_CATEGORIES).default("other"),
  owner_id: z.string().uuid().optional(),
  // PHASE 2: price_cents accepted but ignored on free tier today.
  price_cents: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const definition =
    typeof body.definition === "string" ? { source: "skill.md", content: body.definition } : body.definition;

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("skills")
    .insert({
      owner_id: body.owner_id ?? null,
      name: body.name,
      description: body.description,
      definition,
      category: body.category,
      price_cents: body.price_cents ?? 0,
      is_published: true,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
