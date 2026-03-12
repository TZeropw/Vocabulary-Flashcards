'use client';
import { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Check, X, ArrowLeft, Play, Layers, Grid, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

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
      }
      setIsLoaded(true); 
    });
    return () => unsubscribe();
  }, []);

  const startGame = (mode: string) => {
    let selected: Flashcard[] = [];
    
    if (mode === 'forgotten') {
      selected = allCards.filter(c => (c.weight || 10) >= 15);
      if (selected.length === 0) {
        alert('เก่งมาก! ตอนนี้คุณไม่มีคำศัพท์ที่ลืมบ่อย🎉');
        return;
      }
      selected.sort((a, b) => (b.weight || 10) - (a.weight || 10));
    } else if (mode === 'all') {
      selected = [...allCards];
      selected.sort((a, b) => ((b.weight || 10) * Math.random()) - ((a.weight || 10) * Math.random()));
    } else {
      selected = allCards.filter(c => c.category === mode);
      selected.sort(() => Math.random() - 0.5); 
    }

    if (selected.length === 0) {
      alert('ไม่มีคำศัพท์ในหมวดหมู่นี้ครับ');
      return;
    }

    setPlayCards(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsFlipped(false);
    setGameStatus('playing');
  };

  const handleAnswer = async (remembered: boolean) => {
    const currentCard = playCards[currentIndex];
    const oldWeight = currentCard.weight || 10;
    
    const newWeight = remembered ? Math.max(1, oldWeight - 5) : oldWeight + 10;

    try {
      const cardRef = doc(db, 'vocabularies', String(currentCard.id));
      await updateDoc(cardRef, { weight: newWeight });
      
      const updatedCards = allCards.map(c => c.id === currentCard.id ? { ...c, weight: newWeight } : c);
      setAllCards(updatedCards);
    } catch (error) {
      console.error("อัปเดตน้ำหนักคำศัพท์ล้มเหลว:", error);
    }

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

  if (!isLoaded) return <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse font-bold mt-20">กำลังเตรียมการ์ดคำศัพท์...</div>;

  if (gameStatus === 'menu') {
    return (
      <div className="max-w-md mx-auto py-8 px-4 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">โหมดทบทวน 🧠</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">เลือกรูปแบบที่คุณต้องการทดสอบ</p>
        <div className="grid gap-3">
          <button onClick={() => startGame('all')} className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full"><Grid size={24}/></div>
              <div className="text-left">
                <h3 className="font-bold text-lg">สุ่มทั้งหมด</h3>
                <p className="text-sm opacity-80">สุ่มตามน้ำหนักความจำ ({allCards.length} คำ)</p>
              </div>
            </div>
            <Play size={24} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>
          
          <button onClick={() => startGame('forgotten')} className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition flex items-center justify-between group mt-2 mb-2">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full"><BrainCircuit size={24}/></div>
              <div className="text-left">
                <h3 className="font-bold text-lg">ทบทวนคำที่ลืมบ่อย</h3>
                <p className="text-sm opacity-80">ซ่อมจุดอ่อนของคุณ</p>
              </div>
            </div>
            <Play size={24} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
          </button>

          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium ml-1 mt-2">เลือกระดับภาษา (CEFR):</p>
          <div className="grid grid-cols-2 gap-3">
            {LEVELS.map((level) => {
              const count = allCards.filter(c => c.category === level).length;
              if (count === 0) return null;
              return (
                <button key={level} onClick={() => startGame(level)} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl hover:border-primary transition flex flex-col items-center justify-center gap-2 group">
                  <span className="font-bold text-xl text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{level}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">{count} คำ</span>
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">ยอดเยี่ยมมาก!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">คุณจำได้ <span className="text-primary font-bold text-2xl mx-1">{score}</span> จาก {playCards.length} คำ</p>
        <div className="flex flex-col w-full max-w-xs gap-3">
            <button onClick={() => setGameStatus('menu')} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold hover:text-primary transition">เลือกโหมดอื่น</button>
            <button onClick={() => startGame('all')} className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30">สุ่มใหม่ทั้งหมด</button>
            <Link href="/dashboard" className="text-gray-400 text-sm mt-4 hover:text-gray-600 transition-colors">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const currentCard = playCards[currentIndex];
  return (
    <div className="max-w-md mx-auto py-4 px-4 h-[85vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setGameStatus('menu')} className="text-gray-400 hover:text-gray-600 p-2 -ml-2"><ArrowLeft size={24} /></button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 font-medium tracking-wider">PROGRESS</span>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{currentIndex + 1} <span className="text-gray-300 dark:text-gray-600">/</span> {playCards.length}</div>
        </div>
        <div className="w-8"></div> 
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-6 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIndex) / playCards.length) * 100}%` }}></div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center mb-6">
        <div className="relative w-full aspect-[3/4] max-h-[450px] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            <div className="absolute h-full w-full backface-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center p-8 text-center transition-colors">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">Word</span>
                
                {currentCard?.imageUrl && (
                  <img src={currentCard.imageUrl} alt={currentCard.word} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl mb-6 border-4 border-gray-50 dark:border-gray-700 shadow-md" />
                )}

                <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white break-words w-full">{currentCard?.word}</h1>
                {currentCard?.partOfSpeech && currentCard?.partOfSpeech !== "- ไม่ระบุ -" && (
                  <p className="text-lg text-gray-400 dark:text-gray-500 italic mt-2">{currentCard.partOfSpeech}</p>
                )}
                <p className="absolute bottom-8 text-sm text-primary/60 dark:text-primary-light/60 font-medium animate-pulse">แตะเพื่อดูเฉลย</p>
            </div>
            
            <div className="absolute h-full w-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-3xl shadow-xl flex flex-col justify-center items-center p-8 text-center text-white border border-white/10">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 bg-white/10 px-3 py-1 rounded-full">Meaning</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">{currentCard?.meaning}</h2>
                {currentCard?.example && <div className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm"><p className="text-white/90 italic text-sm font-light">"{currentCard.example}"</p></div>}
                <div className="absolute bottom-8 text-xs text-white/40 font-bold tracking-widest uppercase">LEVEL {currentCard?.category}</div>
            </div>
            
            </div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={() => handleAnswer(false)} className="flex flex-col items-center justify-center gap-1 bg-white dark:bg-gray-800 border-2 border-red-50 dark:border-red-900/30 text-red-500 dark:text-red-400 py-3 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/50 transition shadow-sm active:scale-95"><X size={24} /><span className="text-xs">ลืม (ย้ำบ่อยๆ)</span></button>
        <button onClick={() => handleAnswer(true)} className="flex flex-col items-center justify-center gap-1 bg-primary text-white py-3 rounded-2xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30 active:scale-95"><Check size={24} /><span className="text-xs">จำได้แล้วแม่นมาก!</span></button>
      </div>
      {!isFlipped && <div className="h-[60px]"></div>}
    </div>
  );
}