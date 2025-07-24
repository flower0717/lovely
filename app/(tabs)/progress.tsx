import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, BarChart3, Clock, Flame, BookOpen, Download } from 'lucide-react-native';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashCard, StudySession, Category } from '@/types/card';
import { calculateCorrectRate, getStreakDays, exportCardsToCSV } from '@/utils/cardUtils';

const defaultCategories: Category[] = [
  { id: '1', name: '高校英単語', color: '#EC4899' },
  { id: '2', name: '不規則動詞', color: '#F472B6' },
  { id: '3', name: '熟語・イディオム', color: '#FB7185' },
  { id: '4', name: '構文', color: '#F97316' },
];

export default function ProgressScreen() {
  const [cards] = useLocalStorage<FlashCard[]>('flashcards', []);
  const [sessions] = useLocalStorage<StudySession[]>('studySessions', []);
  const [categories] = useLocalStorage<Category[]>('categories', defaultCategories);

  const learnedCards = cards.filter(card => card.isLearned);
  const correctRate = calculateCorrectRate(sessions);
  const streakDays = getStreakDays(sessions);
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.totalTime, 0);

  const monthlyStats = {
    totalCards: cards.length,
    studiedCards: learnedCards.length,
    correctRate,
    streakDays,
    totalStudyTime,
  };

  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const weeklyData = last7Days.map(date => {
    const session = sessions.find(s => s.date === date);
    const dayName = new Date(date).toLocaleDateString('ja-JP', { weekday: 'short' });
    return {
      day: dayName,
      studied: session?.studiedCards || 0,
      correct: session?.correctAnswers || 0,
    };
  });

  const maxStudied = Math.max(...weeklyData.map(d => d.studied), 1);

  const categoryProgress = categories.map(category => {
    const categoryCards = cards.filter(c => c.category === category.name);
    const mastered = categoryCards.filter(c => c.isLearned);
    const studying = categoryCards.filter(c => !c.isLearned && c.wrongCount > 0);
    
    return {
      name: category.name,
      total: categoryCards.length,
      mastered: mastered.length,
      studying: studying.length,
      color: category.color,
    };
  });

  const achievements = [
    { id: 1, title: '初回学習完了', description: '最初のカードを学習しました', date: '2024-01-01', icon: '🌸', unlocked: cards.length > 0 },
    { id: 2, title: '7日連続学習', description: '1週間毎日学習を続けました', date: '2024-01-08', icon: '🔥', unlocked: streakDays >= 7 },
    { id: 3, title: '50単語マスター', description: '50個の単語を覚えました', date: '2024-01-15', icon: '💖', unlocked: learnedCards.length >= 50 },
    { id: 4, title: '正解率75%達成', description: '正解率が75%を超えました', date: '2024-01-20', icon: '✨', unlocked: correctRate >= 75 },
  ];

  const handleExport = () => {
    if (cards.length === 0) {
      Alert.alert('エラー', 'エクスポートするカードがありません。');
      return;
    }

    const csvData = exportCardsToCSV(cards);
    Alert.alert(
      'データエクスポート 📊',
      'カードデータをCSV形式でエクスポートしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'エクスポート', 
          onPress: () => {
            // In a real app, you would save the file or share it
            console.log('CSV Data:', csvData);
            Alert.alert('完了 ✨', 'データをエクスポートしました');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TrendingUp size={28} color="#EC4899" />
          <Text style={styles.title}>学習進捗 📊</Text>
        </View>

        {/* Overall Stats */}
        <View style={styles.overallStatsCard}>
          <Text style={styles.cardTitle}>今月の学習状況 🌸</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BookOpen size={24} color="#EC4899" />
              <Text style={styles.statValue}>{monthlyStats.studiedCards}</Text>
              <Text style={styles.statLabel}>習得済みカード</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={24} color="#F472B6" />
              <Text style={styles.statValue}>{monthlyStats.correctRate}%</Text>
              <Text style={styles.statLabel}>正解率</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color="#FB7185" />
              <Text style={styles.statValue}>{monthlyStats.streakDays}</Text>
              <Text style={styles.statLabel}>連続学習日数</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={24} color="#F97316" />
              <Text style={styles.statValue}>{Math.floor(monthlyStats.totalStudyTime / 60)}h</Text>
              <Text style={styles.statLabel}>総学習時間</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>週間学習グラフ 📈</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.correctBar,
                        { height: Math.max((data.correct / maxStudied) * 120, 2) }
                      ]}
                    />
                    <View 
                      style={[
                        styles.totalBar,
                        { height: Math.max((data.studied / maxStudied) * 120, 2) }
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                  <Text style={styles.chartValue}>{data.studied}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#EC4899' }]} />
                <Text style={styles.legendText}>学習数</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#34D399' }]} />
                <Text style={styles.legendText}>正解数</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カテゴリ別進捗 📚</Text>
          {categoryProgress.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryStats}>
                  {category.mastered}/{category.total}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.masteredProgress,
                      { 
                        width: category.total > 0 ? `${(category.mastered / category.total) * 100}%` : '0%',
                        backgroundColor: category.color
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {category.total > 0 ? Math.round((category.mastered / category.total) * 100) : 0}%
                </Text>
              </View>
              <View style={styles.categoryDetails}>
                <Text style={styles.detailText}>マスター: {category.mastered}枚</Text>
                <Text style={styles.detailText}>学習中: {category.studying}枚</Text>
                <Text style={styles.detailText}>未学習: {category.total - category.mastered - category.studying}枚</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>達成記録 🏆</Text>
          {achievements.filter(a => a.unlocked).map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データエクスポート 💾</Text>
          <View style={styles.exportCard}>
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
              <Download size={20} color="#EC4899" />
              <Text style={styles.exportButtonText}>学習データをCSVで出力</Text>
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 12,
  },
  overallStatsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
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
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
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
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
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
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingBottom: 40,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    position: 'relative',
    width: 20,
    marginBottom: 8,
  },
  totalBar: {
    width: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  correctBar: {
    width: '100%',
    backgroundColor: '#34D399',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  chartLabel: {
    fontSize: 12,
    color: '#EC4899',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#BE185D',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#EC4899',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryColor: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BE185D',
    flex: 1,
  },
  categoryStats: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
    position: 'relative',
  },
  masteredProgress: {
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#BE185D',
    minWidth: 35,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 11,
    color: '#EC4899',
  },
  achievementCard: {
    flexDirection: 'row',
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
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: '#EC4899',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 11,
    color: '#F472B6',
  },
  exportCard: {
    backgroundColor: '#FFFFFF',
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  exportButtonText: {
    fontSize: 14,
    color: '#BE185D',
    marginLeft: 12,
  },
});</parameter>