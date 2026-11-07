import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080B0A", // Deep Obsidian Pine
        card: "#111614", // Rich Dark Card
        cardMuted: "#17201D",
        line: "#1F2B26", // Subtle structural border
        lineGold: "rgba(212, 175, 55, 0.28)",
        gold: {
          light: "#EAD6B8",
          DEFAULT: "#C5A880",
          dark: "#9E8159",
          glow: "#D4AF37",
        },
        emerald: {
          light: "#2B584E",
          DEFAULT: "#183832",
          dark: "#0E2420",
          glow: "#10B981",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F5F2EB",
          200: "#E6DFCE",
          300: "#D4C7AE",
        },
        txt: "#F5F2EB",
        mute: "#8E9995",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(27, 59, 54, 0.4)",
        "glow-gold": "0 0 30px rgba(212, 175, 55, 0.25)",
        "luxury-card": "0 20px 40px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
        "floating-pill": "0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
