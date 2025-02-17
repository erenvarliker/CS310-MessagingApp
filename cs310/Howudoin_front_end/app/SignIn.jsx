import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/api';
import Applogo from '@/assets/images/Applogo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await login(email, password);
  
      // Store token and email in AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userEmail', email);
  


    
      console.log('Login successful:', response);
      router.push('/home'); // Navigate to home
    } catch (error) {
      console.error('Login Error:', error.message);
      Alert.alert(
        'Login Failed',
        error.response?.data?.error || 'Unable to login. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Applogo} style={styles.image} />
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} color="#ADD8E6" />
      <View style={{ marginVertical: 0 }} />
      <Button
        title="Dont have an account? Sign up!"
        onPress={() => router.push('/SignUp')} // Navigate to Sign Up
        color="#ADD8E6"
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'indigo',
    padding: 16,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  header: {
    color: 'white',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
  },
});
