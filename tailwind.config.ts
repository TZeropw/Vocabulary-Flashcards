import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5a4fcf", // สีม่วงหลัก
          light: "#7e73e6",
          dark: "#463db3",
        },
        background: "#f3f4f6", // สีพื้นหลังเทาอ่อน
      },
      fontFamily: {
        sans: ['"Prompt"', "sans-serif"], // ใช้ฟอนต์ Prompt ให้ดูทันสมัย
      },
    },
  },
  plugins: [],
};
export default config;