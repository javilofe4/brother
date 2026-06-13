import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        app:     "var(--bg-app)",
        surface: "var(--bg-surface)",
        elevated:"var(--bg-elevated)",
        border:  "var(--bg-border)",
        primary: "var(--text-primary)",
        secondary:"var(--text-secondary)",
        muted:   "var(--text-muted)",
        accent:  "var(--accent)",
        gold:    "var(--gold)",
        emerald: "var(--emerald)",
        rose:    "var(--rose)",
        violet:  "var(--violet)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-md": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
        "card-hover": "0 6px 20px 0 rgb(0 0 0 / 0.1)",
        glow: "0 0 0 3px rgb(37 99 235 / 0.15)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
