/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Noto Serif SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: '#FAF8F4',
        ink: '#18181B',
        vermilion: '#E14D2A',
        coastal: '#0E7490',
      },
    },
  },
  plugins: [],
};
