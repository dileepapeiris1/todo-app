/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#e44332",   // main CTA, active states
          hover:   "#cc3929",   // hover / pressed
          100:     "#fee2de",   // light tint — backgrounds, rings, shadows
          50:      "#fff5f4",   // near-white tint — sidebar active bg
        },

        // Surfaces
        secondary: {
          DEFAULT: "#fdfcf8",   // warm off-white — page background
        },

        // Grey scale (equivalent of slate-*)
        quaternary: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
          50:  "#f8fafc",
        },

        // Semantic states
        success: {
          DEFAULT: "#059669",
          700:     "#047857",
          200:     "#a7f3d0",
          100:     "#d1fae5",
          50:      "#ecfdf5",
        },
        info: {
          DEFAULT: "#2563eb",
          100:     "#dbeafe",
          50:      "#eff6ff",
        },
        warning: {
          DEFAULT: "#d97706",
          100:     "#fef3c7",
          50:      "#fffbeb",
        },

        // Base
        white: "#FFFFFF",
        ink:   "#1c1c1c",       // near-black headings
      },
    },
  },
};
