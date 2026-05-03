// Hand-rolled icon set — zero dependencies, full control over weight & sizing.
// All icons use `currentColor` so they inherit the surrounding text color.
// Default size 18px, stroke-width 1.75 for a refined Claude/Apple feel.

import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

function Base({
  size = 18,
  strokeWidth = 1.75,
  children,
  ...props
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconSparkles = (p: Props) => (
  <Base {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </Base>
);

export const IconShield = (p: Props) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const IconSearch = (p: Props) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);

export const IconPlay = (p: Props) => (
  <Base {...p}>
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </Base>
);

export const IconRocket = (p: Props) => (
  <Base {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Base>
);

export const IconUpload = (p: Props) => (
  <Base {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5" />
    <path d="M12 3v12" />
  </Base>
);

export const IconSend = (p: Props) => (
  <Base {...p}>
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
    <path d="M22 2 11 13" />
  </Base>
);

export const IconLock = (p: Props) => (
  <Base {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Base>
);

export const IconGlobe = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Base>
);

export const IconZap = (p: Props) => (
  <Base {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </Base>
);

export const IconLayers = (p: Props) => (
  <Base {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </Base>
);

export const IconUnlock = (p: Props) => (
  <Base {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Base>
);

export const IconCheck = (p: Props) => (
  <Base {...p}>
    <path d="m5 12 5 5L20 7" />
  </Base>
);

export const IconArrowRight = (p: Props) => (
  <Base {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Base>
);

export const IconPlus = (p: Props) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconChevronDown = (p: Props) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const IconMessage = (p: Props) => (
  <Base {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Base>
);

export const IconUsers = (p: Props) => (
  <Base {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Base>
);

export const IconExternalLink = (p: Props) => (
  <Base {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </Base>
);

export const IconMenu = (p: Props) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
);

export const IconClose = (p: Props) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);

export const IconFile = (p: Props) => (
  <Base {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Base>
);

export const IconFolderUp = (p: Props) => (
  <Base {...p}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M12 10v6M9 13l3-3 3 3" />
  </Base>
);

export const IconCircleDot = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </Base>
);
