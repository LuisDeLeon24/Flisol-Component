/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Safelist dynamically-constructed animation delay classes
  safelist: [
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-600',
    'delay-700',
    'animate-fade-in-up',
    'animate-fade-in',
    'animate-slide-in-left',
    'animate-slide-in-right',
  ],
  theme: {
    extend: {
      colors: {
        flisol: {
          orange: '#F97316',
          black: '#0A0A0A',
          dark: '#111111',
          slate: '#111827',
          muted: '#A1A1AA',
          leadRed: '#E11D48',
          leadPurple: '#7C3AED',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(249, 115, 22, 0.3), 0 10px 30px rgba(249, 115, 22, 0.15)',
        'glow-purple': '0 0 0 1px rgba(124, 58, 237, 0.3), 0 10px 30px rgba(124, 58, 237, 0.15)',
      },
      backgroundImage: {
        'lead-gradient': 'linear-gradient(135deg, #E11D48 0%, #7C3AED 100%)',
      },
    },
  },
  plugins: [],
}
