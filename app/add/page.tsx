'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreateForm from '../components/CreateForm';
import FlashcardItem from '../components/FlashcardItem';
import { Flashcard } from '../types';

export default function AddPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // ตัวเช็คว่าโหลดเสร็จหรือยัง

  // 1. โหลดข้อมูลเมื่อเปิดหน้าเว็บ (ทำแค่ครั้งเดียว)
  useEffect(() => {
    const saved = localStorage.getItem('vocab-data-v2');
    if (saved) {
      try {
        setFlashcards(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading data", e);
      }
    }
    setIsLoaded(true); // บอกระบบว่า "โหลดเสร็จแล้วนะ"
  }, []);

  // 2. บันทึกข้อมูลเมื่อ flashcards เปลี่ยน (ทำเฉพาะตอนโหลดเสร็จแล้วเท่านั้น!)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('vocab-data-v2', JSON.stringify(flashcards));
    }
  }, [flashcards, isLoaded]);

  const handleAdd = (newCard: Flashcard) => {
    setFlashcards([newCard, ...flashcards]);
  };
  
  const handleDelete = (id: number) => {
    if (confirm('ยืนยันลบคำนี้?')) {
      setFlashcards(flashcards.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, isLearned: !card.isLearned } : card
    ));
  };

  // ถ้ายังโหลดไม่เสร็จ ให้ขึ้น Loading (ป้องกันหน้าเว็บกระตุก)
  if (!isLoaded) return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📚 รายการคำศัพท์ทั้งหมด ({flashcards.length})
        </h2>
        
        <div className="mb-8">
          <CreateForm onAdd={handleAdd} />
        </div>

        {/* ใช้ Grid เพื่อป้องกันการ์ดทับกัน */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">ยังไม่มีคำศัพท์ ลองเพิ่มคำแรกดูสิ!</p>
          ) : (
            flashcards.map((card) => (
              <FlashcardItem 
                key={card.id} 
                data={card} 
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}