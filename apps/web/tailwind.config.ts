import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5F0FF",
          100: "#EDE0FF",
          200: "#D3B8FE",
          300: "#B585FD",
          400: "#9550FB",
          500: "#7C28F8",
          600: "#6C3FC5",
          700: "#5A2FA0",
          800: "#48237D",
          900: "#35185B",
          950: "#220E3C",
        },
        gold: {
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF0A3",
          300: "#FFE066",
          400: "#FFCF29",
          500: "#E8B86D",
          600: "#CC8F00",
          700: "#A36B00",
          800: "#7A4E00",
          900: "#523500",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
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
};

export default config;
