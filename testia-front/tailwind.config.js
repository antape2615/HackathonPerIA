module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        neutral: {
          50: "hsl(220, 25%, 98%)",
          100: "hsl(220, 16%, 95%)",
          200: "hsl(220, 14%, 90%)",
          300: "hsl(220, 10%, 80%)",
          400: "hsl(220, 8%, 65%)",
          500: "hsl(220, 6%, 50%)",
          600: "hsl(220, 8%, 40%)",
          700: "hsl(220, 12%, 28%)",
          800: "hsl(220, 16%, 18%)",
          900: "hsl(220, 20%, 10%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        alt: ["Geist", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, hsl(216, 89%, 52%) 0%, hsl(280, 60%, 58%) 100%)',
        'gradient-2': 'linear-gradient(145deg, hsl(216, 65%, 40%) 0%, hsl(200, 70%, 40%) 100%)',
        'button-border-gradient': 'linear-gradient(120deg, hsla(216, 90%, 52%, 0.9), hsla(280, 60%, 55%, 0.9))',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in",
        "slide-in": "slide-in 0.3s ease-in",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
