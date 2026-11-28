/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          950: '#030c08',
          900: '#05130e',
          850: '#071811',
          800: '#0a1f17',
          700: '#102b20',
          600: '#153a2a',
          500: '#1d4b36',
        },
        gold: {
          50: '#fdf9ee',
          100: '#f8eed4',
          200: '#f0dcaa',
          300: '#e6c883',
          400: '#d9b45a',
          500: '#c49c42',
          600: '#a37c2f',
          700: '#7d5d23',
        },
        cream: {
          DEFAULT: '#f5ead2',
          muted: '#c8c0ab',
          dim: '#928c7c',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'STSong', 'SimSun', 'Georgia', 'serif'],
      },
      gridTemplateColumns: {
        14: 'repeat(14, minmax(0, 1fr))',
      },
      boxShadow: {
        panel: '0 30px 60px -30px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(245, 234, 210, 0.05)',
        gold: '0 0 0 1px rgba(217, 180, 90, 0.28), 0 20px 50px -22px rgba(0, 0, 0, 0.8)',
        card: '0 1px 0 rgba(255, 255, 255, 0.65) inset, 0 3px 10px -3px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
