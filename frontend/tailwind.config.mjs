/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#4A4A4A",
        white: "#FFFFFF",
        "mint-green": "#C5E1A5",
        "soft-yellow": "#FCEEB5",
        "floral-white": "#FFFBF2"
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        spaceGrotesk: ['var(--font-space-grotesk)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
