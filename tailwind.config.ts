/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#1E3A8A',
          700: '#2563EB',
          100: '#EFF6FF',
        },
        bg: {
          light: '#FFFFFF',
          lighter: '#F9FAFB',
          lightest: '#F3F4F6',
        },
        text: {
          dark: '#1F2937',
          gray: '#6B7280',
          light: '#9CA3AF',
        },
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
