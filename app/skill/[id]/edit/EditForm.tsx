"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { IconArrowRight } from "@/components/icons";
import ThumbnailUpload from "@/components/ThumbnailUpload";

const SKILL_CATEGORIES = CATEGORIES.filter((c) => c.key !== "all");
const MAX_DEFINITION_CHARS = 50_000;

type Initial = {
  name: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  definition: string;
};

export default function EditForm({ id, initial }: { id: string; initial: Initial }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [category, setCategory] = useState(initial.category);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial.thumbnail_url);
  const [definition, setDefinition] = useState(initial.definition);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const overLimit = definition.length > MAX_DEFINITION_CHARS;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !description.trim()) {
      setErr("Name and description are required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          thumbnail_url: thumbnailUrl,
          definition,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      router.push(`/skill/${id}`);
      router.refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-ink-200 bg-white p-6 space-y-6">
      <ThumbnailUpload value={thumbnailUrl} onChange={setThumbnailUrl} />

      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">
          Skill name <span className="text-coral">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-cream-200 px-4 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-ink mb-2">
          Category <span className="text-coral">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((cat) => {
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className="cat-pill border text-[13px] transition-all"
                style={{
                  background: isActive ? cat.hex : "#ffffff",
                  color: isActive ? "#ffffff" : "#1F1E1D",
                  border: `1.5px solid ${isActive ? cat.hex : "#E1DFD7"}`,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">
          Description <span className="text-coral">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-ink-200 bg-cream-200 px-4 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[13px] font-medium text-ink">SKILL.md / Definition</label>
          <span className={`text-[11px] ${overLimit ? "text-red-600 font-medium" : "text-ink-500"}`}>
            {definition.length.toLocaleString()} / {MAX_DEFINITION_CHARS.toLocaleString()} chars
          </span>
        </div>
        <textarea
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-ink-200 bg-cream-200 px-4 py-3 font-mono text-[13px] text-ink outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition resize-y"
        />
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {err}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-ink-100">
        <button
          type="button"
          onClick={() => router.push(`/skill/${id}`)}
          className="btn-ghost text-[14px] mt-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || overLimit}
          className="btn-primary px-6 py-2.5 text-[15px] disabled:opacity-50 mt-4"
        >
          {busy ? "Saving…" : "Save changes"}
          {!busy && <IconArrowRight size={14} strokeWidth={2.25} />}
        </button>
      </div>
    </form>
  );
}
