import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://skillmarketplace.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Skill Marketplace — Open AI Skills Platform",
    template: "%s — Skill Marketplace",
  },
  description:
    "Discover, run, and publish Claude-powered AI Skills. Free, open, and community-built. No signup required.",
  keywords: ["AI skills", "Claude", "marketplace", "open platform", "prompt", "AI tools"],
  authors: [{ name: "Skill Marketplace" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Skill Marketplace",
    title: "Skill Marketplace — Open AI Skills Platform",
    description:
      "Discover, run, and publish Claude-powered AI Skills. Free, open, no signup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Marketplace — Open AI Skills Platform",
    description: "Discover and run Claude-powered AI Skills. Free, open, no signup.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased">

        {/* ── Sticky frosted-glass nav ── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] btn-primary"
        >
          Skip to content
        </a>

        <header className="nav-glass sticky top-0 z-50" role="banner">
          <nav
            className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3"
            aria-label="Primary navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#1d1d1f]"
              aria-label="Skill Marketplace home"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0071e3] text-white text-xs font-bold select-none"
                aria-hidden
              >
                S
              </span>
              <span>Skill Marketplace</span>
            </Link>

            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-7 text-[14px] text-[#1d1d1f] font-medium">
              <Link href="/browse" className="hover:text-[#0071e3] transition-colors">
                Browse
              </Link>
              <Link href="/upload" className="hover:text-[#0071e3] transition-colors">
                Upload
              </Link>
              <Link href="/develop" className="hover:text-[#0071e3] transition-colors">
                Develop
              </Link>
              <Link href="/team" className="hover:text-[#0071e3] transition-colors">
                Teams
              </Link>
            </div>

            {/* CTA */}
            <Link href="/upload" className="btn-primary text-[14px] hidden sm:inline-flex">
              + New Skill
            </Link>

            {/* Mobile hamburger placeholder — Phase 3 */}
            <button
              className="sm:hidden flex flex-col gap-1.5 p-2"
              aria-label="Open menu"
            >
              <span className="block h-px w-5 bg-[#1d1d1f]" />
              <span className="block h-px w-5 bg-[#1d1d1f]" />
              <span className="block h-px w-5 bg-[#1d1d1f]" />
            </button>
          </nav>
        </header>

        <main id="main-content">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-[#d2d2d7] bg-[#f9f9fb]" role="contentinfo">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid gap-8 sm:grid-cols-3 mb-10">
              {/* Brand */}
              <div>
                <Link href="/" className="flex items-center gap-2 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0071e3] text-white text-[10px] font-bold">
                    S
                  </span>
                  <span className="text-[14px] font-semibold text-[#1d1d1f]">Skill Marketplace</span>
                </Link>
                <p className="text-[13px] leading-relaxed text-[#6e6e73]">
                  Open marketplace for Claude-powered AI Skills. Free to use, free to publish.
                </p>
              </div>

              {/* Platform */}
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-widest text-[#86868b] mb-3">
                  Platform
                </div>
                <ul className="space-y-2 text-[13px]">
                  <li><Link href="/browse" className="text-[#6e6e73] hover:text-[#0071e3] transition-colors">Browse Skills</Link></li>
                  <li><Link href="/upload" className="text-[#6e6e73] hover:text-[#0071e3] transition-colors">Upload a Skill</Link></li>
                  <li><Link href="/develop" className="text-[#6e6e73] hover:text-[#0071e3] transition-colors">Develop with AI</Link></li>
                  <li><Link href="/team" className="text-[#6e6e73] hover:text-[#0071e3] transition-colors">Teams (Phase 5)</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-widest text-[#86868b] mb-3">
                  Categories
                </div>
                <ul className="space-y-2 text-[13px]">
                  {["Writing", "Code & Dev", "Data & Analysis", "Creative", "Research"].map((c) => (
                    <li key={c}>
                      <Link
                        href={`/browse#${c.toLowerCase().replace(/ & .+/, "").replace(" ", "-")}`}
                        className="text-[#6e6e73] hover:text-[#0071e3] transition-colors"
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#e8e8ed] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#86868b]">
              <p>© {new Date().getFullYear()} Skill Marketplace. Open platform for AI Skills.</p>
              <p className="flex items-center gap-1">
                Powered by
                <span className="font-medium text-[#1d1d1f] ml-1">Claude</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
