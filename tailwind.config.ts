import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        kic: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          gold: '#b28d49',
          white: '#ffffff',
          lightGray: '#fefefe',
          gray: '#90908e',
          nearWhite: '#fffeff',
          offWhite: '#feffff',
        },
        karatinaGreen: '#40ac4c',
        karatinaYellow: '#f8bf16',
        karatinaGray: '#807678',
        karatinaDark: '#2e2e2e',
        
        // New gradient stops for golden-to-green transitions
        gradientGold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706'
        },
        gradientGreen: {
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        'fade-out': {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        'scale-in': {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        'slide-in-right': {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          }
        },
        'slide-out-right': {
          "0%": {
            transform: "translateX(0)",
            opacity: "1"
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0"
          }
        },
        'bounce-gentle': {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)"
          },
          "50%": {
            transform: "translateY(-5px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)"
          }
        },
        'pulse-soft': {
          "0%, 100%": {
            opacity: "1"
          },
          "50%": {
            opacity: "0.7"
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'wave': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        },
        'plane-takeoff': {
          '0%': { 
            transform: 'translateX(0) translateY(0) rotate(0deg)',
            opacity: '1'
          },
          '30%': { 
            transform: 'translateX(20px) translateY(-10px) rotate(5deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(200%) translateY(-50px) rotate(10deg)',
            opacity: '0'
          }
        },
        'button-press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' }
        },
        // New overlay animations
        'overlay-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'menu-slide': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
        'wave': 'wave 6s linear infinite',
        'plane-takeoff': 'plane-takeoff 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'button-press': 'button-press 0.3s ease-out',
        'overlay-fade': 'overlay-fade 0.3s ease-out forwards',
        'menu-slide': 'menu-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      // New z-index scale for overlay components
      zIndex: {
        'overlay': '1000',
        'menu': '1001',
        'max': '2147483647' // Maximum z-index value
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin to ensure overlay works
    function({ addUtilities }) {
      addUtilities({
        '.isolate': {
          'isolation': 'isolate',
        },
        '.overlay-fixed': {
          'position': 'fixed',
          'inset': '0',
          'z-index': '1000',
        },
        '.menu-fixed': {
          'position': 'fixed',
          'z-index': '1001',
        }
      })
    }
  ],
} satisfies Config;