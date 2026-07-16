import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        purple: {
          950: '#1a0b2e',
          900: '#2d1b4e',
          800: '#3b2168',
          700: '#4c2882',
          600: '#5b2f99',
          500: '#7c3aed',
          400: '#a78bfa',
          300: '#c4b5fd',
          200: '#ddd6fe',
          100: '#ede9fe',
        },
      },
    },
  },
  plugins: [],
};
export default config;