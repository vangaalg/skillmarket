export type Skill = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string;
  definition: unknown;
  category: string;
  thumbnail_url: string | null;
  price_cents: number;
  version: number;
  is_published: boolean;
  created_at: string;
  // Populated when reading via skills_with_usage view.
  usage_count?: number;
  last_used_at?: string | null;
};

export type Session = {
  id: string;
  skill_id: string;
  user_id: string | null;
  chat_history: { role: "user" | "assistant"; content: string; ts: string }[];
};
