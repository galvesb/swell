import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        swell: {
          bg: '#FAF9F7',
          accent: '#A98F81',
          'accent-hover': '#91776b',
          alert: '#E26E6E',
          'text-dark': '#333333',
          'text-light': '#666666',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
