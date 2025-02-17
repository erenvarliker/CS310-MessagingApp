import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

const AddFriend = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  // Track accepted status for each incoming request: { [email]: boolean }
  const [acceptedStatus, setAcceptedStatus] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch incoming requests
        const incomingResponse = await api.get('/friends/requests/incoming', { headers });
        if (incomingResponse.data.length === 0) {
          console.log('No incoming friend requests');
        }
        setIncomingRequests(incomingResponse.data);

        // Fetch outgoing requests
        const outgoingResponse = await api.get('/friends/requests/outgoing', { headers });
        setOutgoingRequests(outgoingResponse.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error.message);
      }
    };

    fetchRequests();
  }, []);

  // Send a friend request
  const sendFriendRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.post('/friends/add', { email: friendEmail }, { headers });
      console.log(`Friend request sent to: ${friendEmail}`);

      // Immediately add this request to outgoing so the user sees it instantly
      setOutgoingRequests((prevRequests) => [
        ...prevRequests,
        { email: friendEmail }, // Minimal object; your backend may provide more fields
      ]);

      // Clear the input
      setFriendEmail('');
    } catch (error) {
      console.error('Error sending friend request:', error.message);
    }
  };

  const acceptFriendRequest = async (email) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
    
      await api.post('/friends/accept', { senderEmail: email }, { headers });
    
      // Remove the accepted request from the local array
      setIncomingRequests((prevRequests) =>
        prevRequests.filter(req => req.email !== email)
      );
  
      console.log(`Accepted friend request from: ${email}`);
    } catch (error) {
      console.error('Error accepting friend request:', error.message);
    }
  };
  

  const renderIncomingRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestEmail}>{item.email}</Text>
      {acceptedStatus[item.email] ? (
        // If this request has been accepted, show a confirmation label
        <Text style={{ color: 'green', marginLeft: 8 }}>Accepted</Text>
      ) : (
        // Otherwise, show the "Accept" button
        <Button
          title="Accept"
          onPress={() => acceptFriendRequest(item.email)}
        />
      )}
    </View>
  );

  const renderOutgoingRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestEmail}>{item.email}</Text>
      {/* If you want to cancel outgoing requests, you could implement a similar function here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Friend</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's email"
        value={friendEmail}
        // 1) Turn off auto-capitalization
        autoCapitalize="none"
        // 2) (Optional) Turn off autoCorrect
        autoCorrect={false}
        // 3) (Optional) Use email keyboard
        keyboardType="email-address"
        onChangeText={setFriendEmail}
        />
      
      <Button title="Add Friend" onPress={sendFriendRequest} />

      {/* --- Incoming Friend Requests --- */}
      <Text style={styles.subHeader}>Incoming Friend Requests</Text>
      {incomingRequests.length === 0 ? (
        <Text style={styles.emptyMessage}>No incoming friend requests</Text>
      ) : (
        <FlatList
          data={incomingRequests}
          keyExtractor={(item) => item.email}
          renderItem={renderIncomingRequestItem}
        />
      )}

      {/* --- Outgoing Friend Requests --- */}
      <Text style={styles.subHeader}>Outgoing Friend Requests</Text>
      {outgoingRequests.length === 0 ? (
        <Text style={styles.emptyMessage}>No outgoing friend requests</Text>
      ) : (
        <FlatList
          data={outgoingRequests}
          keyExtractor={(item) => item.email}
          renderItem={renderOutgoingRequestItem}
        />
      )}
    </View>
  );
};

export default AddFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#C9C1EE',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'indigo',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ECE9F9',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'indigo',
    marginVertical: 5,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECE9F9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  requestEmail: {
    flex: 1, 
    fontSize: 16,
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: 'gray',
  },
});
