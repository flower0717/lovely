import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Eye, Ear, Heart, Scan, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

const analysisTypes = [
  { id: 'throat', name: '喉', icon: Heart, description: '喉の赤みや腫れを確認' },
  { id: 'skin', name: '肌', icon: Scan, description: '肌の状態や発疹を分析' },
  { id: 'eye', name: '目', icon: Eye, description: '目の充血や異常を検出' },
  { id: 'ear', name: '耳', icon: Ear, description: '耳の炎症や異常を確認' },
];

const mockResults = [
  {
    id: 1,
    type: '喉',
    date: '2024年1月15日',
    result: '正常',
    confidence: 92,
    status: 'normal',
    notes: '軽度の赤みが見られますが、正常範囲内です。',
  },
  {
    id: 2,
    type: '肌',
    date: '2024年1月14日',
    result: '要注意',
    confidence: 78,
    status: 'caution',
    notes: '軽度の発疹が確認されました。経過観察をお勧めします。',
  },
];

export default function CameraAnalysisScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraMode, setCameraMode] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={48} color="#64748B" />
          <Text style={styles.permissionTitle}>カメラのアクセスが必要です</Text>
          <Text style={styles.permissionText}>
            画像診断機能を使用するには、カメラへのアクセスを許可してください。
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>許可する</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const startAnalysis = (type: string) => {
    setSelectedType(type);
    setCameraMode(true);
  };

  const takePicture = () => {
    setCameraMode(false);
    Alert.alert('分析中', '画像を分析しています。しばらくお待ちください。', [
      { text: 'OK', onPress: () => setSelectedType(null) }
    ]);
  };

  if (cameraMode) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => setCameraMode(false)}
              >
                <Text style={styles.cameraButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>{selectedType}の撮影</Text>
              <View style={styles.placeholder} />
            </View>
            
            <View style={styles.cameraGuide}>
              <View style={styles.guideFrame} />
              <Text style={styles.guideText}>
                枠内に{selectedType}を合わせて撮影してください
              </Text>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Camera size={28} color="#2563EB" />
          <Text style={styles.title}>画像診断</Text>
        </View>

        {/* Analysis Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>診断メニュー</Text>
          <View style={styles.typeGrid}>
            {analysisTypes.map((type) => (
              <TouchableOpacity 
                key={type.id}
                style={styles.typeCard}
                onPress={() => startAnalysis(type.name)}
              >
                <type.icon size={32} color="#2563EB" />
                <Text style={styles.typeName}>{type.name}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>診断履歴</Text>
          {mockResults.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={[
                  styles.statusIcon,
                  result.status === 'normal' ? styles.normalStatus : styles.cautionStatus
                ]}>
                  {result.status === 'normal' ? 
                    <CheckCircle size={16} color="#10B981" /> :
                    <AlertTriangle size={16} color="#F59E0B" />
                  }
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultType}>{result.type}の診断</Text>
                  <Text style={styles.resultDate}>{result.date}</Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>{result.confidence}%</Text>
                </View>
              </View>
              <Text style={styles.resultText}>{result.result}</Text>
              <Text style={styles.resultNotes}>{result.notes}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>撮影のコツ</Text>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>より正確な診断のために</Text>
            <Text style={styles.instructionText}>
              • 十分な明るさで撮影してください{'\n'}
              • 対象部位がフレーム内に収まるようにしてください{'\n'}
              • 手ブレに注意して撮影してください{'\n'}
              • 複数の角度から撮影すると精度が向上します
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  typeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  typeDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  normalStatus: {
    backgroundColor: '#ECFDF5',
  },
  cautionStatus: {
    backgroundColor: '#FEF3C7',
  },
  resultInfo: {
    flex: 1,
  },
  resultType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  resultDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  confidenceContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  resultNotes: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  instructionCard: {
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
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  cameraButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cameraButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  cameraGuide: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  guideFrame: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  guideText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
  },
});