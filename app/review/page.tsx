'use client';
import { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Check, X, ArrowLeft, Play, Layers, Grid } from 'lucide-react';
import Link from 'next/link';

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

  useEffect(() => {
    const saved = localStorage.getItem('vocab-data-v3');
    if (saved) setAllCards(JSON.parse(saved));
  }, []);

  const startGame = (category: string | null) => {
    let selected: Flashcard[] = [];
    if (category) {
      selected = allCards.filter(c => c.category === category);
    } else {
      selected = [...allCards];
    }

    if (selected.length === 0) {
      alert('ไม่มีคำศัพท์ในหมวดหมู่นี้ครับ');
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

  // --- MENU STATE ---
  if (gameStatus === 'menu') {
    return (
      <div className="max-w-md mx-auto py-8 px-4 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">โหมดทบทวน 🧠</h1>
        <p className="text-center text-gray-500 mb-8">เลือกรูปแบบที่คุณต้องการทดสอบ</p>
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
          <div className="border-t border-gray-100 my-2"></div>
          <p className="text-sm text-gray-400 font-medium ml-1">หรือเลือกตามหมวดหมู่:</p>
          <div className="grid grid-cols-1 gap-3">
            {CATEGORIES.map((cat) => {
              const count = allCards.filter(c => c.category === cat).length;
              if (count === 0) return null;
              return (
                <button key={cat} onClick={() => startGame(cat)} className="bg-white border border-gray-100 p-4 rounded-xl hover:border-primary hover:bg-blue-50 transition flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 text-gray-500 p-2 rounded-lg group-hover:bg-white group-hover:text-primary transition"><Layers size={18}/></div>
                    <span className="font-medium text-gray-700 group-hover:text-primary">{cat}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition">{count} คำ</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- FINISHED STATE ---
  if (gameStatus === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-scale-up">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">ยอดเยี่ยมมาก!</h2>
        <p className="text-gray-500 mb-8">คุณจำได้ <span className="text-primary font-bold text-2xl mx-1">{score}</span> จาก {playCards.length} คำ</p>
        <div className="flex flex-col w-full max-w-xs gap-3">
            <button onClick={() => setGameStatus('menu')} className="bg-white border-2 border-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition">เลือกหมวดอื่น</button>
            <button onClick={() => startGame(null)} className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30">เล่นซ้ำ (สุ่มใหม่)</button>
            <Link href="/dashboard" className="text-gray-400 text-sm mt-4 hover:text-gray-600">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  // --- PLAYING STATE ---
  const currentCard = playCards[currentIndex];
  return (
    <div className="max-w-md mx-auto py-4 px-4 h-[85vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setGameStatus('menu')} className="text-gray-400 hover:text-gray-600 p-2 -ml-2"><ArrowLeft size={24} /></button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 font-medium tracking-wider">PROGRESS</span>
            <div className="text-sm font-bold text-gray-700">{currentIndex + 1} <span className="text-gray-300">/</span> {playCards.length}</div>
        </div>
        <div className="w-8"></div> 
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIndex) / playCards.length) * 100}%` }}></div>
      </div>
      <div className="flex-1 flex flex-col justify-center mb-6">
        <div className="relative w-full aspect-[3/4] max-h-[450px] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* FRONT */}
            <div className="absolute h-full w-full backface-hidden bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col justify-center items-center p-8 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 bg-gray-50 px-3 py-1 rounded-full">Word</span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-800 break-words w-full">{currentCard?.word}</h1>
                <p className="absolute bottom-8 text-sm text-primary/60 font-medium animate-pulse">แตะเพื่อดูเฉลย</p>
            </div>
            {/* BACK */}
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
        <button onClick={() => handleAnswer(false)} className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-red-50 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-50 hover:border-red-100 transition shadow-sm active:scale-95"><X size={24} /><span className="text-xs">ยังไม่ได้</span></button>
        <button onClick={() => handleAnswer(true)} className="flex flex-col items-center justify-center gap-1 bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30 active:scale-95"><Check size={24} /><span className="text-xs">จำได้แล้ว!</span></button>
      </div>
      {!isFlipped && <div className="h-[60px]"></div>}
    </div>
  );
}