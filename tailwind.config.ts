import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme semantic tokens
        theme: {
          bg: "var(--background)",
          surface: "var(--surface)",
          "surface-secondary": "var(--surface-secondary)",
          "surface-muted": "var(--surface-muted)",
          foreground: "var(--foreground)",
          "foreground-secondary": "var(--foreground-secondary)",
          muted: "var(--muted-foreground)",
          border: "var(--border)",
          primary: "var(--primary)",
          "primary-foreground": "var(--primary-foreground)",
        },
        // UniVibe Brand Midnight Palette
        midnight: {
          950: "#07050d",
          900: "#0B0813",
          850: "#100c1e",
          800: "#151027",
          750: "#18122f",
          700: "#1d1736",
          600: "#272047",
        },
        // UniVibe Brand Violet Palette
        violet: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
          glow: "#6D28D9",
        },
        // UniVibe Brand Lavender Palette (High-legibility lightness scales)
        lavender: {
          50: "#FAF8FF",
          100: "#F3EFFF",
          200: "#E9E2FE",
          300: "#DDD6FE",
          400: "#C4B5FD",
          500: "#A78BFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.8", filter: "blur(28px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.22) 0%, rgba(11, 8, 19, 0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
