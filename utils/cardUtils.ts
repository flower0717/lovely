import { FlashCard, StudySession } from '@/types/card';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCardsForReview = (cards: FlashCard[]): FlashCard[] => {
  return cards.filter(card => card.wrongCount > 0 || !card.isLearned);
};

export const getCardsByCategory = (cards: FlashCard[], category: string): FlashCard[] => {
  return cards.filter(card => card.category === category);
};

export const calculateCorrectRate = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  
  const totalStudied = sessions.reduce((sum, session) => sum + session.studiedCards, 0);
  const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
  
  return totalStudied > 0 ? Math.round((totalCorrect / totalStudied) * 100) : 0;
};

export const getStreakDays = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  
  const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  let currentDate = new Date();
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

export const exportCardsToCSV = (cards: FlashCard[]): string => {
  const headers = ['表面', '裏面', 'カテゴリ', 'メモ', '難易度', '間違い回数', '習得済み'];
  const rows = cards.map(card => [
    card.front,
    card.back,
    card.category,
    card.memo || '',
    card.difficulty === 'easy' ? '簡単' : card.difficulty === 'medium' ? '普通' : '難しい',
    card.wrongCount.toString(),
    card.isLearned ? '○' : '×'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};</parameter>