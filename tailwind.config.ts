import type { Config } from "tailwindcss";
import { SHOP_CONFIG } from "./shop.config";

const { primaryColor, secondaryColor, borderRadius, fontFamily } =
  SHOP_CONFIG.theme;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: primaryColor,
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: primaryColor,
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        secondary: {
          DEFAULT: secondaryColor,
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: secondaryColor,
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
      borderRadius: {
        DEFAULT: borderRadius,
        brand: borderRadius,
      },
      fontFamily: {
        sans: fontFamily.split(",").map((f) => f.trim().replace(/'/g, "")),
      },
    },
  },
  plugins: [],
};

export default config;
