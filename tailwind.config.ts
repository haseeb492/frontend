import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      colors: {
        transparent: "transparent",
        primary: "#175CFF",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      spacing: {
        "0": "0px",
        tiny: "1px",
        xs: "2px",
        "2xs": "4px",
        "3xs": "8px",
        sm: "12px",
        "2sm": "16px",
        "3sm": "20px",
        md: "24px",
        "2md": "28px",
        "3md": "32px",
        lg: "40px",
        "2lg": "44px",
        "3lg": "48px",
        xl: "64px",
        "2xl": "80px",
        "3xl": "96px",
        "4xl": "112px",
      },
      borderRadius: {
        xs: "2px",
        "2xs": "4px",
        "3xs": "8px",
        sm: "12px",
        "2sm": "16px",
        "3sm": "20px",
        md: "24px",
        "2md": "28px",
        "3md": "32px",
        lg: "40px",
        "2lg": "44px",
        "3lg": "48px",
        xl: "64px",
        "2xl": "80px",
        "3xl": "96px",
      },
      fontSize: {
        "6xl": ["56px", { lineHeight: "84px", fontWeight: "500" }],
        "5xl": ["48px", { lineHeight: "72px", fontWeight: "500" }],
        "4xl": ["40px", { lineHeight: "60px", fontWeight: "500" }],
        "3xl": ["32px", { lineHeight: "48px", fontWeight: "500" }],
        "2xl": ["28px", { lineHeight: "40px", fontWeight: "500" }],
        xl: ["24px", { lineHeight: "36px", fontWeight: "500" }],
        lg: ["20px", { lineHeight: "32px", fontWeight: "500" }],
        md: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        sm: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        xs: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        xxs: ["10px", { lineHeight: "12px", fontWeight: "500" }],
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
