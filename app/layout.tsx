'use client'; 
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';

import { BookOpen, User, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { auth } from '@/lib/firebase'; 
import { signOut } from 'firebase/auth';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('vocab-username'); 
      window.location.href = '/'; 
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการออกจากระบบ:", error);
    }
  };

  return (
    <html lang="th" className={isDarkMode ? 'dark' : ''}>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500`}>
        
        {!isLoginPage && (
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
                <BookOpen className="text-primary dark:text-primary-light" size={24} />
                <span className="font-bold text-gray-800 dark:text-white text-lg">คลังคำศัพท์</span>
              </Link>
              
              <div className="flex items-center gap-3">
                {/* 1. ปุ่มเปิดปิด Dark Mode */}
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-300 transition-colors"
                  title="สลับโหมดมืด/สว่าง"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* 2. เมนู Dropdown ผู้ใช้ */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 transition"
                  >
                    <User size={16} className="text-gray-400 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
                      {typeof window !== 'undefined' ? localStorage.getItem('vocab-username') || 'ผู้ใช้' : 'ผู้ใช้'}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 dark:text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* กล่องเมนูที่จะเด้งลงมา */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in-down origin-top-right overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">บัญชีของคุณ</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition"
                      >
                        <LogOut size={16} />
                        ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
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