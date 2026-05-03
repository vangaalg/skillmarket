"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const SKILL_CATEGORIES = CATEGORIES.filter((c) => c.key !== "all");

export default function UploadPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [definition, setDefinition] = useState(
    "# SKILL.md\n\nDescribe how this Skill should behave...\n",
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedCat = SKILL_CATEGORIES.find((c) => c.key === category)!;

  async function onFile(file: File) {
    setErr(null);
    setInfo(null);
    if (file.name.toLowerCase().endsWith(".zip")) {
      setErr("ZIP bundles aren't supported yet. Unzip locally and upload the SKILL.md.");
      return;
    }
    const text = await file.text();
    if (file.name.toLowerCase().endsWith(".json")) {
      try {
        const parsed = JSON.parse(text);
        setDefinition(JSON.stringify(parsed, null, 2));
        if (!name && typeof parsed.name === "string") setName(parsed.name);
        if (!description && typeof parsed.description === "string") setDescription(parsed.description);
        if (parsed.category) setCategory(parsed.category);
        setInfo(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`);
        return;
      } catch {
        setErr("Not valid JSON — loaded as plain text.");
      }
    }
    setDefinition(text);
    const fm = text.match(/^---\s*([\s\S]*?)\s*---/);
    if (fm) {
      const block = fm[1];
      const nm = block.match(/^name:\s*(.+)$/m);
      const ds = block.match(/^description:\s*(.+)$/m);
      const ct = block.match(/^category:\s*(.+)$/m);
      if (!name && nm) setName(nm[1].trim().replace(/^['"]|['"]$/g, ""));
      if (!description && ds) setDescription(ds[1].trim().replace(/^['"]|['"]$/g, ""));
      if (ct) setCategory(ct[1].trim().replace(/^['"]|['"]$/g, ""));
    } else {
      const heading = text.match(/^#\s+(.+)$/m);
      if (!name && heading) setName(heading[1].trim());
    }
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
    setInfo(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !description.trim()) {
      setErr("Name and description are required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/skills/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description, category, definition }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      router.push(`/skill/${data.id}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-[#d2d2d7]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="headline text-[#1d1d1f]">Upload a Skill</h1>
          <p className="mt-2 text-[15px] text-[#6e6e73]">
            Publish your Claude-powered Skill to the open marketplace. Free. Instant.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* File drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          className="rounded-2xl border-2 border-dashed border-[#d2d2d7] bg-white px-8 py-10 text-center hover:border-[#0071e3] hover:bg-[#f9fbff] transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-4xl mb-3">📂</div>
          <div className="text-[15px] font-medium text-[#1d1d1f]">
            Drag & drop your SKILL file here
          </div>
          <div className="text-[13px] text-[#6e6e73] mt-1">
            Supports <code>.md</code>, <code>.txt</code>, <code>.json</code>
          </div>
          <div className="mt-4 inline-block btn-ghost cursor-pointer">
            Choose file from laptop
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".md,.markdown,.txt,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          {info && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e9f9ee] px-3 py-1 text-[12px] font-medium text-[#1a8c36]">
              ✓ {info}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-6 rounded-2xl border border-[#d2d2d7] bg-white p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Skill Name <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#d2d2d7] bg-[#f9f9fb] px-4 py-2.5 text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition"
              placeholder="e.g. Resume Reviewer, SQL Assistant…"
            />
          </div>

          {/* Category picker */}
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
              Category <span className="text-red-400">*</span>
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
                      color: isActive ? "#ffffff" : "#1d1d1f",
                      border: `1.5px solid ${isActive ? cat.hex : "#d2d2d7"}`,
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#d2d2d7] bg-[#f9f9fb] px-4 py-2.5 text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition resize-none"
              placeholder="One paragraph on what this Skill does and who it helps."
            />
          </div>

          {/* Definition */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#1d1d1f]">
                SKILL.md / Definition
              </label>
              <span className="text-[11px] text-[#86868b]">
                {definition.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-[#d2d2d7] bg-[#f9f9fb] px-4 py-3 font-mono text-[13px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition resize-y"
            />
          </div>

          {/* Error */}
          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {err}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg text-sm"
                style={{ background: selectedCat.lightBg }}
              >
                {selectedCat.emoji}
              </span>
              <span className="text-[13px] text-[#6e6e73]">
                {selectedCat.label} · Free
              </span>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary px-6 py-2.5 text-[15px] disabled:opacity-50"
            >
              {busy ? "Publishing…" : "Publish Skill →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
