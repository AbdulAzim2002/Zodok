import { createContext, useContext } from 'react'

export type StateData = {
  onboarded: boolean
  setOnboarded: ((onboarded: boolean) => void),
  isLoading: boolean
  trynbuy: boolean
  setTrynbuy: (trynbuy:boolean) => void
}

const setOnboarded = (flag: boolean) => {
  console.log('Provide a function to call in use-state-context');
}

export const StateContext = createContext<StateData>({
  onboarded: false,
  setOnboarded,
  isLoading: true,
  trynbuy: false,
  setTrynbuy: () => {console.log('Please provide a fuction to call in use-state-context')}
})

export const useStateContext = () => useContext(StateContext)