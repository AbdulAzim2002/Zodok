import { addressType, AuthContext, cartItemType, categoryType, trialItemType } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'
import { AppState } from 'react-native'


export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined | null>()
  const [profile, setProfile] = useState<any>({user:{id: null}})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cart, setCart] = useState<cartItemType[]>([])
  const [trialCart, setTrialCart] = useState<trialItemType[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [savedAddressList, setSavedAddressList] = useState<addressType[]>([])
  const [primodialCategories, setPrimodialCategories] = useState<categoryType[]>([])


  const [sessionLoading, setSessionLoading] = useState<boolean>(true)
  const [profileLoading, setProfileLoading] = useState<boolean>(true)
  const [cartLoading, setCartLoading] = useState<boolean>(true)
  const [trialCartLoading, setTrialCartLoading] = useState<boolean>(true)
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(true)
  const [addressLoading, setAddressLoading] = useState<boolean>(true)

  const fetchCart = async (user_id: string | undefined) => {
    if(user_id == undefined)
      return;
    const {data, error} = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      trial,
      varient:product_variants(
        id,
        price,
        compare_at_price,
        color,
        size,
        stock,
        info:products(
          name,
          trynbuy,
          image:product_images(
            url:image_url
          )
        )
      )
    `)
    .order('created_at')
    .overrideTypes<cartItemType[]>();

    if(error)
      console.log(error)
    else
      setCart(data);
    setCartLoading(false);
  }

  const fetchTrialCart = async (user_id: string | undefined) => {
    if(user_id == undefined)
      return;
    const {data, error} = await supabase
    .from('trial_items')
    .select(`
      id,
      varient:product_variants(
        id,
        price,
        compare_at_price,
        color,
        size,
        stock,
        info:products(
          name,
          image:product_images(
            url:image_url
          )
        )
      )
    `)
    .order('created_at')
    .overrideTypes<trialItemType[]>();

    if(error)
      console.log(error)
    else
      setTrialCart(data);
    setTrialCartLoading(false);
  }

  const fetchWishlist = async (user_id: string | undefined) => {
    if(user_id == undefined)
      return;
    const {data, error} = await supabase
    .from('wishlist')
    .select('product_id')
    .overrideTypes<{product_id: string}[]>();

    if(error)
      console.log(error);
    else {
      const wishlist:string[] = data.map((item)=>(item.product_id));
      setWishlist(wishlist);
    }
    setWishlistLoading(false)
  }

  const fetchSavedAddress = async (user_id: string | undefined) => {
    if(user_id == undefined)
      return;
    const {data, error} = await supabase
    .from('shipping_addresses')
    .select(`
      id,
      name:full_name,
      phone,
      address:address_lane,
      city,
      district,
      state,
      pincode,
      isDefault:is_default
    `)
    .order('is_default', {ascending: false})
    .order('created_at')
    .overrideTypes<addressType[]>();

    if(error)
      console.log(error);
    else {
      setSavedAddressList(data);
    }
    setAddressLoading(false);
  }

const fetchCatogeroies = async ()=>{
    const { data, error} = await supabase
    .from('categories')
    .select('name, slug, imageUrls:image_url')
    .is('parent_id', null)
    .order('display_order')
    .overrideTypes<categoryType[]>();

  //   const { data, error } = await supabase
  // .rpc('get_subcategories_with_products', { p_parent_id: page ? 'c1000000-0000-0000-0000-000000000002' : 'c1000000-0000-0000-0000-000000000001' });

    if(error)
      console.log(error);
    else {
      console.log(data[0].imageUrls)
     setPrimodialCategories(data.map((item) => ({
      name: item.name,
      slug: item.slug,
      imageUrls: [String(item.imageUrls[0]), String(item.imageUrls[1])],
    })))
  }
    
    // setLoading(false);
  }

  useEffect(() => {
    setIsLoading(sessionLoading || profileLoading);
  }, [sessionLoading, profileLoading])

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setSessionLoading(true)

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching session:', error)
      } else {
        const { data } = await supabase.auth.getUser();
        await fetchSavedAddress(data.user?.id);
        await fetchCatogeroies();
        console.log('User:-------------------')
        console.log(data);
        console.log('-------------------------')
        setProfile(data)
      }

      setSession(session)
      setSessionLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Auth state changed:', { event: _event, session })
      setSession(session)
    })

    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch the profile when the session changes
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true)
      setCartLoading(true)
      setWishlistLoading(true)
      setAddressLoading(true)


      if (session) {
        const { data } = await supabase.auth.getUser()
        // Fetch addresses
        await fetchSavedAddress(data.user?.id);
        // Fetch cart
        fetchCart(data.user?.id);
        fetchTrialCart(data.user?.id);
        // Fetch wishlist
        fetchWishlist(data.user?.id);
        setProfile(data)
      } else {
        setProfile(null)
      }
      setProfileLoading(false)
    }

    fetchProfile()
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: session != undefined && profile != null,
        cart,
        trialCart,
        cartLoading,
        wishlist,
        primodialCategories,
        wishlistLoading,
        savedAddressList,
        addressLoading,
        updateCart: fetchCart,
        updateTrialCart: fetchTrialCart,
        updateWishlist: fetchWishlist,
        editWishlist: setWishlist,
        updateAddressList: fetchSavedAddress,
        editAddressList: setSavedAddressList
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

async function getPincodeDetails(pincode: number) {
  const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  const data = await response.json();
  
  if (data[0].Status === "Success") {
    return {
      state: data[0].PostOffice[0].State,
      district: data[0].PostOffice[0].District,
      postOffice: data[0].PostOffice[0].Name,
    };
  }
  return {state: '', district: '', postOffice: ''};
}