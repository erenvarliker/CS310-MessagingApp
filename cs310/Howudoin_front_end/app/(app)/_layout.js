import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* Define all your screens here */}

      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="FriendsList" options={{ title: 'Friends List' }} />
      <Stack.Screen name="FriendRequestScreen" options={{ title: 'Friend Request' }} />
      <Stack.Screen name="GroupCreationScreen" options={{ title: 'Group Creation' }} />
      <Stack.Screen name="MessageScreen" options={{ title: 'Chat' }} />
      <Stack.Screen name="GroupListScreen" options={{ title: 'Group List' }} />
      <Stack.Screen name="GroupDetails" options={{ title: 'Group Details' }} />
      <Stack.Screen name="GroupMessageScreen" options={{ title: 'Group Chat' }} />
    </Stack>
  );
}
