import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg: {
          base: "#0a0a0f",
          elevated: "#111118",
          card: "#16161f",
          border: "#1e1e2e",
        },
        accent: {
          cyan: "#00e5ff",
          violet: "#7c3aed",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
        text: {
          primary: "#f0f0ff",
          secondary: "#8888aa",
          muted: "#444466",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,229,255,0.15)",
        "glow-violet": "0 0 20px rgba(124,58,237,0.2)",
        "glow-emerald": "0 0 20px rgba(16,185,129,0.15)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "card-gradient": "linear-gradient(135deg, #16161f 0%, #1a1a28 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
