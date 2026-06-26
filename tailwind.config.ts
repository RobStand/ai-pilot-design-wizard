import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0d1117",
          soft: "#1f2733",
          muted: "#5b6675",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f6f7f9",
          line: "#e6e9ee",
        },
        accent: {
          DEFAULT: "#3551c9",
          soft: "#eff1fb",
          ink: "#243a96",
        },
        success: "#1f9d57",
        warning: "#c08a1e",
        error: "#d23b2c",
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,17,23,0.04), 0 8px 24px rgba(13,17,23,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
