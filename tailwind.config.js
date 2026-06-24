/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#E8B84B', light: '#F5D080', dark: '#C99A35' },
        dark: { DEFAULT: '#080B0F', surface: '#0E1318', 'surface-2': '#1A2230', 'surface-3': '#1F2A38' },
        border: { DEFAULT: '#1E2D3D', light: '#253545' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
