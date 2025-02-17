import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '@/services/api';

const GroupListScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        console.log('Fetching groups for the user...');
        const response = await api.get('/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setGroups(response.data);
          console.log('Groups fetched:', response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching groups:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Groups</Text>
      {loading ? (
        <Text>Loading groups...</Text>
      ) : groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => {
                console.log('Navigating to GroupDetails with groupId:', item.id);
                navigation.navigate('GroupDetails', { groupId: item.id });
              }}
            >
              <Text style={styles.groupName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No groups found.</Text>
      )}
    </View>
  );
};

export default GroupListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#DAD5F4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'indigo',
  },
  groupItem: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'indigo',
  },
});
