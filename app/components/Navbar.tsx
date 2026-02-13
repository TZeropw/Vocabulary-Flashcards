'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState('ผู้ใช้ทดลอง');

  // ดึงชื่อจากเครื่องมาแสดง
  useEffect(() => {
    const savedName = localStorage.getItem('vocab-username');
    if (savedName) setUsername(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vocab-username');
    window.location.href = '/login';
  };

  if (pathname === '/login') return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary text-xl font-bold hover:opacity-80 transition">
          <BookOpen size={28} />
          <span>คลังคำศัพท์</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <User size={18} className="text-primary" />
            <span className="font-medium text-sm">{username}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition text-sm font-medium">
            <LogOut size={18} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </nav>
  );
}