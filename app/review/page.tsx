'use client';
import { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Check, X, ArrowLeft, Play, Layers, Grid } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CATEGORIES = [
  "ทั่วไป", "อาหารและเครื่องดื่ม", "การเดินทาง/ท่องเที่ยว",
  "การทำงาน/อาชีพ", "ของใช้ในบ้าน", "อารมณ์/ความรู้สึก",
  "สุขภาพ/ร่างกาย", "วิชาการ/การศึกษา", "สแลง (Slang)"
];

export default function ReviewPage() {
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [playCards, setPlayCards] = useState<Flashcard[]>([]);
  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, 'vocabularies'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          const cards: Flashcard[] = [];
          querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() } as Flashcard);
          });
          
          setAllCards(cards);
        } catch (error) {
          console.error("โหลดข้อมูลล้มเหลว:", error);
        }
      } else {
        setAllCards([]);
      }
      setIsLoaded(true); 
    });

    return () => unsubscribe();
  }, []);

  const startGame = (category: string | null) => {
    let selected: Flashcard[] = [];
    if (category) {
      selected = allCards.filter(c => c.category === category);
    } else {
      selected = [...allCards];
    }

    if (selected.length === 0) {
      alert('ไม่มีคำศัพท์ในหมวดหมู่นี้ครับ กรุณาเพิ่มคำศัพท์ก่อน');
      return;
    }

    const shuffled = selected.sort(() => Math.random() - 0.5);
    setPlayCards(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsFlipped(false);
    setGameStatus('playing');
  };

  const handleAnswer = (remembered: boolean) => {
    if (remembered) setScore(score + 1);
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < playCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameStatus('finished');
      }
    }, 300);
  };

  if (!isLoaded) {
    return <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse font-bold text-lg mt-20">กำลังเตรียมการ์ดคำศัพท์ของคุณ... 🃏</div>;
  }

  if (gameStatus === 'menu') {
    return (
      <div className="max-w-md mx-auto py-8 px-4 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white transition-colors">โหมดทบทวน 🧠</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 transition-colors">เลือกรูปแบบที่คุณต้องการทดสอบ</p>
        <div className="grid gap-4">
          <button onClick={() => startGame(null)} className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full"><Grid size={24}/></div>
              <div className="text-left">
                <h3 className="font-bold text-lg">สุ่มทั้งหมด</h3>
                <p className="text-sm opacity-80">ทบทวนทุกคำ ({allCards.length} คำ)</p>
              </div>
            </div>
            <Play size={24} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>
          <div className="border-t border-gray-100 dark:border-gray-800 my-2 transition-colors"></div>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium ml-1 transition-colors">หรือเลือกตามหมวดหมู่:</p>
          <div className="grid grid-cols-1 gap-3">
            {CATEGORIES.map((cat) => {
              const count = allCards.filter(c => c.category === cat).length;
              if (count === 0) return null;
              return (
                <button key={cat} onClick={() => startGame(cat)} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl hover:border-primary dark:hover:border-primary-light hover:bg-blue-50 dark:hover:bg-gray-700 transition flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:text-primary dark:group-hover:text-primary-light transition"><Layers size={18}/></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">{cat}</span>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-primary-light transition">{count} คำ</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-scale-up">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">ยอดเยี่ยมมาก!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">คุณจำได้ <span className="text-primary dark:text-primary-light font-bold text-2xl mx-1">{score}</span> จาก {playCards.length} คำ</p>
        <div className="flex flex-col w-full max-w-xs gap-3">
            <button onClick={() => setGameStatus('menu')} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold hover:border-primary dark:hover:border-primary-light hover:text-primary dark:hover:text-primary-light transition">เลือกหมวดอื่น</button>
            <button onClick={() => startGame(null)} className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30">เล่นซ้ำ (สุ่มใหม่)</button>
            <Link href="/dashboard" className="text-gray-400 dark:text-gray-500 text-sm mt-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const currentCard = playCards[currentIndex];
  return (
    <div className="max-w-md mx-auto py-4 px-4 h-[85vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setGameStatus('menu')} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 -ml-2 transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider transition-colors">PROGRESS</span>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">{currentIndex + 1} <span className="text-gray-300 dark:text-gray-600">/</span> {playCards.length}</div>
        </div>
        <div className="w-8"></div> 
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-6 overflow-hidden transition-colors">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIndex) / playCards.length) * 100}%` }}></div>
      </div>
      <div className="flex-1 flex flex-col justify-center mb-6">
        <div className="relative w-full aspect-[3/4] max-h-[450px] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

            <div className="absolute h-full w-full backface-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center p-8 text-center transition-colors">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors">Word</span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white break-words w-full transition-colors">{currentCard?.word}</h1>
                <p className="absolute bottom-8 text-sm text-primary/60 dark:text-primary-light/60 font-medium animate-pulse transition-colors">แตะเพื่อดูเฉลย</p>
            </div>
            
            <div className="absolute h-full w-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-3xl shadow-xl flex flex-col justify-center items-center p-8 text-center text-white border border-white/10">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 bg-white/10 px-3 py-1 rounded-full">Meaning</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">{currentCard?.meaning}</h2>
                {currentCard?.example && <div className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm"><p className="text-white/90 italic text-sm font-light">"{currentCard.example}"</p></div>}
                <div className="absolute bottom-8 text-xs text-white/40 font-medium tracking-widest uppercase">{currentCard?.category}</div>
            </div>
            </div>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={() => handleAnswer(false)} className="flex flex-col items-center justify-center gap-1 bg-white dark:bg-gray-800 border-2 border-red-50 dark:border-red-900/30 text-red-500 dark:text-red-400 py-3 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/50 hover:border-red-100 dark:hover:border-red-800 transition shadow-sm active:scale-95"><X size={24} /><span className="text-xs">ยังไม่ได้</span></button>
        <button onClick={() => handleAnswer(true)} className="flex flex-col items-center justify-center gap-1 bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30 active:scale-95"><Check size={24} /><span className="text-xs">จำได้แล้ว!</span></button>
      </div>
      {!isFlipped && <div className="h-[60px]"></div>}
    </div>
  );
}