"use client";

import { useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { IconClose, IconFolderUp } from "@/components/icons";

const MAX_BYTES = 1_000_000;          // 1 MB
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function ThumbnailUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setErr("Use JPG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr(`Image must be under ${(MAX_BYTES / 1_000_000).toFixed(0)} MB.`);
      return;
    }
    setBusy(true);
    try {
      const sb = supabaseBrowser();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await sb.storage
        .from("thumbnails")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = sb.storage.from("thumbnails").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setErr(
        msg.includes("not found") || msg.includes("Bucket")
          ? "Storage bucket isn't set up yet. Run supabase/add_thumbnails_and_usage.sql in your Supabase SQL editor."
          : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="block text-[13px] font-medium text-ink mb-2">
        Thumbnail <span className="text-ink-500 font-normal">(optional)</span>
      </label>

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Thumbnail preview"
            className="h-40 w-72 object-cover rounded-xl border border-ink-200"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white shadow-card hover:bg-ink-700 transition-colors"
            aria-label="Remove thumbnail"
          >
            <IconClose size={14} strokeWidth={2.25} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-cream-200 px-6 py-8 hover:border-coral hover:bg-coral-50 transition-colors cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral-50 text-coral">
            <IconFolderUp size={18} />
          </span>
          <div className="text-[13px] font-medium text-ink">
            {busy ? "Uploading…" : "Click or drop an image"}
          </div>
          <div className="text-[11px] text-ink-500">JPG, PNG, WebP · up to 1 MB</div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {err && (
        <p className="mt-2 text-[12px] text-red-600">{err}</p>
      )}
    </div>
  );
}
