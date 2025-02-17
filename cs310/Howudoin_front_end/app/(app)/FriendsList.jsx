import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FriendsList() {
  const router = useRouter();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.error('Token not found');
            return;
          }
      
          console.log('Fetching friends with token:', token);
      
          const response = await api.get('/friends', {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          console.log('Friends fetched:', response.data);
          setFriends(response.data || []);
        } catch (error) {
          console.error('Error fetching friends:', error.message);
          console.error('Error details:', error.response?.data || error);
        }
      };
      
    fetchFriends();
  }, []);

  const openChat = (friendEmail) => {
    router.push(`/MessageScreen?friendEmail=${friendEmail}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => openChat(item.email)}
    >
      <Text style={styles.friendItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends List</Text>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noFriends}>You have no friends yet!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#C9C1EE',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'indigo',
  },
  friendItem: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  friendItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noFriends: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});
