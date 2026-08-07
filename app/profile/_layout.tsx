// import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router';
import { View } from 'react-native';
import 'react-native-reanimated';

export default function PorfileLayoutt() {


  return (
    <View style={{height: '100%', width: '100%', backgroundColor: "#0C0C0D"}}>
      <Stack
        screenOptions={{
          headerShown: false,
          
        }}
      />
    </View>
  )
}