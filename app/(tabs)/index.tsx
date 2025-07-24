import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Star, Flame, Target, Play, RotateCcw, Plus } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

const todayStats = {
  studiedCards: 15,
  correctRate: 87,
  streakDays: 7,
  totalCards: 142,
};

const recentCategories = [
  { id: 1, name: '基本動詞', cardCount: 25, color: '#3B82F6' },
  { id: 2, name: '日常会話', cardCount: 18, color: '#10B981' },
  { id: 3, name: '文法（現在完了）', cardCount: 12, color: '#F59E0B' },
  { id: 4, name: 'TOEIC頻出語', cardCount: 35, color: '#EF4444' },
];

const achievements = [
  { id: 1, title: '7日連続学習', icon: '🔥', unlocked: true },
  { id: 2, title: '100単語マスター', icon: '📚', unlocked: true },
  { id: 3, title: '正解率90%達成', icon: '🎯', unlocked: false },
  { id: 4, title: '30日連続学習', icon: '⭐', unlocked: false },
];

export default function HomeScreen() {
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate daily stamp animation
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
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>おかえりなさい！</Text>
            <Text style={styles.motivationText}>今日も英語を頑張りましょう 💪</Text>
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
            <Text style={styles.stampEmoji}>⭐</Text>
          </Animated.View>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>今日の学習状況</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{todayStats.studiedCards}</Text>
              <Text style={styles.statLabel}>学習カード</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={24} color="#10B981" />
              <Text style={styles.statValue}>{todayStats.correctRate}%</Text>
              <Text style={styles.statLabel}>正解率</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{todayStats.streakDays}</Text>
              <Text style={styles.statLabel}>連続日数</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>クイックスタート</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, styles.primaryAction]}>
              <Play size={28} color="#FFFFFF" />
              <Text style={styles.primaryActionTitle}>学習開始</Text>
              <Text style={styles.primaryActionSubtitle}>今日のカードを学習</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <RotateCcw size={24} color="#3B82F6" />
              <Text style={styles.actionTitle}>復習モード</Text>
              <Text style={styles.actionSubtitle}>間違えたカード</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.actionTitle}>新規追加</Text>
              <Text style={styles.actionSubtitle}>カードを作成</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学習カテゴリ</Text>
          {recentCategories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.cardCount}枚のカード</Text>
              </View>
              <View style={styles.categoryProgress}>
                <Text style={styles.progressText}>学習中</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>達成バッジ</Text>
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
          <Star size={24} color="#F59E0B" />
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>今日のメッセージ</Text>
            <Text style={styles.motivationMessage}>
              継続は力なり！毎日少しずつでも続けることで、必ず英語力は向上します。今日も頑張りましょう！
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
    backgroundColor: '#F8FAFC',
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
    color: '#1E293B',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: '#64748B',
  },
  stampContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
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
    color: '#1E293B',
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
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
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
    backgroundColor: '#3B82F6',
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
    color: '#DBEAFE',
    marginTop: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
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
    color: '#1E293B',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryProgress: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
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
    borderColor: '#10B981',
  },
  lockedAchievement: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
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
    color: '#10B981',
  },
  lockedText: {
    color: '#94A3B8',
  },
  motivationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 24,
  },
  motivationContent: {
    marginLeft: 12,
    flex: 1,
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  motivationMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: '#A16207',
  },
});