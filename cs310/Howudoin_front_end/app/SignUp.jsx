import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '../services/api';
import Applogo from '@/assets/images/Applogo.png';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      console.log('Registering with:', { name, lastName, email, password });
      const response = await register(name, lastName, email, password);
      Alert.alert('Success', 'Registration successful! Please sign in.');
      router.push('/SignIn'); // Navigate to SignIn screen after success
    } catch (error) {
      console.error('Sign Up Error:', error.message);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || 'Unable to register. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Applogo} style={styles.image} />
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#ccc"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
        title="Back to Sign In"
        onPress={() => router.push('/SignIn')} // Navigate back to SignIn
      />
    </View>
  );
};

export default SignUp;

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
