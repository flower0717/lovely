import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookOpen, Tag, FileText, Save, X } from 'lucide-react-native';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashCard, Category } from '@/types/card';
import { generateId } from '@/utils/cardUtils';
import { router } from 'expo-router';

const cardTemplates = [
  { id: 1, name: '英単語', front: '英語', back: '日本語' },
  { id: 2, name: '日本語→英語', front: '日本語', back: '英語' },
  { id: 3, name: '文法問題', front: '問題文', back: '答え・解説' },
  { id: 4, name: 'フレーズ', front: '英語フレーズ', back: '意味・使い方' },
];

const defaultCategories: Category[] = [
  { id: '1', name: '高校英単語', color: '#EC4899' },
  { id: '2', name: '不規則動詞', color: '#F472B6' },
  { id: '3', name: '熟語・イディオム', color: '#FB7185' },
  { id: '4', name: '構文', color: '#F97316' },
];

export default function AddCardScreen() {
  const [cards, setCards] = useLocalStorage<FlashCard[]>('flashcards', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
  
  const [selectedTemplate, setSelectedTemplate] = useState(cardTemplates[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [memo, setMemo] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const saveCard = () => {
    if (!frontText.trim() || !backText.trim()) {
      Alert.alert('入力エラー', 'カードの表面と裏面の両方を入力してください。');
      return;
    }

    const newCard: FlashCard = {
      id: generateId(),
      front: frontText.trim(),
      back: backText.trim(),
      category: selectedCategory.name,
      memo: memo.trim() || undefined,
      difficulty: 'medium',
      wrongCount: 0,
      isLearned: false,
      createdAt: new Date(),
    };

    setCards([...cards, newCard]);
    
    Alert.alert(
      'カード保存完了！ 🌸',
      `「${selectedCategory.name}」カテゴリに新しいカードを追加しました。`,
      [
        { text: 'もう一枚作る', onPress: clearForm },
        { text: 'ホームに戻る', onPress: () => router.push('/') }
      ]
    );
  };

  const clearForm = () => {
    setFrontText('');
    setBackText('');
    setMemo('');
  };

  const addNewCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('入力エラー', 'カテゴリ名を入力してください。');
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: '#EC4899',
    };

    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory);
    setShowNewCategory(false);
    setNewCategoryName('');
    Alert.alert('カテゴリ追加完了 💖', `「${newCategoryName}」を追加しました。`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Plus size={28} color="#EC4899" />
          <Text style={styles.title}>新しいカードを作成 ✨</Text>
        </View>

        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カードタイプ 📋</Text>
          <View style={styles.templateGrid}>
            {cardTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate.id === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template)}
              >
                <Text style={[
                  styles.templateName,
                  selectedTemplate.id === template.id && styles.selectedTemplateText
                ]}>
                  {template.name}
                </Text>
                <Text style={[
                  styles.templateDescription,
                  selectedTemplate.id === template.id && styles.selectedTemplateDescription
                ]}>
                  {template.front} → {template.back}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>カテゴリ 🏷️</Text>
            <TouchableOpacity 
              style={styles.addCategoryButton}
              onPress={() => setShowNewCategory(true)}
            >
              <Plus size={16} color="#EC4899" />
              <Text style={styles.addCategoryText}>新規</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  { backgroundColor: selectedCategory.id === category.id ? category.color : '#FDF2F8' }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory.id === category.id ? '#FFFFFF' : category.color }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Category Modal */}
        {showNewCategory && (
          <View style={styles.newCategoryModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>新しいカテゴリ 🎀</Text>
              <TouchableOpacity onPress={() => setShowNewCategory(false)}>
                <X size={24} color="#EC4899" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.categoryInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="カテゴリ名を入力"
              autoFocus
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewCategory}>
              <Text style={styles.addButtonText}>追加</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Card Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カード内容 📝</Text>
          
          <View style={styles.cardPreview}>
            <View style={styles.cardSide}>
              <Text style={styles.cardSideLabel}>表面（{selectedTemplate.front}）</Text>
              <TextInput
                style={styles.cardInput}
                value={frontText}
                onChangeText={setFrontText}
                placeholder={`${selectedTemplate.front}を入力してください`}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.cardSide}>
              <Text style={styles.cardSideLabel}>裏面（{selectedTemplate.back}）</Text>
              <TextInput
                style={styles.cardInput}
                value={backText}
                onChangeText={setBackText}
                placeholder={`${selectedTemplate.back}を入力してください`}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Memo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>メモ（覚え方のコツなど）💡</Text>
          <TextInput
            style={styles.memoInput}
            value={memo}
            onChangeText={setMemo}
            placeholder="覚え方のコツや例文、関連情報などを自由に記入してください"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.clearButtonText}>クリア</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>カードを保存</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <FileText size={20} color="#EC4899" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>効果的なカード作成のコツ 💫</Text>
            <Text style={styles.tipsText}>
              • 一つのカードには一つの概念だけを入れる{'\n'}
              • 例文や使用場面を含めると記憶に残りやすい{'\n'}
              • 自分の言葉でメモを書くと理解が深まる{'\n'}
              • 定期的に見直して内容を更新する
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
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BE185D',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EC4899',
    marginLeft: 4,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FCE7F3',
  },
  selectedTemplate: {
    borderColor: '#EC4899',
    backgroundColor: '#FCE7F3',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 4,
  },
  selectedTemplateText: {
    color: '#EC4899',
  },
  templateDescription: {
    fontSize: 12,
    color: '#EC4899',
  },
  selectedTemplateDescription: {
    color: '#BE185D',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  newCategoryModal: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BE185D',
  },
  categoryInput: {
    borderWidth: 1,
    borderColor: '#FCE7F3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#EC4899',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardPreview: {
    gap: 16,
  },
  cardSide: {
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
  cardSideLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
    marginBottom: 8,
  },
  cardInput: {
    fontSize: 16,
    color: '#BE185D',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  memoInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#BE185D',
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EC4899',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#FCE7F3',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
  },
  tipsContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BE185D',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#EC4899',
  },
});</parameter>