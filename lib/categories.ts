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

export const CATEGORIES: {
  key: CategoryKey;
  label: string;
  emoji: string;
  color: string;       // Tailwind bg class for icon circle
  textColor: string;   // Tailwind text class
  lightBg: string;     // Tailwind bg class for pill active state
  hex: string;         // For inline CSS where needed
}[] = [
  {
    key: "all",
    label: "All Skills",
    emoji: "✦",
    color: "bg-[#1d1d1f]",
    textColor: "text-[#1d1d1f]",
    lightBg: "bg-[#1d1d1f]",
    hex: "#1d1d1f",
  },
  {
    key: "writing",
    label: "Writing",
    emoji: "✍️",
    color: "bg-[#0071e3]",
    textColor: "text-[#0071e3]",
    lightBg: "bg-[#e8f1ff]",
    hex: "#0071e3",
  },
  {
    key: "code",
    label: "Code & Dev",
    emoji: "💻",
    color: "bg-[#6e40c9]",
    textColor: "text-[#6e40c9]",
    lightBg: "bg-[#f0ebff]",
    hex: "#6e40c9",
  },
  {
    key: "data",
    label: "Data & Analysis",
    emoji: "📊",
    color: "bg-[#00b4d8]",
    textColor: "text-[#00b4d8]",
    lightBg: "bg-[#e6f8fc]",
    hex: "#00b4d8",
  },
  {
    key: "creative",
    label: "Creative",
    emoji: "🎨",
    color: "bg-[#ff375f]",
    textColor: "text-[#ff375f]",
    lightBg: "bg-[#ffebef]",
    hex: "#ff375f",
  },
  {
    key: "research",
    label: "Research",
    emoji: "🔬",
    color: "bg-[#ff9500]",
    textColor: "text-[#ff9500]",
    lightBg: "bg-[#fff5e6]",
    hex: "#ff9500",
  },
  {
    key: "business",
    label: "Business",
    emoji: "💼",
    color: "bg-[#34c759]",
    textColor: "text-[#1a8c36]",
    lightBg: "bg-[#e9f9ee]",
    hex: "#34c759",
  },
  {
    key: "education",
    label: "Education",
    emoji: "📚",
    color: "bg-[#ffcc00]",
    textColor: "text-[#8a6c00]",
    lightBg: "bg-[#fffbe6]",
    hex: "#ffcc00",
  },
  {
    key: "other",
    label: "Other",
    emoji: "⚡",
    color: "bg-[#86868b]",
    textColor: "text-[#86868b]",
    lightBg: "bg-[#f0f0f2]",
    hex: "#86868b",
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
