import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to local chat history
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3001/chat', // your backend URL
        {
          messages: newMessages, // send messages only, backend sets model
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Extract AI reply from response and add to messages
      const aiReply = response.data.choices[0].message;
      setMessages([...newMessages, aiReply]);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>MathBot AI</Text>

        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />

        <Pressable style={styles.button} onPress={sendMessage} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Thinking...' : 'Send'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0ff',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    marginBottom: 15,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
