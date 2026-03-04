'use client';
import Link from 'next/link';
import { BookOpen, Flame, Star, ArrowRight, Library, PlayCircle, RefreshCcw, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Flashcard } from '../types';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const [randomWord, setRandomWord] = useState<Flashcard | null>(null);
  const [streak, setStreak] = useState(1);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'ผู้ใช้งาน');
        setUsername(displayName);

        try {
          const q = query(collection(db, 'vocabularies'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          const cards: Flashcard[] = [];
          querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() } as unknown as Flashcard);
          });

          setStats({ total: cards.length });

          if (cards.length > 0) {
            const randomIndex = Math.floor(Math.random() * cards.length);
            setRandomWord(cards[randomIndex]);
          } else {
            setRandomWord(null);
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
      } else {
        setUsername('ผู้เยี่ยมชม');
        setStats({ total: 0 });
      }
      setIsLoading(false);
    });

    handleStreakCalculation();
    return () => unsubscribe();
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

  
  const milestone = Math.ceil(streak / 7) * 7;
  const progressPercent = ((streak % 7 === 0 ? 7 : streak % 7) / 7) * 100;

  
  if (isLoading) {
    return (
      <div className="py-8 animate-pulse">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 px-4">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl"></div>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-down">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 transition-colors">
          ยินดีต้อนรับ <span className="text-primary dark:text-primary-light">{username}!</span> 👋
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 transition-colors">เก็บสะสมคำศัพท์วันละนิด เก่งภาษาขึ้นทุกวัน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 px-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 hover:shadow-md transition-all">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl text-blue-600 dark:text-blue-400"><BookOpen size={28} /></div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">คำศัพท์ทั้งหมด</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total} <span className="text-sm font-normal text-gray-400">คำ</span></h3>
          </div>
        </div>

        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center hover:shadow-md transition-all">
          <div className="flex items-center gap-5 mb-3">
            <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-2xl text-orange-500"><Flame size={28} fill="currentColor" /></div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">เรียนต่อเนื่อง</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{streak} <span className="text-sm font-normal text-gray-400">วัน</span></h3>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium">
              <span>เป้าหมาย {milestone} วัน</span>
              <span>{streak}/{milestone}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        
        <div className="perspective-1000 h-full min-h-[140px] cursor-pointer group" onClick={() => randomWord && setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-3xl shadow-lg overflow-hidden flex flex-col justify-center">
              <Star className="absolute -top-4 -right-4 text-white/10 transform rotate-12 group-hover:rotate-45 transition duration-700" size={100} />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2 text-primary-light">
                  <div className="flex items-center gap-2">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xs uppercase tracking-wider font-bold">สุ่มทบทวนวันนี้</span>
                  </div>
                  {randomWord && <RefreshCcw size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-500" />}
                </div>
                {randomWord ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-1 truncate">{randomWord.word}</h3>
                    <p className="text-white/60 text-xs mt-1 animate-pulse">คลิกเพื่อดูความหมาย</p>
                  </div>
                ) : (
                  <p className="font-bold text-lg">ยังไม่มีคำศัพท์</p>
                )}
              </div>
            </div>

            
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center items-center text-center border border-white/10">
              <h3 className="text-xl font-bold mb-2">{randomWord?.meaning}</h3>
              <p className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">{randomWord?.category}</p>
            </div>

          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        <Link href="/vocab" className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
          <div className="bg-blue-50 dark:bg-blue-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
            <Library size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">จัดการคำศัพท์</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">เพิ่มคำศัพท์ใหม่ ค้นหาคำเดิม หรือแก้ไขข้อมูล ครบจบในที่เดียว</p>
          <span className="mt-auto bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
            จัดการเลย <ArrowRight size={16}/>
          </span>
        </Link>

        <Link href="/review" className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">HOT</div>
          <div className="bg-purple-50 dark:bg-purple-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
            <PlayCircle size={40} className="text-primary dark:text-primary-light" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">ทบทวนความจำ</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">ทดสอบความรู้ด้วย Flashcards สุ่มคำศัพท์มาทายกันเถอะ</p>
          <span className="mt-auto bg-purple-50 dark:bg-purple-500/10 text-primary dark:text-primary-light px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
            เริ่มเล่น <ArrowRight size={16}/>
          </span>
        </Link>
      </div>
    </div>
  );
}