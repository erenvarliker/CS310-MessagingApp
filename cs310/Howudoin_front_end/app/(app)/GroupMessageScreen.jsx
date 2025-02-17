import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api'; // Axios instance

const GroupMessageScreen = () => {
  const route = useRoute();
  const { groupId, groupName } = route.params; // Accessing groupId and groupName passed from GroupDetailsScreen
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Fetch current user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) throw new Error('User email not found');
        setCurrentUserEmail(email);
      } catch (error) {
        console.error('Error fetching user email:', error.message);
      }
    };

    fetchUserEmail();
  }, []);

  // Fetch group messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        console.log(`Fetching messages for group: ${groupId}`);
        const response = await api.get(`/groups/${groupId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data);
        console.log('Group messages fetched:', response.data);
      } catch (error) {
        console.error('Error fetching group messages:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [groupId]);

  // Send a message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const newMessage = {
        content: messageText, // Ensure this key matches what the backend expects
      };

      console.log('Sending message:', newMessage);

      // Use the correct endpoint
      const response = await api.post(`/groups/${groupId}/send`, newMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => [...prev, response.data]); // Append the new message
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderEmail === currentUserEmail;

    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {!isCurrentUser && (
          <Text style={styles.sender}>{item.senderEmail}</Text>
        )}
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat: {groupName}</Text>
      {loading ? (
        <Text>Loading messages...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderMessageItem}
          style={styles.messageList}
        />
      )}
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
};

export default GroupMessageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C9C1EE', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', color: 'indigo', textAlign: 'center' },
  messageList: { flex: 1, marginVertical: 10 },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A7F3D0', // Light green for sent messages
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECE9F9', // Light blue for received messages
  },
  sender: { fontSize: 14, fontWeight: 'bold', color: '#555' },
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
