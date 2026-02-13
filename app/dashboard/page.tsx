'use client';
import Link from 'next/link';
import { BookOpen, Flame, Star, ArrowRight, Library, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Flashcard } from '../types';

export default function DashboardPage() {
  const [username, setUsername] = useState('ผู้ใช้งาน');
  const [stats, setStats] = useState({ total: 0 });
  const [randomWord, setRandomWord] = useState<Flashcard | null>(null);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const savedName = localStorage.getItem('vocab-username');
    if (savedName) setUsername(savedName);

    const savedData = localStorage.getItem('vocab-data-v3');
    if (savedData) {
      const cards: Flashcard[] = JSON.parse(savedData);
      setStats({ total: cards.length });

      if (cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        setRandomWord(cards[randomIndex]);
      }
    }
    handleStreakCalculation();
  }, []);

  const handleStreakCalculation = () => {
    const today = new Date().toDateString();
    const storedStreakData = localStorage.getItem('vocab-streak-data');
    let currentStreak = 1;

    if (storedStreakData) {
      const { lastLoginDate, count } = JSON.parse(storedStreakData);
      const lastDate = new Date(lastLoginDate);
      const todayDate = new Date();
      lastDate.setHours(0,0,0,0);
      todayDate.setHours(0,0,0,0);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 0) currentStreak = count;
      else if (diffDays === 1) currentStreak = count + 1;
      else currentStreak = 1;
    }
    setStreak(currentStreak);
    localStorage.setItem('vocab-streak-data', JSON.stringify({ lastLoginDate: today, count: currentStreak }));
  };

  return (
    <div className="py-8 animate-fade-in-down">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          สวัสดี, <span className="text-primary">{username}!</span> 👋
        </h1>
        <p className="text-lg text-gray-500">เก็บสะสมคำศัพท์วันละนิด เก่งภาษาขึ้นทุกวัน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 px-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><BookOpen size={28} /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">คำศัพท์ทั้งหมด</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.total} <span className="text-sm font-normal text-gray-400">คำ</span></h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-500"><Flame size={28} fill="currentColor" /></div>
          <div>
            <p className="text-gray-500 text-sm font-medium">เรียนต่อเนื่อง</p>
            <h3 className="text-3xl font-bold text-gray-800">{streak} <span className="text-sm font-normal text-gray-400">วัน</span></h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <Star className="absolute -top-4 -right-4 text-white/10 transform rotate-12 group-hover:rotate-45 transition duration-700" size={100} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-primary-light">
              <Star size={16} fill="currentColor" />
              <span className="text-xs uppercase tracking-wider font-bold">สุ่มทบทวนวันนี้</span>
            </div>
            {randomWord ? (
              <>
                <h3 className="text-2xl font-bold mb-1 truncate">{randomWord.word}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{randomWord.meaning}</p>
              </>
            ) : (
              <p className="font-bold text-lg">ยังไม่มีคำศัพท์</p>
            )}
          </div>
        </div>
      </div>
      
        
      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        {/* ปุ่มซ้าย: ไปหน้า Vocab*/}
        <Link href="/vocab" className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
            <Library size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">จัดการคำศัพท์</h3>
          <p className="text-gray-500 mb-6 max-w-xs">เพิ่มคำศัพท์ใหม่ ค้นหาคำเดิม หรือแก้ไขข้อมูล ครบจบในที่เดียว</p>
          <span className="mt-auto bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
            จัดการเลย <ArrowRight size={16}/>
          </span>
        </Link>

        {/* ปุ่มขวา: ไปหน้า Review*/}
        <Link href="/review" className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">HOT</div>
          <div className="bg-purple-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
            <PlayCircle size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">ทบทวนความจำ</h3>
          <p className="text-gray-500 mb-6 max-w-xs">ทดสอบความรู้ด้วย Flashcards สุ่มคำศัพท์มาทายกันเถอะ</p>
          <span className="mt-auto bg-purple-50 text-primary px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
            เริ่มเล่น <ArrowRight size={16}/>
          </span>
        </Link>
      </div>
    </div>
  );
}