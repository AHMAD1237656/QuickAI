/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep neutral "ink" scale - sidebar, auth panels, high-contrast text.
        ink: {
          950: "#0A0E13",
          900: "#11161D",
          800: "#1A2029",
          700: "#242B36",
          600: "#333C49",
        },
        // Warm-neutral paper scale - the main canvas.
        paper: {
          50: "#FAFAF9",
          100: "#F4F5F6",
          200: "#E9EBEE",
        },
        // Signal - the primary accent color: a confident teal-green.
        signal: {
          50: "#ECFDF6",
          100: "#D2F9E7",
          200: "#A6F1D2",
          300: "#6FE4B9",
          400: "#3BD09E",
          500: "#12B886",
          600: "#0B9C71",
          700: "#0A7D5C",
          800: "#0C634B",
          900: "#0B503F",
        },
        // Accent - secondary indigo-violet hue used for gradients and
        // highlights alongside signal, giving the palette more depth
        // than a single flat brand color.
        accent: {
          50: "#F2F1FF",
          100: "#E5E2FF",
          200: "#CBC4FF",
          300: "#A79CFF",
          400: "#8A7AFB",
          500: "#6C5CE7",
          600: "#5844D6",
          700: "#4636B0",
          800: "#392C8C",
          900: "#2E2470",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(10 14 19 / 0.04), 0 1px 1px 0 rgb(10 14 19 / 0.03)",
        "card-hover": "0 12px 24px -8px rgb(10 14 19 / 0.12), 0 4px 8px -4px rgb(10 14 19 / 0.06)",
        panel: "0 24px 48px -16px rgb(10 14 19 / 0.35)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.05)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-30px, 20px) scale(1.08)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 0.9 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "slide-in": "slide-in 0.25s ease-out both",
        float: "float 9s ease-in-out infinite",
        "float-slow": "float-slow 13s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
