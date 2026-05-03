import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ['"Source Serif Pro"', '"Charter"', "Georgia", "serif"],
      },
      colors: {
        // Skillorbit / Claude-inspired palette
        cream: {
          DEFAULT: "#FAF9F5",   // page background
          50: "#FFFFFF",
          100: "#FAF9F5",
          200: "#F5F4ED",
          300: "#EBE9DD",
          400: "#D9D6C5",
        },
        coral: {
          DEFAULT: "#D97757",   // primary brand
          50: "#FDF4F0",
          100: "#FAE7DD",
          200: "#F5CFB8",
          300: "#EAA88B",
          400: "#E08866",
          500: "#D97757",
          600: "#C5644A",
          700: "#A4513C",
          800: "#7E3F2F",
        },
        ink: {
          DEFAULT: "#1F1E1D",
          900: "#141413",
          800: "#1F1E1D",
          700: "#3D3D3A",
          600: "#5A5A56",
          500: "#7E7E7B",
          400: "#A3A39E",
          300: "#C7C7C2",
          200: "#E1DFD7",
          100: "#EBE9DD",
        },
        cat: {
          writing: "#5B7FFF",
          code: "#8B5CF6",
          data: "#0EA5B7",
          creative: "#E94B6F",
          research: "#F59E0B",
          business: "#10B981",
          education: "#EAB308",
          other: "#7E7E7B",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(31, 30, 29, 0.04), 0 4px 16px rgba(31, 30, 29, 0.06)",
        "card-hover": "0 2px 6px rgba(31, 30, 29, 0.06), 0 12px 32px rgba(31, 30, 29, 0.10)",
        nav: "0 1px 0 rgba(31, 30, 29, 0.06)",
        coral: "0 4px 14px rgba(217, 119, 87, 0.25)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
    },
  },
  plugins: [],
};
export default config;
