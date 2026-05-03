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
      },
      colors: {
        apple: {
          bg: "#f5f5f7",
          card: "#ffffff",
          text: "#1d1d1f",
          secondary: "#6e6e73",
          border: "#d2d2d7",
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          "blue-light": "#e8f1ff",
        },
        cat: {
          writing: "#0071e3",
          code: "#6e40c9",
          data: "#00b4d8",
          creative: "#ff375f",
          research: "#ff9500",
          business: "#34c759",
          education: "#ffcc00",
          other: "#86868b",
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 28px rgba(0,0,0,0.14)",
        nav: "0 1px 0 rgba(0,0,0,0.08)",
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
