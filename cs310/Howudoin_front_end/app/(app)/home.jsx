import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HowUDoin?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/FriendRequestScreen')}
      >
        <Text style={styles.buttonText}>View Friend Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/FriendsList')}
      >
        <Text style={styles.buttonText}>View Friends List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/GroupCreationScreen')}
      >
        <Text style={styles.buttonText}>Create a Group</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.button}
       onPress={() => router.push('/GroupListScreen')}
        >
        <Text style={styles.buttonText}>View Groups</Text>
        </TouchableOpacity>
      </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DAD5F4',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    color: 'indigo'
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: 'indigo',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
