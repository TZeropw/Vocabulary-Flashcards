export interface Flashcard {
  id: any;
  word: string;
  meaning: string;
  category: string;
  partOfSpeech?: string;
  example?: string;
  createdAt: string;
  userId?: string;
  imageUrl?: string;
  weight?: number;
}