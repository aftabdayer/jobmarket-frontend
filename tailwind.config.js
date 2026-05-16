/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      colors: {
        bg:      '#080e1a',
        surface: '#0f1929',
        's1':    '#162236',
        's2':    '#1e3050',
        accent:  '#38bdf8',
        green:   '#10b981',
        amber:   '#f59e0b',
        red:     '#f43f5e',
        purple:  '#a78bfa',
        text:    '#e2eaf5',
        muted:   '#7892b0',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease forwards',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
