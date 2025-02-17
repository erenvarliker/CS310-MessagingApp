import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Import your api.js

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from storage
        if (!token) {
          router.push('/SignIn');
          return;
        }
  
        const response = await api.get('/validate-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          console.log('Token is valid');
          router.push('/home'); // Redirect to home if token is valid
        } else {
          await AsyncStorage.removeItem('token'); // Clear invalid token
          await AsyncStorage.removeItem('userEmail'); // Clear user email
          router.push('/SignIn');
        }
      } catch (error) {
        console.error('Error validating token:', error.message);
        await AsyncStorage.removeItem('token'); // Clear token on error
        await AsyncStorage.removeItem('userEmail'); // Clear user email
        router.push('/SignIn');
      }
    };
  
    checkAuthStatus();
  }, []);
  

  if (loading) {
    // Show a loading indicator while checking auth status
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="indigo" />
        <Text>Checking Authentication...</Text>
        <View style={{ marginVertical: 10 }} />
        <Button
          title="Sign Up"
          onPress={() => router.push('/SignUp')} // Navigate to Sign Up
          color="purple"
        />
      </View>
    );
  }

  return null;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
});
