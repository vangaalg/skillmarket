import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { runSkillTurn } from "@/lib/anthropic";
import { checkRateLimit, clientIdFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Body = z.object({
  skill_id: z.string().uuid(),
  message: z.string().min(1).max(8000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40)
    .default([]),
  session_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  // Rate limit before doing any work — the Anthropic call is the
  // expensive part, so we want to reject abusers cheaply.
  const id = clientIdFromRequest(req);
  const rl = await checkRateLimit(id);
  if (!rl.allowed) {
    const seconds = rl.reset ? Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000)) : 60;
    return NextResponse.json(
      {
        error: rl.scope === "daily"
          ? "Daily request limit reached. Try again tomorrow."
          : "Too many requests. Please slow down.",
      },
      { status: 429, headers: { "retry-after": String(seconds) } },
    );
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  const { data: skill, error: skillErr } = await sb
    .from("skills")
    .select("id,name,description,definition,is_published")
    .eq("id", body.skill_id)
    .single();
  if (skillErr || !skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  if (!skill.is_published) return NextResponse.json({ error: "Skill is unpublished" }, { status: 403 });

  let reply: string;
  try {
    reply = await runSkillTurn({
      skill: { name: skill.name, description: skill.description, definition: skill.definition },
      history: body.history,
      userMessage: body.message,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Claude call failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Persist (or extend) the session row. Best-effort — failure here
  // shouldn't block the user from getting the reply.
  let sessionId = body.session_id ?? null;
  try {
    const updatedHistory = [
      ...body.history,
      { role: "user", content: body.message, ts: new Date().toISOString() },
      { role: "assistant", content: reply, ts: new Date().toISOString() },
    ];
    if (sessionId) {
      await sb
        .from("sessions")
        .update({ chat_history: updatedHistory, updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    } else {
      const { data: inserted } = await sb
        .from("sessions")
        .insert({
          skill_id: body.skill_id,
          user_id: body.user_id ?? null,
          chat_history: updatedHistory,
        })
        .select("id")
        .single();
      if (inserted?.id) sessionId = inserted.id;
    }
  } catch {
    // swallow — telemetry only.
  }

  // Increment usage counter for trending/popular ranking. Best-effort.
  try {
    await sb.rpc("increment_skill_usage", { skill_id_param: body.skill_id });
  } catch {
    /* swallow — analytics only */
  }

  return NextResponse.json({ reply, session_id: sessionId });
}
