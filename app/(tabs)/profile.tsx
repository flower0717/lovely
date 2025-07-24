import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Download, Share2, Trash2, RefreshCw, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashCard, StudySession, Category } from '@/types/card';
import { calculateCorrectRate, getStreakDays, exportCardsToCSV } from '@/utils/cardUtils';

export default function ProfileScreen() {
  const [cards, setCards] = useLocalStorage<FlashCard[]>('flashcards', []);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('studySessions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', []);

  const learnedCards = cards.filter(card => card.isLearned);
  const correctRate = calculateCorrectRate(sessions);
  const streakDays = getStreakDays(sessions);
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.totalTime, 0);

  const userStats = [
    { label: '総学習日数', value: `${sessions.length}日` },
    { label: '作成カード数', value: `${cards.length}枚` },
    { label: '習得済みカード', value: `${learnedCards.length}枚` },
    { label: '平均正解率', value: `${correctRate}%` },
  ];

  const handleExportCards = () => {
    if (cards.length === 0) {
      Alert.alert('エラー', 'エクスポートするカードがありません。');
      return;
    }

    Alert.alert(
      'データエクスポート 📊',
      'カードデータをCSV形式でエクスポートしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'エクスポート', 
          onPress: () => {
            const csvData = exportCardsToCSV(cards);
            console.log('CSV Data:', csvData);
            Alert.alert('完了 ✨', 'データをエクスポートしました');
          }
        }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ データリセット',
      'すべての学習データが削除されます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive', 
          onPress: () => {
            setCards([]);
            setSessions([]);
            setCategories([]);
            Alert.alert('完了 🌸', 'データをリセットしました');
          }
        }
      ]
    );
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'export-cards':
        handleExportCards();
        break;
      case 'share-progress':
        Alert.alert('学習記録共有 💌', '学習記録を共有する機能を準備中です');
        break;
      case 'reset-data':
        handleResetData();
        break;
      default:
        Alert.alert('準備中 🌸', 'この機能は準備中です');
    }
  };

  const profileSections = [
    {
      title: '学習データ',
      items: [
        { icon: Download, label: 'カードデータをエクスポート', action: 'export-cards' },
        { icon: Share2, label: '学習記録を共有', action: 'share-progress' },
        { icon: RefreshCw, label: 'データを同期', action: 'sync-data' },
      ]
    },
    {
      title: '設定',
      items: [
        { icon: Bell, label: '通知設定', action: 'notifications' },
        { icon: Settings, label: '学習設定', action: 'study-settings' },
        { icon: Shield, label: 'プライバシー設定', action: 'privacy' },
      ]
    },
    {
      title: 'サポート',
      items: [
        { icon: HelpCircle, label: 'ヘルプ・使い方', action: 'help' },
        { icon: Trash2, label: 'データをリセット', action: 'reset-data' },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>高校生の英語学習者 🌸</Text>
          <Text style={styles.userSubtitle}>My English Booster ユーザー</Text>
          <Text style={styles.joinDate}>2024年1月より利用開始</Text>
        </View>

        {/* User Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>学習統計 📊</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Study Settings Quick View */}
        <View style={styles.settingsPreviewCard}>
          <Text style={styles.settingsTitle}>学習設定 ⚙️</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>1日の目標カード数</Text>
            <Text style={styles.settingValue}>15枚</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>復習間隔</Text>
            <Text style={styles.settingValue}>3日</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>通知</Text>
            <Text style={[styles.settingValue, styles.enabledText]}>ON</Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder
                  ]}
                  onPress={() => handleMenuAction(item.action)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[
                      styles.menuIcon,
                      item.action === 'reset-data' && styles.dangerIcon
                    ]}>
                      <item.icon 
                        size={20} 
                        color={item.action === 'reset-data' ? '#EF4444' : '#EC4899'} 
                      />
                    </View>
                    <Text style={[
                      styles.menuLabel,
                      item.action === 'reset-data' && styles.dangerText
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#F472B6" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <Text style={styles.appName}>My English Booster 💖</Text>
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>
            <Text style={styles.appDescription}>
              高校生の英語学習を効率化するフラッシュカードアプリ。苦手分野を克服し、継続的な学習をサポートします 🌸
            </Text>
            <View style={styles.appFeatures}>
              <Text style={styles.featureTitle}>主な機能 ✨</Text>
              <Text style={styles.featureText}>
                • カスタムフラッシュカード作成{'\n'}
                • スマート復習システム{'\n'}
                • 学習進捗の可視化{'\n'}
                • データエクスポート機能
              </Text>
            </View>
          </View>
        </View>

        {/* Data Policy */}
        <View style={styles.section}>
          <View style={styles.policyCard}>
            <Shield size={24} color="#34D399" />
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>データポリシー 🔒</Text>
              <Text style={styles.policyText}>
                すべての学習データはお使いのデバイスにローカル保存されます。データは外部サーバーに送信されることはありません。
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            継続は力なり。毎日の積み重ねで英語力を向上させましょう！ 💪✨
          </Text>
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#EC4899',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#F472B6',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  statsTitle: {
    fontSize: 16,
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
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#F472B6',
    textAlign: 'center',
  },
  settingsPreviewCard: {
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
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    color: '#EC4899',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
  },
  enabledText: {
    color: '#34D399',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BE185D',
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  menuLabel: {
    fontSize: 14,
    color: '#BE185D',
    fontWeight: '500',
  },
  dangerText: {
    color: '#EF4444',
  },
  appInfoCard: {
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
  appInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BE185D',
  },
  appVersion: {
    fontSize: 14,
    color: '#EC4899',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#EC4899',
    lineHeight: 20,
    marginBottom: 16,
  },
  appFeatures: {
    borderTopWidth: 1,
    borderTopColor: '#FCE7F3',
    paddingTop: 16,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#EC4899',
    lineHeight: 18,
  },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34D399',
  },
  policyContent: {
    marginLeft: 12,
    flex: 1,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#EC4899',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});</parameter>