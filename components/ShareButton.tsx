"use client";

import { useState } from "react";
import { IconCheck, IconExternalLink } from "@/components/icons";

type Props = {
  url: string;          // Full absolute URL to share
  title?: string;
  text?: string;
  className?: string;
  label?: string;       // Button label
};

// Tries the native Web Share API first (mobile / iOS share sheet),
// falls back to copying the URL to the clipboard with a toast.
export default function ShareButton({ url, title, text, className, label = "Share" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title, text });
        return;
      } catch {
        // User cancelled — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Last-ditch fallback: prompt the user.
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ?? "btn-primary text-[13px] px-4 py-2"}
      aria-label="Share this skill"
    >
      {copied ? (
        <>
          <IconCheck size={14} strokeWidth={2.25} />
          Link copied
        </>
      ) : (
        <>
          <IconExternalLink size={13} />
          {label}
        </>
      )}
    </button>
  );
}
