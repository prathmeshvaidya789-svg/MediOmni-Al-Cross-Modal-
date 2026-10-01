/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: 'rgb(var(--color-dark-900) / <alpha-value>)',
          800: 'rgb(var(--color-dark-800) / <alpha-value>)',
          700: 'rgb(var(--color-dark-700) / <alpha-value>)',
          600: 'rgb(var(--color-dark-600) / <alpha-value>)',
          500: 'rgb(var(--color-dark-500) / <alpha-value>)',
        },
        brand: {
          cyan: 'rgb(var(--color-brand-cyan) / <alpha-value>)',
          blue: 'rgb(var(--color-brand-blue) / <alpha-value>)',
          indigo: 'rgb(var(--color-brand-indigo) / <alpha-value>)',
          purple: 'rgb(var(--color-brand-purple) / <alpha-value>)',
          teal: 'rgb(var(--color-brand-teal) / <alpha-value>)',
          emerald: 'rgb(var(--color-brand-emerald) / <alpha-value>)',
          rose: 'rgb(var(--color-brand-rose) / <alpha-value>)',
          amber: 'rgb(var(--color-brand-amber) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgb(var(--color-brand-cyan) / 0.35)',
        'glow-indigo': '0 0 25px -4px rgb(var(--color-brand-indigo) / 0.35)',
        'glow-emerald': '0 0 25px -4px rgb(var(--color-brand-emerald) / 0.35)',
        'glass': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px -3px rgb(var(--color-brand-cyan) / 0.2)' },
          '100%': { boxShadow: '0 0 30px 2px rgb(var(--color-brand-cyan) / 0.45)' },
        }
      }
    },
  },
  plugins: [],
}
