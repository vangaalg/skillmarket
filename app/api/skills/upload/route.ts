import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, clientIdFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "writing","code","data","creative","research","business","education","other",
] as const;

// Definitions get included in every chat turn's system prompt, so a
// large definition multiplies token cost across every conversation.
// 50_000 chars (~12.5k tokens) is generous but bounded.
const MAX_DEFINITION_CHARS = 50_000;

const Body = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  definition: z.union([
    z.string().min(1).max(MAX_DEFINITION_CHARS),
    z.record(z.unknown()).refine(
      (obj) => JSON.stringify(obj).length <= MAX_DEFINITION_CHARS,
      { message: `Definition must be under ${MAX_DEFINITION_CHARS} characters` },
    ),
  ]),
  category: z.enum(VALID_CATEGORIES).default("other"),
  owner_id: z.string().uuid().optional(),
  // PHASE 2: price_cents accepted but ignored on free tier today.
  price_cents: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const rl = await checkRateLimit(clientIdFromRequest(req));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a moment." },
      { status: 429 },
    );
  }

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
