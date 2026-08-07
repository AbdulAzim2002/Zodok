import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TestLayout() {

  const colorScheme = useColorScheme();
  

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
