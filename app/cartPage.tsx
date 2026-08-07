import Percentage from '@/assets/svg/percentage';
import { Button } from '@/components';
import Cart from '@/components/cart';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useStateContext } from '@/hooks/use-state-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {height, width} = Dimensions.get('window');

export default function CartScreen() {

  const {top, bottom} = useSafeAreaInsets();
  const {profile:{user}, cart, updateCart, isLoading} = useAuthContext();
  const {trynbuy, setTrynbuy} = useStateContext();
  const [subTotal, setSubTotal] = useState<number>(0);
  const [trialTotal, setTrialTotal] = useState<number>(0);
  const [discount, setDiscont] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [cartEmpty, setCartEmpty] = useState<boolean>(true);
  const [tabSize, setTabSize] = useState<number>(0);
  const tabPosition = useSharedValue(trynbuy ? tabSize : 0);
  const tabOffset = useSharedValue(-64);
  const contentOffset = useSharedValue(height-172+bottom); 

  const leftTabStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      tabPosition.value,
      [0, tabSize],
      ['#fff', '#93939f']
    )
  }));
  const rightTabStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      tabPosition.value,
      [0, tabSize],
      ['#93939f', '#fff']
    )
  }));

  useEffect(() => {
    if(cart.length < 1) {
      setCartEmpty(true);
      router.back();
    }
    setTimeout(()=>{tabOffset.value = withSpring(0), contentOffset.value = withSpring(0)}, 550)
  }, [])

  useEffect(()=>{
    if(cart.length < 1) {
      setCartEmpty(true);
      router.back();
    }
    setCartEmpty(false);
    let subTotal = 0, total = 0, trialTotal = 0;
    for(const item of cart) {
      total += item.quantity * item.varient.price;
      subTotal += item.quantity * item.varient.compare_at_price;
      if(!item.varient.info.trynbuy)
        trialTotal += item.quantity * item.varient.price;
    }
    setTrialTotal(trialTotal);
    setSubTotal(subTotal);
    setTotal(total);
  }, [cart])

  useEffect(() => {
    tabPosition.value = withSpring(trynbuy ? tabSize : 0)
  }, [trynbuy, tabSize])

  const emptyCaart = async () => {
    const {data, error} = await supabase.from('cart_items').delete().eq('user_id', user.id).select()
      if(error)
        console.log(error)
      else {
        updateCart(user.id)
        setCartEmpty(true)
      }
  }

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 12,
      paddingTop: (top > 12 ? 0 : 12-top)
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      justifyContent: 'space-between'
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: '#F9F9FB',
      borderRadius: 16,
      padding: 12,
      marginTop: 14,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: '#E9E9EC',
    },
    itemDetails: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    itemTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: '#1A1A1A',
      marginRight: 8,
    },
    itemVariant: {
      fontSize: 12,
      color: '#9B9B9B',
      marginTop: 2,
    },
    itemBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
    quantityButton: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#F0F0F2',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1A1A1A',
      marginHorizontal: 10,
    },
    promoContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    promoInput: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
    },
    promoPlaceholder: {
      fontSize: 14,
      color: '#9B9B9B',
      marginLeft: 8,
    },
    promoButton: {
      marginLeft: 10,
      height: 48,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: '#1A1A1A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    promoButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    summaryContainer: {
      marginTop: 24,
      backgroundColor: '#F9F9FB',
      borderRadius: 16,
      padding: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#6E6E73',
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    discountValue: {
      color: '#2E9E5B',
    },
    divider: {
      height: 1,
      backgroundColor: '#E5E5EA',
      marginVertical: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    totalValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      marginTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F2',
    },
    checkoutButton: {
      flexDirection: 'row',
      backgroundColor: '#1A1A1A',
      borderRadius: 14,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      marginRight: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      marginTop: -40,
    },
    imageWrapper: {
      position: 'relative',
      marginBottom: 28,
    },
    emptyImage: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: '#F5F5F5',
    },
    badge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#1A1A1A',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: '#FFFFFF',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: '#8E8E93',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 32,
    },
    shopButton: {
      flexDirection: 'row',
      backgroundColor: '#1A1A1A',
      borderRadius: 14,
      height: 54,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shopButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      marginRight: 8,
    },
    container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FFE1B8',
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FF9500',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    textWrapper: {
      flex: 1,
    },
    discountTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    discountSubtitle: {
      fontSize: 12,
      color: '#8E8E93',
      marginTop: 2,
    }
  });

  return (
    <View style={{flex: 1, gap: 16, backgroundColor: '#fff', paddingBottom: bottom}}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{
        paddingTop: top, 
        zIndex: 1,
        boxShadow:[{
          offsetX: 0,
          offsetY: 0,
          blurRadius: '4px',
          spreadDistance: '0px',
          color: '#e4e4e7',
          inset: false,
        }],
      }}
      >
        <View style={{height: 76, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff'}}>
          <Pressable 
						style={{ borderRadius: 12, backgroundColor: '#fff', borderColor: '#f1f1f3', borderWidth: 1, height: 48, width: 48, padding: 4, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center'}}
						onPress={()=>{router.back()}}
					>
						<Ionicons name='chevron-back' size={24} color={'#aeaeb7'}/>
					</Pressable>
          <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 18, color: '#18181b'}}>Cart</Text>
          <View style={{ height: 48, width: 48}} />
        </View>
      </View>

      {/* Tab */}
      <Animated.View style={{marginHorizontal: 16, top: tabOffset, marginVertical: 8, height: 40, flexDirection: 'row'}} onLayout={({nativeEvent:{layout}})=>{setTabSize(layout.width/2)}}>
        <View style={{height: 40, width: '100%', position: 'absolute', backgroundColor: '#f1f1f3', borderColor: '#e4e4e7', borderWidth: 1, borderRadius: 8}}></View>
        <Animated.View style={{height: 40, width: '50%', borderRadius: 8, backgroundColor: '#18181b', position: 'absolute', left: tabPosition}}></Animated.View>
        <View style={{flex: 1}}>
          <Pressable style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{setTrynbuy(false)}}>
            <Animated.Text style={[{fontFamily: 'CreatoDisplay', fontSize: 16}, leftTabStyle]}>Direct Buy</Animated.Text>
          </Pressable>
        </View>
        <View style={{flex: 1}}>
          <Pressable style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{setTrynbuy(true)}}>
            <Animated.Text style={[{fontFamily: 'CreatoDisplay', fontSize: 16}, rightTabStyle]}>Try & Buy</Animated.Text>
          </Pressable>
        </View>
      </Animated.View>
      
      <Animated.ScrollView
        style={{flex: 1, top: contentOffset}}
        contentContainerStyle={[{justifyContent: 'space-between', minHeight: height-172}]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{paddingHorizontal: 16}}>
          {/* Cart Items */}
            <Cart/>

          {/* Order Summary */}
          {
            !trynbuy ?
            <View style={{gap: 8, marginVertical: 16}}>
              <Text style={{paddingHorizontal: 4, paddingVertical: 8, fontFamily: 'CreatoDisplayMedium', fontSize: 16, color: '#18181b'}}>Billing Summary</Text>
              <View style={{gap: 8}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}>Item Total</Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹{subTotal}</Text>
                      <Text style={{color: '#484851', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}> ₹{total}</Text>
                    </View>
                  </View>
                </View>
                <View style={{height: 1, backgroundColor: '#f1f1fb'}}/>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}><Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}>Handeling Fee</Text></View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹30</Text>
                      <Text style={{color: '#00a34c', fontFamily: 'CreatoDisplayMedium', fontSize: 14, height: 16, textAlignVertical: 'center'}}> FREE</Text>
                    </View>
                  </View>
                </View>
                <View style={{height: 1, backgroundColor: '#f1f1fb'}}/>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}><Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}>Subtotal</Text></View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹{subTotal}</Text>
                      <Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}> ₹{total}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View> :
            <View style={{gap: 8, marginVertical: 16}}>
              <Text style={{paddingHorizontal: 4, paddingVertical: 8, fontFamily: 'CreatoDisplayMedium', fontSize: 16, color: '#18181b'}}>Billing Summary</Text>
              <View style={{gap: 8}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}>Item Total</Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹{subTotal}</Text>
                      <Text style={{color: '#484851', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}> ₹{trialTotal}</Text>
                      <Text style={{color: '#00a34c', fontFamily: 'CreatoDisplayMedium', fontSize: 14, height: 16, textAlignVertical: 'center'}}> TRY & BUY</Text>
                    </View>
                  </View>
                </View>
                <View style={{height: 1, backgroundColor: '#f1f1fb'}}/>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}><Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center'}}>Handeling Fee</Text></View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹30</Text>
                      <Text style={{color: '#00a34c', fontFamily: 'CreatoDisplayMedium', fontSize: 14, height: 16, textAlignVertical: 'center'}}> FREE</Text>
                    </View>
                  </View>
                </View>
                <View style={{height: 1, backgroundColor: '#f1f1fb'}}/>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}><Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}>Subtotal</Text></View>
                  <View style={{width: '50%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline'}}>
                      <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹{subTotal}</Text>
                      <Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}> ₹{trialTotal}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          }

          {/** Coupen */}
          <View style={{marginVertical: 8, gap: 8}}>
            <View style={{paddingHorizontal: 4, paddingVertical: 8}}> 
              <Text style={{height: 18, fontSize: 16, fontFamily: 'CreatoDisplayMedium', color: '#18181b'}}>Apply Coupons & Offers</Text>
            </View>
            <View style={{padding: 12, borderColor: '#fff5ff', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <Percentage/>
                <View style={{gap: 4}}>
                  <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 18, color: '#18181b'}}>GET100</Text>
                  <Text style={{fontFamily: 'CreatoDisplay', fontSize: 12, height: 14, color: '#18181b'}}>Save upto Rs.100</Text>
                </View>
              </View>
              <View style={{backgroundColor: '#18181b', borderColor: '#60606c', padding: 8, borderWidth: 1, borderRadius: 8, justifyContent: 'center'}}>
                <Text style={{fontSize: 14, color: '#fff', fontFamily: 'CreatoDisplayMedium'}}>Apply</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Checkout Button */}
        <View style={{paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 8, paddingBottom: 8, marginTop: 16}}>
          <View style={{height: 42}}>
            <Button
              label='Proceed to Checkout'
              onPress={()=>{router.push({
                pathname: '/checkout',
                params: {
                  trial: String(trynbuy)
                }
              })}}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

