'use client';
import { useState, useEffect } from 'react';
import CreateForm from '../components/CreateForm';
import FlashcardItem from '../components/FlashcardItem';
import { Flashcard } from '../types';
import { Search, Filter } from 'lucide-react';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const q = query(collection(db, 'vocabularies'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          const cards: Flashcard[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            let formattedDate = '';
            if (data.createdAt && data.createdAt.toDate) {
              formattedDate = data.createdAt.toDate().toISOString();
            }

            cards.push({ 
              id: doc.id, 
              ...data, 
              createdAt: formattedDate 
            } as unknown as Flashcard);
          });
          
          setFlashcards(cards.reverse());
        } catch (error) {
          console.error("โหลดข้อมูลล้มเหลว:", error);
        }
      } else {
        setUserId(null);
        setFlashcards([]);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (newCard: Flashcard) => {
    if (!userId) {
      alert("กรุณาล็อกอินก่อนเพิ่มคำศัพท์");
      return;
    }
    
    try {
      const { id, ...cardData } = newCard; 
      
      const docRef = await addDoc(collection(db, 'vocabularies'), {
        ...cardData,
        userId: userId,
        createdAt: serverTimestamp() 
      });

      const addedCard = { 
        id: docRef.id, 
        ...cardData, 
        userId,
        createdAt: new Date().toISOString()
      } as Flashcard;
      
      setFlashcards([addedCard, ...flashcards]);
    } catch (error) {
      console.error("เพิ่มคำศัพท์ล้มเหลว:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มคำศัพท์");
    }
  };

  const handleUpdate = async (updatedCard: Flashcard) => {
    try {
      const cardRef = doc(db, 'vocabularies', String(updatedCard.id));
      const { id, ...dataToUpdate } = updatedCard;
      await updateDoc(cardRef, dataToUpdate);

      setFlashcards(flashcards.map((card) => 
        card.id === updatedCard.id ? updatedCard : card
      ));
      setEditingCard(null);
    } catch (error) {
      console.error("อัปเดตคำศัพท์ล้มเหลว:", error);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('ยืนยันที่จะลบคำนี้?')) {
      try {
        await deleteDoc(doc(db, 'vocabularies', String(id)));
        setFlashcards(flashcards.filter(c => c.id !== id));
      } catch (error) {
        console.error("ลบคำศัพท์ล้มเหลว:", error);
      }
    }
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

  if (!isLoaded) return <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse font-bold text-lg">กำลังโหลดคำศัพท์ของคุณ...</div>;

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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input type="text" placeholder="ค้นหาคำศัพท์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none transition-colors" />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer transition-colors">
              {FILTER_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 dark:text-gray-300 px-2 transition-colors">
            {searchTerm || selectedCategory !== 'ทั้งหมด' ? 'ผลการค้นหา' : 'รายการล่าสุด'}
            <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-full transition-colors">{filteredCards.length} คำ</span>
          </h3>

          {filteredCards.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors">
              <p className="text-gray-500 dark:text-gray-400 font-medium">ไม่พบคำศัพท์</p>
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