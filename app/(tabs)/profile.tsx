import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Download, Share2, Trash2, RefreshCw, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

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

const userStats = [
  { label: '総学習日数', value: '45日' },
  { label: '作成カード数', value: '142枚' },
  { label: '学習済みカード', value: '98枚' },
  { label: '平均正解率', value: '78%' },
];

const studySettings = {
  dailyGoal: 20,
  reviewInterval: 3,
  notificationsEnabled: true,
  soundEnabled: true,
};

export default function ProfileScreen() {
  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'export-cards':
        Alert.alert(
          'データエクスポート',
          'カードデータをCSV形式でエクスポートしますか？',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: 'エクスポート', onPress: () => Alert.alert('完了', 'データをエクスポートしました') }
          ]
        );
        break;
      case 'share-progress':
        Alert.alert('学習記録共有', '学習記録を共有する機能を準備中です');
        break;
      case 'reset-data':
        Alert.alert(
          '⚠️ データリセット',
          'すべての学習データが削除されます。この操作は取り消せません。',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: '削除', style: 'destructive', onPress: () => Alert.alert('完了', 'データをリセットしました') }
          ]
        );
        break;
      default:
        Alert.alert('準備中', 'この機能は準備中です');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>英語学習者</Text>
          <Text style={styles.userSubtitle}>My English Booster ユーザー</Text>
          <Text style={styles.joinDate}>2024年1月より利用開始</Text>
        </View>

        {/* User Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>学習統計</Text>
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
          <Text style={styles.settingsTitle}>学習設定</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>1日の目標カード数</Text>
            <Text style={styles.settingValue}>{studySettings.dailyGoal}枚</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>復習間隔</Text>
            <Text style={styles.settingValue}>{studySettings.reviewInterval}日</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>通知</Text>
            <Text style={[
              styles.settingValue,
              studySettings.notificationsEnabled ? styles.enabledText : styles.disabledText
            ]}>
              {studySettings.notificationsEnabled ? 'ON' : 'OFF'}
            </Text>
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
                        color={item.action === 'reset-data' ? '#EF4444' : '#64748B'} 
                      />
                    </View>
                    <Text style={[
                      styles.menuLabel,
                      item.action === 'reset-data' && styles.dangerText
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
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
              <Text style={styles.appName}>My English Booster</Text>
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>
            <Text style={styles.appDescription}>
              英語学習を効率化するフラッシュカードアプリ。苦手分野を克服し、継続的な学習をサポートします。
            </Text>
            <View style={styles.appFeatures}>
              <Text style={styles.featureTitle}>主な機能</Text>
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
            <Shield size={24} color="#10B981" />
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>データポリシー</Text>
              <Text style={styles.policyText}>
                すべての学習データはお使いのデバイスにローカル保存されます。データは外部サーバーに送信されることはありません。
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#64748B" />
            <Text style={styles.logoutText}>アプリを終了</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            継続は力なり。毎日の積み重ねで英語力を向上させましょう！
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#94A3B8',
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
    color: '#1E293B',
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
    color: '#64748B',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  enabledText: {
    color: '#10B981',
  },
  disabledText: {
    color: '#EF4444',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
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
    borderBottomColor: '#F1F5F9',
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
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  menuLabel: {
    fontSize: 14,
    color: '#1E293B',
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
    color: '#1E293B',
  },
  appVersion: {
    fontSize: 14,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  appFeatures: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  policyContent: {
    marginLeft: 12,
    flex: 1,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});