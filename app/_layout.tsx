// import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { useAuthContext } from '@/hooks/use-auth-context';
import { useStateContext } from '@/hooks/use-state-context';
import AuthProvider from '@/providers/auth-provider';
import StateProvider from '@/providers/state-provider';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useSegments } from 'expo-router';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const stateContext = useStateContext();
  const authContext = useAuthContext();

  // const [isReady, setIsReady] = useState(false);
  const pathname = useSegments();
  useEffect(() =>{
    if(pathname[0] == "(tabs)" && (pathname[1] == "home" || pathname[1] == "categories"))
      setStatusBarStyle('light')
    else
      setStatusBarStyle('dark')
  }, [pathname])

  useEffect(() => {
    if (!authContext.isLoading && !stateContext.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [authContext.isLoading, stateContext.isLoading]);

  // useEffect(()=>{
  //   console.log(authContext.isLoggedIn ? "Logged In" : "Not Logged In")
  // }, [authContext.isLoggedIn]);

  // useEffect(()=>{
  //   console.log(authContext.isLoading ? "Loading" : "Loaded")
  // }, [authContext.isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name='test'/> */}
      <Stack.Protected guard={!stateContext.onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={!authContext.isLoggedIn}>
        <Stack.Screen name='signIn' />
        <Stack.Screen name="signUp" />
      </Stack.Protected>
      <Stack.Protected guard={authContext.isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="category/[category]" />
        <Stack.Screen name='product/[product]' />
        <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  // const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    CreatoDisplay: require('@/assets/fonts/CreatoDisplay-Regular.otf'),
    CreatoDisplayItalic: require('@/assets/fonts/CreatoDisplay-RegularItalic.otf'),
    CreatoDisplayBold: require('@assets/fonts/CreatoDisplay-Bold.otf'),
    CreatoDisplayMedium: require('@assets/fonts/CreatoDisplay-Medium.otf')
  })

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <GestureHandlerRootView>
    {/* <ThemeProvider> */}
    <AuthProvider>
      <StateProvider>
          <KeyboardProvider>
            <StatusBar translucent style='dark'/>
            <RootNavigator/>
          </KeyboardProvider>
      </StateProvider>
    </AuthProvider>
    {/* </ThemeProvider> */}
    </GestureHandlerRootView>
  )
}