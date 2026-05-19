/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Тёмный космический фон
        'space-deep': '#070914',
        'space-mid': '#0d1426',
        'space-soft': '#172238',
        // Советские ретро-акценты
        'soviet-red': '#c8102e',
        'soviet-red-bright': '#e63946',
        'soviet-gold': '#f0c14b',
        'soviet-cream': '#f4ead5',
        // Текст
        'ink': '#e6ecf5',
        'ink-soft': '#a8b3c7',
      },
      fontFamily: {
        display: ['"Russo One"', '"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"Inter"', '"Roboto"', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'star-field':
          'radial-gradient(ellipse at top, rgba(40,60,120,0.45) 0%, rgba(7,9,20,0) 60%), radial-gradient(circle at 20% 80%, rgba(200,16,46,0.12) 0%, rgba(7,9,20,0) 50%)',
      },
      boxShadow: {
        'red-glow': '0 0 40px -10px rgba(200,16,46,0.55)',
      },
    },
  },
  plugins: [],
};
