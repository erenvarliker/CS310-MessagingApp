import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '@/services/api';

const GroupDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId } = route.params; // Accessing groupId passed from GroupListScreen
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        console.log('Fetching all groups for user...');
        const response = await api.get('/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Find the specific group from the list of all groups
        const group = response.data.find((g) => g.id === groupId);

        if (group) {
          setGroupDetails(group);
          console.log('Group details fetched:', group);
        } else {
          console.warn('Group not found in fetched list.');
        }
      } catch (error) {
        console.error('Error fetching group details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const navigateToGroupChat = () => {
    navigation.navigate('GroupMessageScreen', { groupId: groupId, groupName: groupDetails?.name });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading group details...</Text>
      ) : groupDetails ? (
        <View>
          <View style={styles.detailsBox}>
            <Text style={styles.header}>{groupDetails.name}</Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Created On:</Text>{' '}
              {new Date(groupDetails.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Created By:</Text> {groupDetails.creatorEmail}
            </Text>
            <Text style={styles.membersHeader}>Members:</Text>
            {groupDetails.members && groupDetails.members.length > 0 ? (
              groupDetails.members.map((memberEmail) => (
                <Text key={memberEmail} style={styles.memberItem}>
                  {memberEmail}
                </Text>
              ))
            ) : (
              <Text>No members found.</Text>
            )}
          </View>
          {/* Chat Now Button */}
          <TouchableOpacity style={styles.chatButton} onPress={navigateToGroupChat}>
            <Text style={styles.chatButtonText}>Chat Now!</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>Group details not found.</Text>
      )}
    </View>
  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#DAD5F4',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#4B0082',
  },
  detailsBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#4B0082',
  },
  membersHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#4B0082',
  },
  memberItem: {
    fontSize: 16,
    marginTop: 4,
    color: '#555',
  },
  chatButton: {
    marginTop: 20,
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4B0082',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});
