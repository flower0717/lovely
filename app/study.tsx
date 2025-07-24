import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, CircleCheck as CheckCircle, Circle as XCircle, ArrowLeft } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashCard, StudySession } from '@/types/card';
import { router } from 'expo-router';

export default function StudyScreen() {
  const [cards, setCards] = useLocalStorage<FlashCard[]>('flashcards', []);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('studySessions', []);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ studied: 0, correct: 0 });
  
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const unstudiedCards = cards.filter(card => !card.isLearned);
  const currentCard = unstudiedCards[currentCardIndex];

  useEffect(() => {
    if (unstudiedCards.length === 0) {
      router.replace('/');
    }
  }, [unstudiedCards.length]);

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: showAnswer ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    // Update card stats
    const updatedCards = cards.map(card => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          wrongCount: correct ? Math.max(0, card.wrongCount - 1) : card.wrongCount + 1,
          isLearned: correct && card.wrongCount === 0,
          lastReviewed: new Date(),
        };
      }
      return card;
    });
    setCards(updatedCards);

    // Update session stats
    const newStats = {
      studied: sessionStats.studied + 1,
      correct: sessionStats.correct + (correct ? 1 : 0),
    };
    setSessionStats(newStats);

    // Animate card exit
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Move to next card or finish session
    setTimeout(() => {
      if (currentCardIndex < unstudiedCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
        flipAnim.setValue(0);
      } else {
        finishSession(newStats);
      }
    }, 300);
  };

  const finishSession = (stats: { studied: number; correct: number }) => {
    const today = new Date().toISOString().split('T')[0];
    const existingSession = sessions.find(s => s.date === today);
    
    if (existingSession) {
      const updatedSessions = sessions.map(s => 
        s.date === today 
          ? { 
              ...s, 
              studiedCards: s.studiedCards + stats.studied,
              correctAnswers: s.correctAnswers + stats.correct,
              totalTime: s.totalTime + 10 // Estimate 10 minutes
            }
          : s
      );
      setSessions(updatedSessions);
    } else {
      const newSession: StudySession = {
        date: today,
        studiedCards: stats.studied,
        correctAnswers: stats.correct,
        totalTime: 10,
      };
      setSessions([...sessions, newSession]);
    }

    router.replace('/');
  };

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>学習完了！ 🎉</Text>
          <Text style={styles.emptyText}>すべてのカードを学習しました</Text>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')}>
            <Text style={styles.homeButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#EC4899" />
        </TouchableOpacity>
        <Text style={styles.title}>学習モード 📚</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressText}>
          {currentCardIndex + 1} / {unstudiedCards.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentCardIndex + 1) / unstudiedCards.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[
            styles.flashcard,
            {
              transform: [
                { scale: scaleAnim },
                { rotateY: frontRotateY }
              ]
            }
          ]}
        >
          <Animated.View style={[styles.cardFront, { opacity: frontOpacity }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.categoryText}>{currentCard.category}</Text>
            </View>
            <Text style={styles.cardText}>{currentCard.front}</Text>
          </Animated.View>

          <Animated.View style={[styles.cardBack, { opacity: backOpacity, transform: [{ rotateY: backRotateY }] }]}>
            <Text style={styles.cardText}>{currentCard.back}</Text>
            {currentCard.memo && (
              <View style={styles.memoSection}>
                <Text style={styles.memoLabel}>メモ 💡</Text>
                <Text style={styles.memoText}>{currentCard.memo}</Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          {showAnswer ? <EyeOff size={20} color="#EC4899" /> : <Eye size={20} color="#EC4899" />}
          <Text style={styles.flipButtonText}>
            {showAnswer ? '問題を見る' : '答えを見る'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Answer Buttons */}
      {showAnswer && (
        <View style={styles.answerButtons}>
          <TouchableOpacity 
            style={[styles.answerButton, styles.wrongButton]}
            onPress={() => handleAnswer(false)}
          >
            <XCircle size={24} color="#FFFFFF" />
            <Text style={styles.wrongButtonText}>まだ覚えてない</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.answerButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}
          >
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.correctButtonText}>覚えた！</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Session Stats */}
      <View style={styles.sessionStats}>
        <Text style={styles.sessionStatsText}>
          今回: {sessionStats.studied}問 / 正解: {sessionStats.correct}問
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BE185D',
  },
  placeholder: {
    width: 24,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BE185D',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  cardContainer: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  flashcard: {
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FCE7F3',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '600',
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#BE185D',
    textAlign: 'center',
    lineHeight: 32,
  },
  memoSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EC4899',
  },
  memoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EC4899',
    marginBottom: 4,
  },
  memoText: {
    fontSize: 14,
    color: '#BE185D',
    lineHeight: 20,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EC4899',
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
    marginLeft: 8,
  },
  answerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  wrongButton: {
    backgroundColor: '#F87171',
  },
  correctButton: {
    backgroundColor: '#34D399',
  },
  wrongButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  correctButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sessionStats: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sessionStatsText: {
    fontSize: 14,
    color: '#EC4899',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#EC4899',
    textAlign: 'center',
    marginBottom: 24,
  },
  homeButton: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});</parameter>