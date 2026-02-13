'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Flashcard } from './types';

export default function HomePage() {
  const [count, setCount] = useState(0);

  // เช็คจำนวนคำศัพท์ที่มี
  useEffect(() => {
    const saved = localStorage.getItem('vocab-data-v2');
    if (saved) {
      const data: Flashcard[] = JSON.parse(saved);
      setCount(data.length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-5xl font-black text-gray-800 mb-4 mt-10">
          พร้อมจะเก่งภาษาหรือยัง? 🚀
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          คุณมีคำศัพท์ในคลังสมองทั้งหมด <span className="font-bold text-indigo-600 text-3xl">{count}</span> คำ
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* การ์ดปุ่มที่ 1: ไปเพิ่มคำ */}
          <Link href="/add" className="group block bg-white border-2 border-indigo-100 hover:border-indigo-500 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">จดคำศัพท์ใหม่</h2>
            <p className="text-gray-500">เพิ่มคำศัพท์ที่คุณเพิ่งเจอมา เก็บไว้กันลืม</p>
          </Link>

          {/* การ์ดปุ่มที่ 2: ไปทบทวน */}
          <Link href="/review" className="group block bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">▶️</div>
            <h2 className="text-2xl font-bold mb-2">เริ่มทบทวน</h2>
            <p className="text-indigo-100">ทดสอบความจำของคุณด้วย Flashcards</p>
          </Link>
        </div>
      </main>
    </div>
  );
}