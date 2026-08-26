/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // iOS System-Farben
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          purple: '#AF52DE',
          teal: '#5AC8FA',
          pink: '#FF2D55',
          indigo: '#5856D6',
        },
        // Flaechen (Light)
        surface: {
          DEFAULT: '#FFFFFF',
          grouped: '#F2F2F7',
          secondary: '#FFFFFF',
          tertiary: '#F2F2F7',
        },
        // Flaechen (Dark)
        night: {
          DEFAULT: '#000000',
          grouped: '#000000',
          secondary: '#1C1C1E',
          tertiary: '#2C2C2E',
          separator: '#38383A',
        },
        label: {
          primary: '#000000',
          secondary: '#3C3C4399',
          tertiary: '#3C3C434D',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        sheet: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05)',
        raised: '0 2px 8px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.08)',
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      spacing: {
        safeTop: 'env(safe-area-inset-top)',
        safeBottom: 'env(safe-area-inset-bottom)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.94)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'shake': {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 300ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'fade-in': 'fade-in 300ms ease both',
        pop: 'pop 220ms ease-out both',
        shake: 'shake 320ms ease-in-out both',
      },
    },
  },
  plugins: [],
};
