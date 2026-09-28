/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-main': '#07111F',
        'background-secondary': '#0B1728',
        'panel': '#0E1D31',
        'card': '#12243A',
        'border': '#1D3553',
        'text-primary': '#E8F0FA',
        'text-secondary': '#91A4BB',
        'text-muted': '#62758D',
        'accent': '#4C8DFF',
        'accent-light': '#75B6FF',
        'success': '#46D39A',
        'warning': '#F3B64B',
        'error': '#F06B75',
      },
      fontFamily: {
        telugu: ['Anek Telugu', 'serif'],
        sans: ['Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
