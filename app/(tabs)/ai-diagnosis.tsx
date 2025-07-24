import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquareMore, Send, Bot, User, Clock, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

const mockConversation = [
  { id: 1, type: 'bot', message: 'こんにちは！今日の体調はいかがですか？どのような症状でお困りでしょうか？' },
  { id: 2, type: 'user', message: '昨日から喉が痛くて、少し熱っぽい気がします。' },
  { id: 3, type: 'bot', message: '喉の痛みと発熱の症状ですね。痛みは飲み込む時に特に強くなりますか？' },
  { id: 4, type: 'user', message: 'はい、飲み物を飲む時に痛みを感じます。' },
  { id: 5, type: 'bot', message: 'かしこまりました。体温は測定されましたか？また、他に咳や鼻水などの症状はありますか？' },
];

export default function AIDiagnosisScreen() {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState(mockConversation);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: conversation.length + 1,
        type: 'user' as const,
        message: inputText.trim(),
      };
      setConversation([...conversation, newMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: conversation.length + 2,
          type: 'bot' as const,
          message: 'ありがとうございます。症状を詳しく教えていただき、分析しています。しばらくお待ちください。',
        };
        setConversation(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MessageSquareMore size={28} color="#2563EB" />
        <Text style={styles.title}>AI問診</Text>
      </View>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {conversation.map((item) => (
          <View key={item.id} style={[
            styles.messageContainer,
            item.type === 'user' ? styles.userMessage : styles.botMessage
          ]}>
            <View style={[
              styles.messageIcon,
              item.type === 'user' ? styles.userIcon : styles.botIcon
            ]}>
              {item.type === 'user' ? 
                <User size={16} color="#FFFFFF" /> : 
                <Bot size={16} color="#FFFFFF" />
              }
            </View>
            <View style={[
              styles.messageBubble,
              item.type === 'user' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                item.type === 'user' ? styles.userText : styles.botText
              ]}>
                {item.message}
              </Text>
            </View>
          </View>
        ))}
        
        {/* Diagnosis Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>現在の分析状況</Text>
          <View style={styles.analysisItem}>
            <View style={styles.analysisIcon}>
              <Clock size={16} color="#F59E0B" />
            </View>
            <Text style={styles.analysisText}>症状の詳細を確認中...</Text>
          </View>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>詳細な問診を続ける</Text>
            <ChevronRight size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="症状や気になることを入力してください..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
          onPress={sendMessage}
        >
          <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#94A3B8"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  userIcon: {
    backgroundColor: '#2563EB',
  },
  botIcon: {
    backgroundColor: '#10B981',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1E293B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  analysisText: {
    fontSize: 14,
    color: '#64748B',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 15,
    color: '#1E293B',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  sendButtonActive: {
    backgroundColor: '#2563EB',
  },
});