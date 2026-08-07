import { useAuthContext } from "@/hooks/use-auth-context";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Modal, Pressable, PressableStateCallbackType, TextStyle, View, ViewStyle } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Cart from "./cart";

import { useStateContext } from "@/hooks/use-state-context";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import { SvgProps } from "react-native-svg";
import { Button } from "./Zodok/Button";
import CartIcon from "./cartIcon";


const {height, width} = Dimensions.get('screen');

export default function CartPopUp({bottomOffset=0}:{bottomOffset?:number}) {
  const {profile, cart} = useAuthContext();
  const {trynbuy} = useStateContext();
  const height = useSharedValue<number>(0);
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [trialTotal, setTrialTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let subtotal = 0, total = 0, trialTotal = 0;
    for(const item of cart) {
        total += item.quantity * item.varient.price;
        subtotal += item.quantity * item.varient.compare_at_price;
        if(!item.varient.info.trynbuy)
            trialTotal += item.quantity * item.varient.price;
    }
    setTrialTotal(trialTotal);
    setSubtotal(subtotal);
    setTotal(total);
    height.value = withSpring(cart.length > 0 ? 58 : 0);
  }, [cart])

  return(
    <Animated.View style={{width, height: height}}>
        <View
            style={{
                paddingHorizontal: 16,
                flexDirection: 'row',
                paddingVertical: 8,
                borderTopWidth: 1,
                borderColor: '#e4e4e7',
                width,
                backgroundColor: "#fff",
                gap: 8, 
            }}
        >
          <View 
              style={{
                  height: 42,
                  flex: 1,
                  justifyContent: 'center',
              }}
          >
              <View style={{flexDirection: 'row', gap: 4}}>
                  <Text
                      style={{
                          color: '#787887',
                          fontFamily: "CreatoDisplay",
                          fontSize: 16,
                      }}
                  >
                  Subtotal
                  </Text>
                  {
                      trynbuy &&
                      <Text 
                          style={{
                              color: '#00a34c', 
                              fontFamily: 'CreatoDisplayMedium', 
                              verticalAlign:'bottom', 
                              fontSize: 14
                          }}
                      >
                          TRY & BUY
                      </Text>
                  }
              </View>
              <View style={{flexDirection: 'row', gap: 4}}>
                  <Text
                      style={{
                          color: '#18181b',
                          fontFamily: "CreatoDisplay",
                          fontSize: 18,
                      }}
                  >
                      ₹{trynbuy ? trialTotal : total}
                  </Text>
                  <Text
                      style={{
                          textDecorationLine: 'line-through', 
                          fontSize: 14, 
                          textAlignVertical: 'bottom',
                          fontFamily: 'CreatoDisplay',
                          color: "#93939f"
                      }}
                  >
                      ₹{subtotal}
                  </Text>
              </View>
          </View>
          <Botton 
              label={'View Cart'}
              Icon={CartIcon}
              buttonStyle={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  backgroundColor: "white",
                  height: 42,
                  borderWidth: 1,
                  borderColor: '#e4e4e7',
                  flexDirection: 'row',
                  gap: 10,

              }}
              disableButtonStyle={{
                  backgroundColor: "#93939F"
              }}
              onPressedButtonStyle={{
                  opacity: 0.8
              }}
              labelStyle={{
                  color: '#18181b',
                  fontFamily: "CreatoDisplay",
                  fontSize: 16,
              }}
              disabledLabelStyle={{color: "#484851"}}
              onPress={()=>{setPopUpVisible(true)}}
              disabled={cart.length < 1}
          />
        </View>
        <PopupCart visible={popUpVisible} onClose={()=>{setPopUpVisible(false)}}/>
    </Animated.View>
  )
}

export function PopupCart({ visible, onClose } : { visible: boolean, onClose: ()=>void }) {
  const {trynbuy, setTrynbuy} = useStateContext();
  const [backdropColor, setBackdropColor] = useState<'transparent' | 'rgba(0,0,0,0.4)'>('transparent');
  const [total, setTotal] = useState<number>(0);
  const close = () => {setBackdropColor('transparent'), setTimeout(()=>{onClose()}, 100)};
  const {cart} = useAuthContext();
  const [tabSize, setTabSize] = useState<number>(0);
  const tabPosition = useSharedValue(trynbuy ? tabSize : 0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [trialTotal, setTrialTotal] = useState<number>(0);
  
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
    tabPosition.value = withSpring(trynbuy ? tabSize : 0)
  }, [trynbuy, visible])

  useEffect(() => {
    if(cart.length < 1)
      close();
    let total = 0, subTotal = 0, trialTotal = 0;
    for(const item of cart) {
        total += item.varient.price * item.quantity;
        subTotal += item.varient.compare_at_price * item.quantity;
        if(!item.varient.info.trynbuy)
          trialTotal += item.varient.price * item.quantity;
    }
    setTrialTotal(trialTotal);
    setSubTotal(subTotal);
    setTotal(total);
  }, [cart]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={close}
      onShow={()=>{setTimeout(()=>{setBackdropColor('rgba(0,0,0,0.4)')}, 100)}}
    >
      {/* Backdrop */}
      <View style={[styles.backdrop, {backgroundColor: backdropColor}]}>
        <Pressable style={styles.backdropTouchRespoder} onPress={close}/>
        <View style={{backgroundColor: '#fff', borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingVertical: 8, maxHeight: '85%',}}>
          {/* Drag handle */}
          {/* <View style={styles.handle} /> */}

          {/* Header */}
          <View style={{marginHorizontal: 16, paddingTop: 8, paddingLeft: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontFamily:'CreatoDisplayMedium', fontSize: 22, color: '#18181b'}}>Cart</Text>
            <Pressable
              style={{
                height: 24,
                width: 24,
                backgroundColor: '#f1f1f3',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="close" size={15} color='#93939f' onPress={close}/>
            </Pressable>
          </View>

          <View style={{height: 8}}/>

          {/** Tab */}
          <View style={{marginHorizontal: 16, marginVertical: 8, height: 40, flexDirection: 'row'}} onLayout={({nativeEvent:{layout}})=>{setTabSize(layout.width/2)}}>
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
          </View>
          
          <View style={{height: 16}}/>

          {/* Items */}
          <ScrollView
            contentContainerStyle={{marginHorizontal: 16, justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
          >
            <Cart/>

            {/* Summary + CTA */}
            <View style={{flexDirection: 'row', marginVertical: 16}}>
              <View style={{width: '50%'}}><Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}>Subtotal</Text></View>
              <View style={{width: '50%'}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline'}}>
                  <Text style={{color: '#787887', fontFamily: 'CreatoDisplay', fontSize: 14, height: 16, textAlignVertical: 'center', textDecorationLine: 'line-through'}}>₹{subTotal}</Text>
                  <Text style={{color: '#18181b', fontFamily: 'CreatoDisplayMedium', fontSize: 16, height: 16, textAlignVertical: 'center'}}> ₹{trynbuy ? trialTotal : total}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={{paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#e4e4e7'}}>
            <View style={{height: 50, width: '100%', paddingTop: 8}}>
              <Button
                label="Go to Cart"
                onPress={() => {
                  close()
                  router.push('/cartPage')
                }}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Botton = ({
    Icon,
    disabled=false,
    label,
    buttonStyle,
    disableButtonStyle,
    onPressedButtonStyle,
    labelStyle,
    disabledLabelStyle,
    loading=false,
    onPress
} : {
    Icon?: (props: SvgProps) => React.JSX.Element
    disabled?: boolean,
    label: string,
    buttonStyle?: ViewStyle,
    disableButtonStyle?: ViewStyle,
    onPressedButtonStyle?: ViewStyle
    labelStyle?: TextStyle,
    disabledLabelStyle?: TextStyle,
    loading?: boolean,
    onPress: ()=>void;
}) => {
    const defaultStyle: ViewStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 40,
            backgroundColor: '#26edff',
            flex: 1
        }
    function containerStyle(state: PressableStateCallbackType): ViewStyle {
        const style: ViewStyle = (disabled ? {...buttonStyle, ...disableButtonStyle} : buttonStyle) || defaultStyle;
        return state.pressed ? {...style, ...onPressedButtonStyle} : style;
    }
    return (
            <Pressable 
                style={containerStyle}
                disabled={disabled || loading}
                onPress={onPress}
            >
                <View style={{height: '100%', width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        loading && 
                        <ActivityIndicator color={labelStyle?.color}/>
                    }
                </View>
                {Icon && <Icon/>}<Text style={[labelStyle, disabled && disabledLabelStyle, loading && {display: 'none'}]}>{label}</Text>
            </Pressable>
    )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTouchRespoder: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsList: {
    marginTop: 4,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E9E9EC',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemVariant: {
    fontSize: 11,
    color: '#9B9B9B',
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  quantityButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F0F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 8,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
    paddingTop: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    color: '#6E6E73',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  fabContainer: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29
  },
  fab: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});