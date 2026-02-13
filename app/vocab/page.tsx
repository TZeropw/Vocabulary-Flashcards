'use client';
import { useState, useEffect } from 'react';
import CreateForm from '../components/CreateForm';
import FlashcardItem from '../components/FlashcardItem';
import { Flashcard } from '../types';
import { Search, Filter } from 'lucide-react';

const FILTER_CATEGORIES = [
  "ทั้งหมด", "ทั่วไป", "อาหารและเครื่องดื่ม", "การเดินทาง/ท่องเที่ยว",
  "การทำงาน/อาชีพ", "ของใช้ในบ้าน", "อารมณ์/ความรู้สึก",
  "สุขภาพ/ร่างกาย", "วิชาการ/การศึกษา", "สแลง (Slang)"
];

export default function VocabPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vocab-data-v3');
    if (saved) setFlashcards(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('vocab-data-v3', JSON.stringify(flashcards));
  }, [flashcards, isLoaded]);

  const handleAdd = (newCard: Flashcard) => {
    setFlashcards([newCard, ...flashcards]);
  };

  const handleUpdate = (updatedCard: Flashcard) => {
    setFlashcards(flashcards.map((card) => 
      card.id === updatedCard.id ? updatedCard : card
    ));
    setEditingCard(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('ยืนยันที่จะลบคำนี้?')) setFlashcards(flashcards.filter(c => c.id !== id));
  };

  const handleStartEdit = (card: Flashcard) => {
    setEditingCard(card);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCards = flashcards.filter(card => {
    const matchesSearch = card.word.toLowerCase().includes(searchTerm.toLowerCase()) || card.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isLoaded) return <div className="p-10 text-center text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <CreateForm 
          onAdd={handleAdd} 
          onUpdate={handleUpdate}
          editingCard={editingCard}
          onCancelEdit={() => setEditingCard(null)}
        />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="ค้นหาคำศัพท์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer bg-white">
              {FILTER_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 px-2">
            {searchTerm || selectedCategory !== 'ทั้งหมด' ? 'ผลการค้นหา' : 'รายการล่าสุด'}
            <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{filteredCards.length} คำ</span>
          </h3>

          {filteredCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">ไม่พบคำศัพท์</p>
            </div>
          ) : (
            <div className="grid gap-4">
               {filteredCards.map((card) => (
                <FlashcardItem 
                  key={card.id} 
                  data={card} 
                  onDelete={handleDelete}
                  onEdit={handleStartEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}