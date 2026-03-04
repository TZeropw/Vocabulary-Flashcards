'use client';
import { Flashcard } from '../types';
import { Trash2, Edit2, Calendar } from 'lucide-react';

interface Props {
  data: Flashcard;
  onDelete: (id: number) => void;
  onEdit: (card: Flashcard) => void;
}

export default function FlashcardItem({ data, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-primary dark:text-primary-light mb-2 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">{data.word}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-3 py-1 rounded-full font-medium">{data.category}</span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{data.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(data)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-full transition-colors" title="แก้ไข">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(data.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors" title="ลบ">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">ความหมาย:</span>
          <p className="text-gray-800 dark:text-gray-200 transition-colors">{data.meaning}</p>
        </div>
        {data.example && (
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">ตัวอย่าง:</span>
            <p className="text-gray-600 dark:text-gray-400 italic transition-colors">"{data.example}"</p>
          </div>
        )}
      </div>
    </div>
  );
}