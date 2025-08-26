import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Star, Flame, Target, Play, RotateCcw, Plus } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashCard, StudySession, Category } from '@/types/card';
import { calculateCorrectRate, getStreakDays, getCardsForReview } from '@/utils/cardUtils';
import { router } from 'expo-router';

const defaultCategories: Category[] = [
  { id: '1', name: '高校英単語', color: '#EC4899' },
  { id: '2', name: '不規則動詞', color: '#F472B6' },
  { id: '3', name: '熟語・イディオム', color: '#FB7185' },
  { id: '4', name: '構文', color: '#F97316' },
];

export default function HomeScreen() {
  const [cards] = useLocalStorage<FlashCard[]>('flashcards', []);
  const [sessions] = useLocalStorage<StudySession[]>('studySessions', []);
  const [categories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const todaySession = sessions.find(s => s.date === new Date().toISOString().split('T')[0]);
  const reviewCards = getCardsForReview(cards);
  const correctRate = calculateCorrectRate(sessions);
  const streakDays = getStreakDays(sessions);

  const todayStats = {
    studiedCards: todaySession?.studiedCards || 0,
    correctRate: todaySession ? Math.round((todaySession.correctAnswers / todaySession.studiedCards) * 100) || 0 : 0,
    streakDays,
    totalCards: cards.length,
  };

  const achievements = [
    { id: 1, title: '初回学習完了', icon: '🌸', unlocked: cards.length > 0 },
    { id: 2, title: '50単語マスター', icon: '💖', unlocked: cards.filter(c => c.isLearned).length >= 50 },
    { id: 3, title: '正解率75%達成', icon: '✨', unlocked: correctRate >= 75 },
    { id: 4, title: '7日連続学習', icon: '🎀', unlocked: streakDays >= 7 },
  ];

  useEffect(() => {
    if (todayStats.studiedCards > 0) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
        Animated.sequence([
          Animated.parallel([
            Animated.spring(scaleAnim, {
              toValue: 1.2,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [todayStats.studiedCards]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startStudy = () => {
    if (cards.length === 0) {
      router.push('/add-card');
    } else {
      router.push('/study');
    }
  };

  const startReview = () => {
    if (reviewCards.length === 0) {
      router.push('/add-card');
    } else {
      router.push('/review');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>お疲れさま！💖</Text>
            <Text style={styles.motivationText}>今日も英語を頑張ろう〜 🌸</Text>
          </View>
          <Animated.View 
            style={[
              styles.stampContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <Text style={styles.stampEmoji}>✨</Text>
          </Animated.View>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>今日の学習状況 📊</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BookOpen size={24} color="#EC4899" />
              <Text style={styles.statValue}>{todayStats.studiedCards}</Text>
              <Text style={styles.statLabel}>学習カード</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={24} color="#F472B6" />
              <Text style={styles.statValue}>{todayStats.correctRate}%</Text>
              <Text style={styles.statLabel}>正解率</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color="#FB7185" />
              <Text style={styles.statValue}>{todayStats.streakDays}</Text>
              <Text style={styles.statLabel}>連続日数</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日の学習メニュー 📚</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, styles.primaryAction]} onPress={startStudy}>
              <Play size={28} color="#FFFFFF" />
              <Text style={styles.primaryActionTitle}>学習スタート</Text>
              <Text style={styles.primaryActionSubtitle}>
                {cards.length === 0 ? 'カードを作成しよう' : '新しいカードを学習'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={startReview}>
              <RotateCcw size={24} color="#EC4899" />
              <Text style={styles.actionTitle}>復習モード</Text>
              <Text style={styles.actionSubtitle}>
                {reviewCards.length}枚の復習カード
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/add-card')}>
              <Plus size={24} color="#EC4899" />
              <Text style={styles.actionTitle}>カード追加</Text>
              <Text style={styles.actionSubtitle}>新しい単語を登録</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学習カテゴリ 📝</Text>
          {categories.map((category) => {
            const categoryCards = cards.filter(c => c.category === category.name);
            const learnedCards = categoryCards.filter(c => c.isLearned);
            return (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {categoryCards.length}枚のカード（習得済み: {learnedCards.length}枚）
                  </Text>
                </View>
                <View style={styles.categoryProgress}>
                  <Text style={styles.progressText}>
                    {categoryCards.length > 0 ? Math.round((learnedCards.length / categoryCards.length) * 100) : 0}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>達成バッジ 🏆</Text>
          <View style={styles.achievementGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  achievement.unlocked ? styles.unlockedAchievement : styles.lockedAchievement
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  achievement.unlocked ? styles.unlockedText : styles.lockedText
                ]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Motivation Message */}
        <View style={styles.motivationCard}>
          <Star size={24} color="#EC4899" />
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>今日のメッセージ 💌</Text>
            <Text style={styles.motivationMessage}>
              {cards.length === 0 
                ? 'まずは最初のカードを作成してみよう！小さな一歩から始めよう 🌸'
                : '継続は力なり！毎日少しずつでも続けることで、必ず英語力は向上するよ 💪✨'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F8',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: '#EC4899',
  },
  stampContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC4899',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stampEmoji: {
    fontSize: 28,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BE185D',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#EC4899',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 12,
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#EC4899',
    marginBottom: 8,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: '#FCE7F3',
    marginTop: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#EC4899',
    marginTop: 2,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#EC4899',
  },
  categoryProgress: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EC4899',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  unlockedAchievement: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EC4899',
  },
  lockedAchievement: {
    backgroundColor: '#FDF2F8',
    borderColor: '#F3E8FF',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  unlockedText: {
    color: '#EC4899',
  },
  lockedText: {
    color: '#D1D5DB',
  },
  motivationCard: {
    flexDirection: 'row',
    backgroundColor: '#FCE7F3',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
    marginBottom: 24,
  },
  motivationContent: {
    marginLeft: 12,
    flex: 1,
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 4,
  },
  motivationMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: '#EC4899',
  },
  },
});</parameter>