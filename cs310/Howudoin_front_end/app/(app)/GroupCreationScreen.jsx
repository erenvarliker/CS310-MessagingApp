import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

export default function GroupCreationScreen() {
  const [groupName, setGroupName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await api.get('/friends', { headers });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error.message);
      }
    };

    fetchFriends();
  }, []);

  const toggleMemberSelection = (email) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert('Group name is required');
      return;
    }
    if (selectedMembers.length === 0) {
      alert('Please select at least one friend to add to the group');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const requestBody = {
        groupName,
        memberEmails: selectedMembers,
      };

      const response = await api.post('/groups/create', requestBody, { headers });
      alert('Group created successfully!');
      router.push('/home'); // Navigate back to Home
    } catch (error) {
      console.error('Error creating group:', error.message);
      alert('Failed to create group. Please try again.');
    }
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.friendItem,
        selectedMembers.includes(item.email) && styles.selectedFriendItem,
      ]}
      onPress={() => toggleMemberSelection(item.email)}
    >
      <Text style={styles.friendItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Text style={styles.subHeader}>Select Friends to Add</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.email}
        renderItem={renderFriendItem}
        style={styles.friendList}
      />
      <Button title="Create Group" onPress={createGroup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#DAD5F4',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'indigo',
  

  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'indigo',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  friendList: {
    marginBottom: 16,
  },
  friendItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginVertical: 5,
  },
  selectedFriendItem: {
    backgroundColor: '#C9C1EE',
  },
  friendItemText: {
    fontSize: 16,
    color: '#333',
  },
});
