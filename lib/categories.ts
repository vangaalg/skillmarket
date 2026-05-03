export type CategoryKey =
  | "all"
  | "writing"
  | "code"
  | "data"
  | "creative"
  | "research"
  | "business"
  | "education"
  | "other";

// Category palette tuned for the Skillorbit / Claude warm theme.
// `lightBg` is the soft tint behind icons + pills.
// `hex` is the strong colour for accents and active states.

export const CATEGORIES: {
  key: CategoryKey;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  lightBg: string;
  hex: string;
}[] = [
  {
    key: "all",
    label: "All Skills",
    emoji: "✦",
    color: "bg-ink",
    textColor: "text-ink",
    lightBg: "bg-ink",
    hex: "#1F1E1D",
  },
  {
    key: "writing",
    label: "Writing",
    emoji: "✍️",
    color: "bg-[#5B7FFF]",
    textColor: "text-[#5B7FFF]",
    lightBg: "bg-[#EEF1FF]",
    hex: "#5B7FFF",
  },
  {
    key: "code",
    label: "Code & Dev",
    emoji: "💻",
    color: "bg-[#8B5CF6]",
    textColor: "text-[#8B5CF6]",
    lightBg: "bg-[#F3EEFF]",
    hex: "#8B5CF6",
  },
  {
    key: "data",
    label: "Data & Analysis",
    emoji: "📊",
    color: "bg-[#0EA5B7]",
    textColor: "text-[#0EA5B7]",
    lightBg: "bg-[#E5F7F9]",
    hex: "#0EA5B7",
  },
  {
    key: "creative",
    label: "Creative",
    emoji: "🎨",
    color: "bg-[#E94B6F]",
    textColor: "text-[#E94B6F]",
    lightBg: "bg-[#FCEAEF]",
    hex: "#E94B6F",
  },
  {
    key: "research",
    label: "Research",
    emoji: "🔬",
    color: "bg-[#F59E0B]",
    textColor: "text-[#A66A05]",
    lightBg: "bg-[#FEF4E2]",
    hex: "#F59E0B",
  },
  {
    key: "business",
    label: "Business",
    emoji: "💼",
    color: "bg-[#10B981]",
    textColor: "text-[#0F8B61]",
    lightBg: "bg-[#E5F8F1]",
    hex: "#10B981",
  },
  {
    key: "education",
    label: "Education",
    emoji: "📚",
    color: "bg-[#EAB308]",
    textColor: "text-[#8C6800]",
    lightBg: "bg-[#FBF6DA]",
    hex: "#EAB308",
  },
  {
    key: "other",
    label: "Other",
    emoji: "⚡",
    color: "bg-[#7E7E7B]",
    textColor: "text-[#7E7E7B]",
    lightBg: "bg-[#F1EFE9]",
    hex: "#7E7E7B",
  },
];

export function getCategoryMeta(key: string | null | undefined) {
  return (
    CATEGORIES.find((c) => c.key === key) ??
    CATEGORIES.find((c) => c.key === "other")!
  );
}

export const CATEGORY_KEYS = CATEGORIES.filter((c) => c.key !== "all").map(
  (c) => c.key,
);
