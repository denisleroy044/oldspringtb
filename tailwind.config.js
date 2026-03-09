/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-teal': '#0A5C5E',
        'sage': '#7C9A6E',
        'soft-gold': '#E8B86C',
        'cream': '#F8F4E9',
        'burnt-orange': '#CC5500',
      },
    },
  },
  plugins: [],
}
