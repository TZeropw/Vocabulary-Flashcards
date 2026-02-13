// app/layout.tsx
import type { Metadata } from "next";
// 1. เปลี่ยนจาก Inter เป็น Prompt (หรือฟอนต์อื่นที่ชอบ)
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <-- import Navbar

// 2. กำหนดน้ำหนักฟอนต์
const prompt = Prompt({ 
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "คลังคำศัพท์ - Vocabulary Bank",
  description: "รวบรวมและจัดการคำศัพท์ของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.className} bg-background text-gray-800`}>
        <Navbar /> {/* <-- ใส่ Navbar ไว้ตรงนี้ */}
        <main className="max-w-7xl mx-auto py-8 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}