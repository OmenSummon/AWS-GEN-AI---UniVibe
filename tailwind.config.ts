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
        // Ultimate Truth Palette from specification
        brand: {
          primary: "#446B8D",
          "primary-hover": "#557FA5",
          "primary-dark": "#365671",
          accent: "#E4B74A",
          "accent-hover": "#EDC460",
          "accent-dark": "#C99E38",
          tertiary: "#B71C1C",
          "tertiary-hover": "#CD2A2A",
          bg: "#2C2B2B",
          surface: "#353434",
          "surface-light": "#3F3E3E",
          "surface-dark": "#222121",
          text: "#FEFEFE",
          "text-muted": "#B5B5B5",
          border: "#444343",
        },
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
          accent: "var(--accent)",
          tertiary: "var(--tertiary)",
        },
        // Mapped to Background Palette (#2C2B2B)
        midnight: {
          950: "#1A1919",
          900: "#222121",
          850: "#272626",
          800: "#2C2B2B",
          750: "#323131",
          700: "#383737",
          600: "#454343",
        },
        // Mapped to Primary (#446B8D) & Accent (#E4B74A)
        violet: {
          DEFAULT: "#446B8D",
          light: "#5D85A7",
          dark: "#365671",
          glow: "#446B8D",
        },
        // Mapped to Text (#FEFEFE) & Tint scales
        lavender: {
          50: "#FAF9F8",
          100: "#F4F3F1",
          200: "#E8E7E5",
          300: "#D3D1CD",
          400: "#B8B5AE",
          500: "#9C988F",
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
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(68, 107, 141, 0.28) 0%, rgba(44, 43, 43, 0) 70%)",
        "accent-radial": "radial-gradient(circle at 50% 0%, rgba(228, 183, 74, 0.25) 0%, rgba(44, 43, 43, 0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
