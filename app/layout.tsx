'use client'; // ต้องมีบรรทัดนี้เพื่อใช้ usePathname ครับ
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // เช็คว่าถ้าเป็นหน้าแรก (/) ให้ถือว่าเป็นหน้า Login
  const isLoginPage = pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('vocab-username');
    window.location.href = '/';
  };

  return (
    <html lang="th">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        
        {/* --- แสดงเมนูเฉพาะหน้าฐานข้อมูล (ไม่ใช่หน้า Login) --- */}
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
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
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