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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col sm:flex-row gap-6">
      
      {data.imageUrl && (
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          <img src={data.imageUrl} alt={data.word} className="w-full h-full object-cover rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm" />
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-primary-light mb-2 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">{data.word}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 transition-colors">
              <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-3 py-1 rounded-full font-bold">{data.category}</span>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{data.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(data)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-full transition-colors">
              <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(data.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-gray-800 dark:text-gray-200 font-medium transition-colors">{data.meaning}</p>
          </div>
          {data.example && (
            <p className="text-gray-500 dark:text-gray-400 italic text-sm transition-colors">"{data.example}"</p>
          )}
        </div>
      </div>
    </div>
  );
}