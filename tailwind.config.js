/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        'deep-teal': '#006F87',
        'sage': '#7E9C76',
        'soft-gold': '#D9B648',
        'cream': '#F4EBD2',
        'soft-white': '#F9F9F9',
        'text-dark': '#2C3E50',
        'text-soft': '#5D6D7E',
      },
    },
  },
  plugins: [],
}
