import { NextResponse } from "next/server";

// PHASE 4 — Generate a SKILL.md from a natural-language brief.
// Plan:
//   1. Body: { brief: string, name?: string }.
//   2. Call Claude with a meta-system prompt that asks for a
//      structured SKILL.md (frontmatter + behavior sections).
//   3. POST the result through to /api/skills/upload so the
//      generated Skill is saved with version: 1.
//   4. Return { id, definition }.
export async function POST() {
  return NextResponse.json(
    { error: "Not implemented", phase: 4 },
    { status: 501 },
  );
}
