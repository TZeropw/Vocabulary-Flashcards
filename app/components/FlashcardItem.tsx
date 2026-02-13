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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-primary-dark transition">{data.word}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{data.category}</span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{data.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* ปุ่มแก้ไข: เมื่อกด จะส่งข้อมูลตัวเองกลับไป */}
          <button onClick={() => onEdit(data)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition" title="แก้ไข">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(data.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="ลบ">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">ความหมาย:</span>
          <p className="text-gray-800">{data.meaning}</p>
        </div>
        {data.example && (
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">ตัวอย่าง:</span>
            <p className="text-gray-600 italic">"{data.example}"</p>
          </div>
        )}
      </div>
    </div>
  );
}