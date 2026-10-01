/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Trust Medical Healthcare Palette
        medical: {
          blue: '#0284C7',        // Deep Medical Blue (Primary)
          'blue-dark': '#0369A1',
          'blue-light': '#E0F2FE',
          teal: '#0D9488',        // Mint Teal (Accents)
          'teal-light': '#F0FDFA',
          emerald: '#10B981',     // Soft Emerald (CTA & Success)
          'emerald-dark': '#059669',
          'emerald-light': '#ECFDF5',
          bg: '#F8FAFC',          // Clean Light Background
          card: '#FFFFFF',        // Pure Card Surface
          border: '#E2E8F0',      // Subtle Border
          slate: '#0F172A',       // High-contrast primary text
          muted: '#64748B',       // Secondary clinical text
        },
        // Mapped to existing component classes for seamless light healthcare styling
        dark: {
          900: '#F8FAFC',         // Page Background
          800: '#FFFFFF',         // Card Background
          700: '#F1F5F9',         // Input / Elevated Row
          600: '#E2E8F0',         // Borders
          500: '#CBD5E1',         // Muted Borders
        },
        brand: {
          cyan: '#0284C7',        // Medical Blue
          blue: '#0369A1',        // Deep Blue
          teal: '#0D9488',        // Mint Teal
          emerald: '#10B981',     // Soft Emerald
          indigo: '#0284C7',
          purple: '#0D9488',
          rose: '#EF4444',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px -1px rgba(15, 23, 42, 0.05), 0 0 0 1px #E2E8F0',
        'card-hover': '0 16px 32px -8px rgba(15, 23, 42, 0.1), 0 0 0 1px #CBD5E1',
        'glow-cyan': '0 4px 20px -2px rgba(2, 132, 199, 0.25)',
        'glow-emerald': '0 6px 24px -2px rgba(16, 185, 129, 0.3)',
        'glow-teal': '0 4px 20px -2px rgba(13, 148, 136, 0.25)',
        'glass': '0 8px 30px -4px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lift': 'lift 0.25s ease-out forwards',
      }
    },
  },
  plugins: [],
}
