import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Heart, Activity, Moon, Footprints, Calendar, Info } from 'lucide-react-native';

const healthMetrics = [
  { id: 1, name: '総合スコア', value: 85, unit: '点', change: +5, icon: Heart, color: '#2563EB' },
  { id: 2, name: '活動量', value: 8245, unit: '歩', change: +1200, icon: Footprints, color: '#10B981' },
  { id: 3, name: '睡眠質', value: 7.2, unit: '時間', change: -0.3, icon: Moon, color: '#8B5CF6' },
  { id: 4, name: '心拍数', value: 72, unit: 'bpm', change: +2, icon: Activity, color: '#EF4444' },
];

const weeklyData = [
  { day: '月', score: 78 },
  { day: '火', score: 82 },
  { day: '水', score: 80 },
  { day: '木', score: 85 },
  { day: '金', score: 88 },
  { day: '土', score: 84 },
  { day: '日', score: 85 },
];

const recommendations = [
  {
    id: 1,
    title: '水分補給の改善',
    description: '1日の水分摂取量が不足しています。2リットルを目標にしましょう。',
    priority: 'high',
  },
  {
    id: 2,
    title: '睡眠時間の調整',
    description: '理想的な睡眠時間は7-8時間です。就寝時間を30分早めることをお勧めします。',
    priority: 'medium',
  },
  {
    id: 3,
    title: '運動量の維持',
    description: '現在の活動量は良好です。この調子で継続しましょう。',
    priority: 'low',
  },
];

export default function HealthScoreScreen() {
  const maxScore = Math.max(...weeklyData.map(d => d.score));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BarChart3 size={28} color="#2563EB" />
          <Text style={styles.title}>健康スコア</Text>
        </View>

        {/* Main Score */}
        <View style={styles.mainScoreCard}>
          <Text style={styles.mainScoreLabel}>今日の総合スコア</Text>
          <Text style={styles.mainScoreValue}>85</Text>
          <View style={styles.scoreChange}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.scoreChangeText}>昨日より +5点</Text>
          </View>
          <Text style={styles.scoreDescription}>とても良好な状態です！</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>詳細メトリクス</Text>
          <View style={styles.metricsGrid}>
            {healthMetrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                  <metric.icon size={20} color={metric.color} />
                </View>
                <Text style={styles.metricName}>{metric.name}</Text>
                <Text style={styles.metricValue}>
                  {metric.value.toLocaleString()} {metric.unit}
                </Text>
                <Text style={[
                  styles.metricChange,
                  metric.change >= 0 ? styles.positiveChange : styles.negativeChange
                ]}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>週間推移</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={data.day} style={styles.chartBar}>
                  <View 
                    style={[
                      styles.bar,
                      { height: (data.score / maxScore) * 120 }
                    ]}
                  />
                  <Text style={styles.chartLabel}>{data.day}</Text>
                  <Text style={styles.chartValue}>{data.score}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Health Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>改善提案</Text>
          {recommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={[
                  styles.priorityBadge,
                  rec.priority === 'high' ? styles.highPriority :
                  rec.priority === 'medium' ? styles.mediumPriority : styles.lowPriority
                ]}>
                  <Text style={[
                    styles.priorityText,
                    rec.priority === 'high' ? styles.highPriorityText :
                    rec.priority === 'medium' ? styles.mediumPriorityText : styles.lowPriorityText
                  ]}>
                    {rec.priority === 'high' ? '重要' :
                     rec.priority === 'medium' ? '中程度' : '軽微'}
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
            </View>
          ))}
        </View>

        {/* Data Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ連携</Text>
          <View style={styles.sourceCard}>
            <Info size={20} color="#64748B" />
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceTitle}>連携中のデバイス</Text>
              <Text style={styles.sourceDescription}>
                Apple Watch、iPhone ヘルスケア、睡眠トラッカー
              </Text>
            </View>
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
  mainScoreCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mainScoreLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  mainScoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  scoreChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreChangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  scoreDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricName: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
  bar: {
    width: 24,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginBottom: 8,
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
  recommendationCard: {
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
  recommendationHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  mediumPriority: {
    backgroundColor: '#FEF3C7',
  },
  lowPriority: {
    backgroundColor: '#ECFDF5',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  highPriorityText: {
    color: '#DC2626',
  },
  mediumPriorityText: {
    color: '#D97706',
  },
  lowPriorityText: {
    color: '#059669',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sourceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  sourceDescription: {
    fontSize: 12,
    color: '#64748B',
  },
});