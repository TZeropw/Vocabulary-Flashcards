'use client';
import { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Plus, Tag, Save, X } from 'lucide-react';

interface Props {
  onAdd: (card: Flashcard) => void;
  onUpdate: (card: Flashcard) => void;
  editingCard: Flashcard | null;
  onCancelEdit: () => void; 
}

const CATEGORIES = [
  "ทั่วไป",
  "อาหารและเครื่องดื่ม",
  "การเดินทาง/ท่องเที่ยว",
  "การทำงาน/อาชีพ",
  "ของใช้ในบ้าน",
  "อารมณ์/ความรู้สึก",
  "สุขภาพ/ร่างกาย",
  "วิชาการ/การศึกษา",
  "สแลง (Slang)"
];

export default function CreateForm({ onAdd, onUpdate, editingCard, onCancelEdit }: Props) {
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    category: CATEGORIES[0],
    example: ''
  });

  // เมื่อ editingCard เปลี่ยนให้เอาข้อมูลมาใส่ในฟอร์ม
  useEffect(() => {
    if (editingCard) {
      setFormData({
        word: editingCard.word,
        meaning: editingCard.meaning,
        category: editingCard.category,
        example: editingCard.example || ''
      });
    } else {
      // ถ้าไม่มีการแก้ไขให้เคลียร์ฟอร์ม
      setFormData({ word: '', meaning: '', category: CATEGORIES[0], example: '' });
    }
  }, [editingCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) return;

    if (editingCard) {
      // --- โหมดแก้ไข ---
      const updatedCard: Flashcard = {
        ...editingCard, // เอา ID และ createdAt เดิมมา
        ...formData,    // เอาข้อมูลใหม่ทับลงไป
        category: formData.category || CATEGORIES[0]
      };
      onUpdate(updatedCard);
    } else {
      const newCard: Flashcard = {
        id: Date.now(),
        ...formData,
        category: formData.category || CATEGORIES[0],
        createdAt: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      onAdd(newCard);
    }

    setFormData({ ...formData, word: '', meaning: '', example: '' });
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border sticky top-6 transition-colors ${editingCard ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
      <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${editingCard ? 'text-orange-600' : 'text-gray-800'}`}>
        {editingCard ? <><Save size={24}/> แก้ไขคำศัพท์</> : <><Plus className="text-primary" size={24}/> เพิ่มคำศัพท์ใหม่</>}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">คำศัพท์ <span className="text-red-500">*</span></label>
          <input type="text" name="word" value={formData.word} onChange={handleChange} className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ความหมาย <span className="text-red-500">*</span></label>
          <textarea name="meaning" value={formData.meaning} onChange={handleChange} rows={3} className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Tag size={14}/> หมวดหมู่</label>
          <div className="relative">
            <select name="category" value={formData.category} onChange={handleChange} className="w-full appearance-none border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ตัวอย่างประโยค</label>
          <textarea name="example" value={formData.example} onChange={handleChange} rows={2} className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
        </div>

        <div className="flex gap-2">
          {editingCard && (
            <button type="button" onClick={onCancelEdit} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              <X size={20} /> ยกเลิก
            </button>
          )}
          <button type="submit" className={`flex-[2] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.98] ${editingCard ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary-dark'}`}>
            {editingCard ? <><Save size={20} /> บันทึกแก้ไข</> : <><Plus size={20} /> เพิ่ม</>}
          </button>
        </div>
      </form>
    </div>
  );
}