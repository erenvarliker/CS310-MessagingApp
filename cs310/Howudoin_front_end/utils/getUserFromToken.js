import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const decodedToken = jwtDecode(token); // Decode the JWT token
    console.log('Decoded Token:', decodedToken);

    // Return essential user info (use decoded data as needed)
    return {
      id: decodedToken.sub, // Assuming the backend provides email as `sub` in the token
      email: decodedToken.sub, // Email in `sub` field
    };
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
};

export default getUserFromToken;
