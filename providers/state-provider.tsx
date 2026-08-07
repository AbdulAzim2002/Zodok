import { StateContext } from '@/hooks/use-state-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function StateProvider({ children }: PropsWithChildren) {
  const [onboarded, setOnboarded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [trynbuy, setTrynbuy] = useState<boolean>(false)


  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {		
    const fetchLocalData = async () => {
      setIsLoading(true)
			try {
				const value = await AsyncStorage.getItem('onboardingCompleted')
				if (value !== null) {
					setOnboarded(value === "true" ? true : false)
				}
			} catch (e) {
				console.log(e)
				setOnboarded(false)
			}
      
      setIsLoading(false)
    }

    fetchLocalData()
  }, [])

  // Fetch the profile when the session changes
  useEffect(() => {
    const upadateOnboardingStatus = async () => {
      setIsLoading(true)
      try {
        await AsyncStorage.setItem('onboardingCompleted', 'true');
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
      setIsLoading(false)
    }
    upadateOnboardingStatus();
  }, [onboarded])

  // useEffect(() => {
  //   const upadateCartState = async () => {
  //     try {
  //       await AsyncStorage.setItem('cartState', trynbuy ? 'true':'falsy');
  //     } catch (error) {
  //       console.error('Error saving onboarding status:', error);
  //     }

  //     console.log('updating state of cart')
  //   }
  //   upadateCartState();
  // }, [trynbuy])

  return (
    <StateContext.Provider
      value={{
				onboarded,
        setOnboarded,
        isLoading,
        trynbuy,
        setTrynbuy
      }}
    >
      {children}
    </StateContext.Provider>
  )
}