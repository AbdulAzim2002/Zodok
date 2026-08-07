import { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type cartItemType = {
  quantity: number,
  varient: variant,
  id: string,
}

export type trialItemType = {
  varient: variant,
  id: string,
}

export type addressType = {
  id: string,
  name: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  district: string,
  pincode: number,
  isDefault: boolean
}

export type categoryType = {
  name: string,
  slug: string,
  imageUrls: string[]
}

export type AuthData = {
  session?: Session | null
  profile?: any | null
  isLoading: boolean
  isLoggedIn: boolean
  cart: cartItemType[]
  cartLoading: boolean
  trialCart: trialItemType[]
  wishlist: string[]
  primodialCategories: categoryType[]
  wishlistLoading: boolean
  savedAddressList: addressType[]
  addressLoading: boolean
  updateCart: (user_id: string | undefined) => void
  updateWishlist: (user_id: string | undefined) => void
  updateTrialCart: (user_id: string | undefined) => void
  editWishlist: (whishlist: string[]) => void
  updateAddressList: (user_id: string | undefined) => void
  editAddressList: (adressList: addressType[]) => void
}

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  cart: [],
  trialCart: [],
  cartLoading: true,
  wishlist: [],
  primodialCategories: [],
  wishlistLoading: true,
  savedAddressList: [],
  addressLoading: true,
  updateCart: (user_id: string | undefined)=>{console.log('Unable to update cart')},
  updateTrialCart: (user_id: string | undefined)=>{console.log('Unable to update cart')},
  updateWishlist: (user_id: string | undefined)=>{console.log('Unable to update wishlist')},
  editWishlist: (whishlist: string[]) => {},
  updateAddressList: (user_id: string | undefined)=>{console.log('Unable to update saved address list')},
  editAddressList: (adressList: addressType[]) => {}
})

export const useAuthContext = () => useContext(AuthContext)

type variant = {
  id: string,
  price: number,
  compare_at_price: number,
  color: string,
  size: string,
  info: productInfo,
  stock: number,
}

type productInfo = {
  name: string,
  image: {url: string}[],
  trynbuy: boolean
}