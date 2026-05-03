import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function anthropic() {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  client = new Anthropic({ apiKey });
  return client;
}

export const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export type ChatMessage = { role: "user" | "assistant"; content: string };

// A Skill's `definition` is a free-form JSON document. We stringify
// the relevant sections into the system prompt so Claude follows the
// creator's instructions while answering the end user.
export function systemPromptForSkill(skill: {
  name: string;
  description: string;
  definition: unknown;
}) {
  const def =
    typeof skill.definition === "string"
      ? skill.definition
      : JSON.stringify(skill.definition, null, 2);
  return [
    `You are operating as the Skill "${skill.name}".`,
    `Description: ${skill.description}`,
    `Skill definition (authored by the creator):`,
    "```",
    def,
    "```",
    "Follow the definition above. If the user asks for something outside the Skill's scope, politely redirect.",
  ].join("\n");
}

export async function runSkillTurn(opts: {
  skill: { name: string; description: string; definition: unknown };
  history: ChatMessage[];
  userMessage: string;
}) {
  const sys = systemPromptForSkill(opts.skill);
  const msg = await anthropic().messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    system: sys,
    messages: [
      ...opts.history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: opts.userMessage },
    ],
  });
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}
