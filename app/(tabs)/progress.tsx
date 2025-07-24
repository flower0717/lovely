import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, ChartBar as BarChart3, Clock, Flame, BookOpen } from 'lucide-react-native';

const weeklyData = [
  { day: '月', studied: 12, correct: 10 },
  { day: '火', studied: 15, correct: 13 },
  { day: '水', studied: 8, correct: 7 },
  { day: '木', studied: 20, correct: 18 },
  { day: '金', studied: 18, correct: 15 },
  { day: '土', studied: 25, correct: 22 },
  { day: '日', studied: 22, correct: 19 },
];

const monthlyStats = {
  totalCards: 420,
  studiedCards: 285,
  correctRate: 78,
  streakDays: 15,
  totalStudyTime: 1240, // minutes
};

const categoryProgress = [
  { name: '基本動詞', total: 50, mastered: 35, studying: 12, color: '#3B82F6' },
  { name: '日常会話', total: 40, mastered: 28, studying: 8, color: '#10B981' },
  { name: '文法', total: 30, mastered: 15, studying: 10, color: '#F59E0B' },
  { name: 'TOEIC', total: 60, mastered: 20, studying: 25, color: '#EF4444' },
  { name: 'ビジネス英語', total: 25, mastered: 8, studying: 12, color: '#8B5CF6' },
];

const achievements = [
  { id: 1, title: '初回学習完了', description: '最初のカードを学習しました', date: '2024-01-01', icon: '🎯' },
  { id: 2, title: '7日連続学習', description: '1週間毎日学習を続けました', date: '2024-01-08', icon: '🔥' },
  { id: 3, title: '100単語マスター', description: '100個の単語を覚えました', date: '2024-01-15', icon: '📚' },
  { id: 4, title: '正解率80%達成', description: '正解率が80%を超えました', date: '2024-01-20', icon: '⭐' },
];

export default function ProgressScreen() {
  const maxStudied = Math.max(...weeklyData.map(d => d.studied));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TrendingUp size={28} color="#3B82F6" />
          <Text style={styles.title}>学習進捗</Text>
        </View>

        {/* Overall Stats */}
        <View style={styles.overallStatsCard}>
          <Text style={styles.cardTitle}>今月の学習状況</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{monthlyStats.studiedCards}</Text>
              <Text style={styles.statLabel}>学習済みカード</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={24} color="#10B981" />
              <Text style={styles.statValue}>{monthlyStats.correctRate}%</Text>
              <Text style={styles.statLabel}>正解率</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{monthlyStats.streakDays}</Text>
              <Text style={styles.statLabel}>連続学習日数</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>{Math.floor(monthlyStats.totalStudyTime / 60)}h</Text>
              <Text style={styles.statLabel}>総学習時間</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>週間学習グラフ</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={data.day} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.correctBar,
                        { height: (data.correct / maxStudied) * 120 }
                      ]}
                    />
                    <View 
                      style={[
                        styles.totalBar,
                        { height: (data.studied / maxStudied) * 120 }
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
                <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.legendText}>学習数</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>正解数</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カテゴリ別進捗</Text>
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
                        width: `${(category.mastered / category.total) * 100}%`,
                        backgroundColor: category.color
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.studyingProgress,
                      { 
                        width: `${(category.studying / category.total) * 100}%`,
                        backgroundColor: `${category.color}40`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round((category.mastered / category.total) * 100)}%
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

        {/* Study Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学習カレンダー</Text>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.calendarTitle}>1月の学習記録</Text>
            </View>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <View 
                  key={day}
                  style={[
                    styles.calendarDay,
                    day <= 20 ? styles.studiedDay : styles.unstudiedDay
                  ]}
                >
                  <Text style={[
                    styles.calendarDayText,
                    day <= 20 ? styles.studiedDayText : styles.unstudiedDayText
                  ]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>学習済み</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#E2E8F0' }]} />
                <Text style={styles.legendText}>未学習</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>達成記録</Text>
          {achievements.map((achievement) => (
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
          <Text style={styles.sectionTitle}>データエクスポート</Text>
          <View style={styles.exportCard}>
            <TouchableOpacity style={styles.exportButton}>
              <BarChart3 size={20} color="#3B82F6" />
              <Text style={styles.exportButtonText}>学習データをCSVで出力</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Award size={20} color="#3B82F6" />
              <Text style={styles.exportButtonText}>達成記録をテキストで出力</Text>
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
    color: '#1E293B',
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
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
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
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  correctBar: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
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
    color: '#64748B',
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
    color: '#1E293B',
    flex: 1,
  },
  categoryStats: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
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
  studyingProgress: {
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 35,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 11,
    color: '#64748B',
  },
  calendarCard: {
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
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studiedDay: {
    backgroundColor: '#10B981',
  },
  unstudiedDay: {
    backgroundColor: '#E2E8F0',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  studiedDayText: {
    color: '#FFFFFF',
  },
  unstudiedDayText: {
    color: '#64748B',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
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
    backgroundColor: '#FEF3C7',
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
    color: '#1E293B',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 11,
    color: '#94A3B8',
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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  exportButtonText: {
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 12,
  },
});