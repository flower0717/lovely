export interface FlashCard {
  id: string;
  front: string;
  back: string;
  category: string;
  memo?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wrongCount: number;
  lastReviewed?: Date;
  isLearned: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface StudySession {
  date: string;
  studiedCards: number;
  correctAnswers: number;
  totalTime: number; // minutes
}

export interface UserStats {
  totalCards: number;
  learnedCards: number;
  streakDays: number;
  totalStudyTime: number;
  averageCorrectRate: number;
}</parameter>