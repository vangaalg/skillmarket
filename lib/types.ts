export type Skill = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string;
  definition: unknown;
  category: string;
  price_cents: number;
  version: number;
  is_published: boolean;
  created_at: string;
};

export type Session = {
  id: string;
  skill_id: string;
  user_id: string | null;
  chat_history: { role: "user" | "assistant"; content: string; ts: string }[];
};
