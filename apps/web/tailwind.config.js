/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Venice Brand Colors
        venice: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        // Primary: Deep Purple
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",  // Venice primary
          800: "#6b21a8",
          900: "#581c87",
        },
        // Secondary: Hot Pink
        secondary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f8b4d6",
          400: "#f472b6",
          500: "#ec4899",  // Venice secondary
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        // Accent: Cyan
        accent: {
          50: "#ecf9ff",
          100: "#cff1ff",
          200: "#a3e9ff",
          300: "#7ae4ff",
          400: "#4ad9ff",
          500: "#22d3ee",  // Accent
          600: "#06b6d4",
          700: "#0891b2",
          800: "#0e7490",
          900: "#164e63",
        },
        // Dark Mode
        dark: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",  // Dark secondary
          800: "#1f2937",  // Dark primary
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      spacing: {
        0: "0px",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        // Venice glow effect
        glow: "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-lg": "0 0 40px rgba(168, 85, 247, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.5)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
