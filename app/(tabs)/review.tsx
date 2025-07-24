import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, CircleCheck as CheckCircle, Circle as XCircle, Eye, EyeOff, Shuffle, Filter } from 'lucide-react-native';
import { useState, useRef } from 'react';

const reviewCards = [
  {
    id: 1,
    front: 'accomplish',
    back: '達成する、成し遂げる',
    category: '基本動詞',
    difficulty: 'hard',
    wrongCount: 3,
    memo: '「完成させる」という意味で覚える。achievement（達成）と関連付けて覚える。',
  },
  {
    id: 2,
    front: 'I have been studying English for three years.',
    back: '私は3年間英語を勉強しています。（現在完了進行形）',
    category: '文法（現在完了）',
    difficulty: 'medium',
    wrongCount: 2,
    memo: '継続を表す現在完了進行形。for + 期間に注意。',
  },
  {
    id: 3,
    front: 'sophisticated',
    back: '洗練された、高度な',
    category: 'TOEIC頻出語',
    difficulty: 'hard',
    wrongCount: 4,
    memo: 'ソフィスティケイテッド。「洗練された大人」のイメージで覚える。',
  },
];

const difficultyColors = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export default function ReviewScreen() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState('wrong'); // 'wrong', 'all', 'difficult'
  const [shuffled, setShuffled] = useState(false);
  
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentCard = reviewCards[currentCardIndex];

  const flipCard = () => {
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: showAnswer ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct: boolean) => {
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

    // Move to next card
    setTimeout(() => {
      if (currentCardIndex < reviewCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
        flipAnim.setValue(0);
      } else {
        // Review session complete
        setCurrentCardIndex(0);
        setShowAnswer(false);
        flipAnim.setValue(0);
      }
    }, 300);
  };

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <RotateCcw size={28} color="#3B82F6" />
          <Text style={styles.title}>復習モード</Text>
        </View>

        {/* Review Options */}
        <View style={styles.optionsCard}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>復習対象</Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity 
                style={[styles.optionButton, reviewMode === 'wrong' && styles.activeOption]}
                onPress={() => setReviewMode('wrong')}
              >
                <Text style={[styles.optionText, reviewMode === 'wrong' && styles.activeOptionText]}>
                  間違えたカード
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, reviewMode === 'difficult' && styles.activeOption]}
                onPress={() => setReviewMode('difficult')}
              >
                <Text style={[styles.optionText, reviewMode === 'difficult' && styles.activeOptionText]}>
                  難しいカード
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.optionRow}>
            <TouchableOpacity 
              style={styles.shuffleButton}
              onPress={() => setShuffled(!shuffled)}
            >
              <Shuffle size={16} color={shuffled ? '#3B82F6' : '#64748B'} />
              <Text style={[styles.shuffleText, shuffled && styles.shuffleActiveText]}>
                シャッフル
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {reviewCards.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentCardIndex + 1) / reviewCards.length) * 100}%` }
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
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: difficultyColors[currentCard.difficulty] }
                ]}>
                  <Text style={styles.difficultyText}>
                    {currentCard.difficulty === 'easy' ? '簡単' :
                     currentCard.difficulty === 'medium' ? '普通' : '難しい'}
                  </Text>
                </View>
                <Text style={styles.categoryText}>{currentCard.category}</Text>
              </View>
              <Text style={styles.cardText}>{currentCard.front}</Text>
              <View style={styles.wrongCountBadge}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.wrongCountText}>{currentCard.wrongCount}回間違い</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.cardBack, { opacity: backOpacity }]}>
              <Text style={styles.cardText}>{currentCard.back}</Text>
              {currentCard.memo && (
                <View style={styles.memoSection}>
                  <Text style={styles.memoLabel}>メモ</Text>
                  <Text style={styles.memoText}>{currentCard.memo}</Text>
                </View>
              )}
            </Animated.View>
          </Animated.View>

          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            {showAnswer ? <EyeOff size={20} color="#3B82F6" /> : <Eye size={20} color="#3B82F6" />}
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
              <Text style={styles.wrongButtonText}>まだ覚えていない</Text>
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

        {/* Review Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>復習統計</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>復習対象</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>今日復習済み</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>73%</Text>
              <Text style={styles.statLabel}>正解率</Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>復習のコツ</Text>
          <Text style={styles.tipsText}>
            • 間違えたカードは翌日も復習する{'\n'}
            • 覚えたカードも定期的に確認する{'\n'}
            • メモ機能を活用して覚え方を記録する{'\n'}
            • 無理をせず、少しずつ継続することが大切
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 12,
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  optionRow: {
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 12,
    color: '#64748B',
  },
  activeOptionText: {
    color: '#FFFFFF',
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  shuffleText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  shuffleActiveText: {
    color: '#3B82F6',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
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
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
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
    backgroundColor: '#EFF6FF',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 28,
  },
  wrongCountBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  wrongCountText: {
    fontSize: 11,
    color: '#DC2626',
    marginLeft: 4,
  },
  memoSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  memoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  memoText: {
    fontSize: 14,
    color: '#1E293B',
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
    borderColor: '#3B82F6',
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  answerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
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
    backgroundColor: '#EF4444',
  },
  correctButton: {
    backgroundColor: '#10B981',
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  tipsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1E3A8A',
  },
});