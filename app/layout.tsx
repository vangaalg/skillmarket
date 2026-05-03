import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import Logo from "@/components/Logo";
import { IconPlus, IconMenu } from "@/components/icons";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://skillorbit.ai";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF9F5",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Skillorbit.ai — The open platform for agents and skills",
    template: "%s — Skillorbit.ai",
  },
  description:
    "Discover, run, and publish AI agents and skills. Free, open, and community-built. Powered by Claude.",
  keywords: [
    "AI skills",
    "AI agents",
    "Claude",
    "open platform",
    "marketplace",
    "Anthropic",
    "skillorbit",
  ],
  authors: [{ name: "Skillorbit.ai" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Skillorbit.ai",
    title: "Skillorbit.ai — The open platform for agents and skills",
    description:
      "Discover, run, and publish AI agents and skills. Free, open, no signup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skillorbit.ai — The open platform for agents and skills",
    description: "Discover and run AI agents and skills. Free, open, no signup.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-cream text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] btn-primary"
        >
          Skip to content
        </a>

        {/* ── Sticky frosted-glass nav ── */}
        <header className="nav-glass sticky top-0 z-50" role="banner">
          <nav
            className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3"
            aria-label="Primary"
          >
            <Link href="/" aria-label="Skillorbit home">
              <Logo size={28} />
            </Link>

            <div className="hidden md:flex items-center gap-7 text-[14px] text-ink-700 font-medium">
              <Link href="/browse" className="hover:text-coral transition-colors">Browse</Link>
              <Link href="/upload" className="hover:text-coral transition-colors">Upload</Link>
              <Link href="/develop" className="hover:text-coral transition-colors">Develop</Link>
              <Link href="/team" className="hover:text-coral transition-colors">Teams</Link>
            </div>

            <Link href="/upload" className="btn-primary text-[14px] hidden md:inline-flex">
              <IconPlus size={14} strokeWidth={2.25} />
              <span>New Skill</span>
            </Link>

            <button
              className="md:hidden p-2 -mr-2 text-ink"
              aria-label="Open menu"
            >
              <IconMenu size={22} />
            </button>
          </nav>
        </header>

        <main id="main-content">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-ink-200 bg-cream-200" role="contentinfo">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid gap-8 sm:grid-cols-4 mb-10">
              <div className="sm:col-span-2">
                <Logo size={26} />
                <p className="mt-4 text-[13px] leading-relaxed text-ink-600 max-w-sm">
                  The open platform for AI agents and skills. Free to use, free to publish.
                  Powered by Claude.
                </p>
              </div>

              <div>
                <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-3">
                  Platform
                </div>
                <ul className="space-y-2 text-[13px]">
                  <li><Link href="/browse" className="text-ink-600 hover:text-coral transition-colors">Browse</Link></li>
                  <li><Link href="/upload" className="text-ink-600 hover:text-coral transition-colors">Upload</Link></li>
                  <li><Link href="/develop" className="text-ink-600 hover:text-coral transition-colors">Develop</Link></li>
                  <li><Link href="/team" className="text-ink-600 hover:text-coral transition-colors">Teams</Link></li>
                </ul>
              </div>

              <div>
                <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-3">
                  Categories
                </div>
                <ul className="space-y-2 text-[13px]">
                  {[
                    ["Writing", "writing"],
                    ["Code & Dev", "code"],
                    ["Data", "data"],
                    ["Creative", "creative"],
                    ["Research", "research"],
                  ].map(([label, key]) => (
                    <li key={key}>
                      <Link
                        href={`/browse#${key}`}
                        className="text-ink-600 hover:text-coral transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-ink-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-500">
              <p>© {new Date().getFullYear()} Skillorbit.ai · Open platform for agents and skills.</p>
              <p className="flex items-center gap-1">
                Powered by
                <span className="font-medium text-ink ml-1">Claude</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
