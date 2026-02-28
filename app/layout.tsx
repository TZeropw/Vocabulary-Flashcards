'use client'; 
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';

// เพิ่ม 2 บรรทัดนี้เพื่อเรียกใช้ระบบออกจากระบบของ Firebase
import { auth } from '../lib/firebase'; 
import { signOut } from 'firebase/auth';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/';

  // อัปเดตฟังก์ชันออกจากระบบใหม่
  const handleLogout = async () => {
    try {
      await signOut(auth); // 1. สั่งให้ Firebase ออกจากระบบ
      localStorage.removeItem('vocab-username'); // 2. ลบชื่อจำลองในเครื่องทิ้ง
      window.location.href = '/'; // 3. กลับไปหน้า Login
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการออกจากระบบ:", error);
    }
  };

  return (
    <html lang="th">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        
        {!isLoginPage && (
          <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
                <BookOpen className="text-primary" size={24} />
                <span className="font-bold text-gray-800">คลังคำศัพท์</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {typeof window !== 'undefined' ? localStorage.getItem('vocab-username') || 'ผู้ใช้' : 'ผู้ใช้'}
                  </span>
                </div>
                {/* ปุ่มออกจากระบบเรียกใช้ handleLogout ตัวใหม่ */}
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </header>
        )}

        <main className="max-w-7xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}