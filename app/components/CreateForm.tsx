'use client';
import { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Plus, Tag, Save, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  onAdd: (card: Flashcard) => void;
  onUpdate: (card: Flashcard) => void;
  editingCard: Flashcard | null;
  onCancelEdit: () => void; 
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function CreateForm({ onAdd, onUpdate, editingCard, onCancelEdit }: Props) {
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    category: LEVELS[0],
    example: '',
    imageUrl: '' 
  });

  useEffect(() => {
    if (editingCard) {
      setFormData({
        word: editingCard.word,
        meaning: editingCard.meaning,
        category: editingCard.category,
        example: editingCard.example || '',
        imageUrl: editingCard.imageUrl || ''
      });
    } else {
      setFormData({ word: '', meaning: '', category: LEVELS[0], example: '', imageUrl: '' });
    }
  }, [editingCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim()) return;

    if (editingCard) {
      const updatedCard: Flashcard = {
        ...editingCard, 
        ...formData,    
        category: formData.category || LEVELS[0]
      };
      onUpdate(updatedCard);
    } else {
      const newCard: Flashcard = {
        id: Date.now(),
        ...formData,
        category: formData.category || LEVELS[0],
        weight: 10, 
        createdAt: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      onAdd(newCard);
    }
    setFormData({ ...formData, word: '', meaning: '', example: '', imageUrl: '' });
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm border sticky top-6 transition-colors ${editingCard ? 'border-orange-200 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-900/10' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
      <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 transition-colors ${editingCard ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-white'}`}>
        {editingCard ? <><Save size={24}/> แก้ไขคำศัพท์</> : <><Plus className="text-primary dark:text-primary-light" size={24}/> เพิ่มคำศัพท์ใหม่</>}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">คำศัพท์ <span className="text-red-500">*</span></label>
          <input type="text" name="word" value={formData.word} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-colors" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">ความหมาย</label>
          <textarea name="meaning" value={formData.meaning} onChange={handleChange} rows={2} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1 transition-colors"><Tag size={14}/> ระดับภาษา (CEFR)</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-colors">
            {LEVELS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1 transition-colors"><ImageIcon size={14}/> ลิงก์รูปภาพประกอบ (URL)</label>
          <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">ตัวอย่างประโยค</label>
          <textarea name="example" value={formData.example} onChange={handleChange} rows={2} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none transition-colors" />
        </div>

        <div className="flex gap-2 pt-2">
          {editingCard && (
            <button type="button" onClick={onCancelEdit} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <X size={20} /> ยกเลิก
            </button>
          )}
          <button type="submit" className={`flex-[2] text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.98] ${editingCard ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary-dark'}`}>
            {editingCard ? <><Save size={20} /> บันทึกแก้ไข</> : <><Plus size={20} /> เพิ่ม</>}
          </button>
        </div>
      </form>
    </div>
  );
}