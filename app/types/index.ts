export interface Flashcard {
  id: any;
  word: string;
  meaning: string;
  category: string;
  example?: string;
  createdAt: string;
  userId?: string;
  imageUrl?: string;
  weight?: number;
}