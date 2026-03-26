import type { Config } from "tailwindcss";

// 🎬 ROOKNOMICS CINEMATIC UI: Extended Tailwind config with cinematic tokens
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      // 🎬 ROOKNOMICS CINEMATIC UI: Color palette — cinematic dark
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // ROOKNOMICS design tokens
        rn: {
          base:         "#050505",
          surface:      "#0D0D0D",
          hover:        "#111111",
          border:       "#1A1A1A",
          "border-acc": "#2A2A2A",
          rim:          "#6366F1",
          indigo:       "#818CF8",
          positive:     "#10B981",
          negative:     "#F43F5E",
          neutral:      "#F59E0B",
          cyan:         "#22D3EE",
        },
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Border radii
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "4px",
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Font families
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Extended spacing (8px grid)
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Box shadows — rim lighting system
      boxShadow: {
        "rn-card":      "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0px transparent",
        "rn-card-hover":"inset 0 1px 0 rgba(255,255,255,0.10), 0 0 30px rgba(99,102,241,0.06)",
        "rn-positive":  "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(16,185,129,0.08)",
        "rn-negative":  "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(244,63,94,0.08)",
        "rn-primary":   "0 0 20px rgba(99,102,241,0.35)",
        "rn-rim":       "0 0 0 1px rgba(255,255,255,0.06)",
        "rn-focus":     "0 0 0 3px rgba(99,102,241,0.15)",
        "rn-modal":     "0 24px 48px rgba(0,0,0,0.50)",
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Background gradients
      backgroundImage: {
        "rn-card":      "linear-gradient(180deg, #141414 0%, #0D0D0D 100%)",
        "rn-nav":       "linear-gradient(180deg, #0D0D0D 0%, #050505 100%)",
        "rn-hero-glow": "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 65%)",
        "rn-auth-glow": "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)",
        "rn-btn":       "linear-gradient(135deg, #6366F1, #4F46E5)",
      },

      // 🎬 ROOKNOMICS CINEMATIC UI: Keyframes
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "marquee":        { to: { transform: "translateX(-50%)" } },
        "shimmer": {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "rimPulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99,102,241,0.15)" },
          "50%":      { boxShadow: "0 0 35px rgba(99,102,241,0.28)" },
        },
        "fadeInUp": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "heroPulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":      { opacity: "0.9", transform: "scale(1.08)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "marquee":        "marquee var(--duration, 40s) linear infinite",
        "shimmer":        "shimmer 1.8s infinite",
        "rim-pulse":      "rimPulse 3s infinite ease-in-out",
        "fade-in-up":     "fadeInUp 0.25s ease-out",
        "hero-pulse":     "heroPulse 4s infinite ease-in-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
