import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "oklch(var(--chart-2))",
          foreground: "oklch(var(--foreground))",
        },
        warning: {
          DEFAULT: "oklch(var(--chart-3))",
          foreground: "oklch(var(--foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.3)",
        sm: "0 2px 4px 0 rgba(0,0,0,0.2)",
        md: "0 4px 8px 0 rgba(0,0,0,0.2)",
        lg: "0 8px 16px 0 rgba(0,0,0,0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "intelligence-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(255, 107, 43, 0.2), inset 0 0 8px rgba(255, 107, 43, 0.05)",
          },
          "50%": {
            boxShadow: "0 0 16px rgba(255, 107, 43, 0.4), inset 0 0 12px rgba(255, 107, 43, 0.1)",
          },
        },
        "governance-pulse": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 8px rgba(255, 107, 43, 0.3)",
          },
          "50%": {
            opacity: "0.6",
            boxShadow: "0 0 16px rgba(255, 107, 43, 0.6)",
          },
        },
        "profile-pulse": { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.8' } },
        "glass-float": { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        "glass-shimmer": { '0%': { backgroundPosition: '200% center' }, '100%': { backgroundPosition: '-200% center' } },
        "glow-pulse": { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "intelligence-pulse": "intelligence-pulse 3.2s ease-in-out infinite",
        "governance-pulse": "governance-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
