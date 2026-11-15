/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas-base': '#F5F5F7',
        'canvas-elevated': '#ECEEF2',
        'canvas-pure': '#FFFFFF',
        'text-primary': '#18191D',
        'text-secondary': '#626873',
        'text-muted': '#858B95',
        'border-subtle': '#E5E7EB',
        'fire-timber': '#F28C45',
        'fire-plaskett': '#E85D63',
        'radar-indigo': '#498ACF',
        'watershed-teal': '#35B9BD',
        'warning-gold': '#E7A83E',
        'spectral-cyan': '#22B8C7',
        primary: {
          DEFAULT: '#498ACF',
          dark: '#3572B0',
          light: '#6BA4DE',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
