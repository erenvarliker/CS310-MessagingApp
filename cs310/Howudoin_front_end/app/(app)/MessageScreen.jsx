import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api'; // Axios instance

export default function MessageScreen() {
  const { friendEmail } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Fetch current user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) {
          console.error('Current user email not found in AsyncStorage');
          return;
        }
        console.log('Current User Email:', email);
        setCurrentUserEmail(email);
      } catch (error) {
        console.error('Error fetching user email from AsyncStorage:', error.message);
      }
    };
    fetchUserEmail();
  }, []);

  // Fetch and filter messages
  useEffect(() => {
    const fetchAndFilterMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
  
        console.log('Fetching all messages...');
        const response = await api.get('/messages', { headers });
        console.log('All Messages:', response.data);
  
        const filteredMessages = response.data.filter((msg) =>
          (msg.senderEmail === currentUserEmail && msg.recipientEmail === friendEmail) ||
          (msg.senderEmail === friendEmail && msg.recipientEmail === currentUserEmail)
        );
  
        console.log(`Filtered Messages for ${friendEmail}:`, filteredMessages);
  
        filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };
  
    if (currentUserEmail && friendEmail) {
      fetchAndFilterMessages();
    }
  }, [currentUserEmail, friendEmail]);
  

  // Send a message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const newMessage = {
        recipientEmail: friendEmail,
        content: messageText,
      };

      console.log('Sending message:', newMessage);
      const response = await api.post('/messages/send', newMessage, { headers });

      setMessages((prev) => [...prev, response.data]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderEmail === currentUserEmail ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {friendEmail}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderMessageItem}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C9C1EE', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', color: 'indigo', textAlign: 'center' },
  messageList: { flex: 1, marginVertical: 10 },
  messageBubble: { padding: 10, borderRadius: 8, marginVertical: 5, maxWidth: '80%' },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#ECE9F9' },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 12, color: '#555', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECE9F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: { flex: 1, fontSize: 16 },
  sendButton: {
    marginLeft: 8,
    backgroundColor: 'indigo',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
});
