import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4EBDA',
          300: '#EAD9C0',
          400: '#D9C3A0',
          500: '#C4A87C',
        },
        navy: {
          50: '#EFF2F7',
          100: '#D6DFF0',
          200: '#ADBEDF',
          300: '#7B95CA',
          400: '#4D6FB5',
          500: '#2D4E8A',
          600: '#1E3A6E',
          700: '#162C55',
          800: '#0E1F3D',
          900: '#081328',
        },
        sage: {
          50: '#F2F5F0',
          100: '#E3EAE0',
          200: '#C5D4C0',
          300: '#9FB89A',
          400: '#7A9B73',
          500: '#5C7D54',
          600: '#456040',
          700: '#334830',
          800: '#223020',
          900: '#111810',
        },
        warm: {
          50: '#FDF8F5',
          100: '#F9EEE6',
          200: '#F1D9C8',
          300: '#E5BFA4',
          400: '#D49E7A',
          500: '#BF7E54',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        'elegant': '0 4px 20px rgba(14, 31, 61, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
