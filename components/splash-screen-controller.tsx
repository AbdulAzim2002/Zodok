import { useAuthContext } from '@/hooks/use-auth-context'
import { useStateContext } from '@/hooks/use-state-context'
import { SplashScreen } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const authContext = useAuthContext()
  const stateContext = useStateContext()

  if (!(authContext.isLoading || stateContext.isLoading) ) {
    setTimeout(()=>{
      SplashScreen.hideAsync()
    }, 50);
  }

  return null
}