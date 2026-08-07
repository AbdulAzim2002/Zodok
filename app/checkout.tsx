import { addressType, useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const {trial} = useLocalSearchParams()
  const {top, bottom} = useSafeAreaInsets()
  const {savedAddressList, cart, profile:{user}, updateCart} = useAuthContext()
  const [selectedAddressIndex, setSlectedAddressIndex] = useState<number>(0)
  const [subTotal, setSubTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [noOfAddresses, setNoOfAddresses] = useState<number>(savedAddressList.length)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let subtotal = 0, total = 0;
    for(const item of cart) {
      if(!(trial == 'true') || !item.varient.info.trynbuy)
        total += item.quantity * item.varient.price;
      subtotal += item.quantity * item.varient.compare_at_price;
    }
    setSubTotal(subtotal);
    setTotal(total);
  }, [cart])

  useEffect(() => {
    if(noOfAddresses < savedAddressList.length) {
      setSlectedAddressIndex(savedAddressList.length-1)
      setNoOfAddresses(savedAddressList.length)
    }
  }, [savedAddressList])

  const checkout = async () => {
    setLoading(true)
    const { data, error } = await supabase.functions.invoke(trial == 'true' ? 'checkout-trial' : 'checkout',{body: {addressId: savedAddressList[selectedAddressIndex].id}})

    if(error)
      console.log(error)
    else {
      console.log(data)
      router.replace('/profile/orders')
    }
    updateCart(user.id)
    setLoading(false)
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: top > 12 ? top : 12}]}>
        <TouchableOpacity onPress={()=>{router.back()}} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Saved Addresses */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>

        {savedAddressList.map((item, index) => (
          <AddressSelector 
            key={item.id} address={item} 
            setIndex={setSlectedAddressIndex} 
            index={index}
            selectedIndex={selectedAddressIndex}
            disabled={loading}
          />
        ))}

        {/* Add New Address */}
        <TouchableOpacity 
          onPress={()=>{
            router.push({
              pathname: '/profile/addOrEditAddress',
              params: {
                operation: 'Add'
              }
            })
          }}
          style={styles.addNewButton} 
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color="#1A1A1A" />
          <Text style={styles.addNewButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Order Summary */}
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
                  {
                    trial == 'true' &&
                    <Text style={{color: '#00a34c', fontFamily: 'CreatoDisplayMedium', fontSize: 14, height: 16, textAlignVertical: 'center'}}> TRY & BUY</Text>
                  }
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
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer,{paddingBottom: bottom > 0 ? bottom : 16}]}>
        <Pressable
          style={({pressed})=>({...styles.placeOrderButton, opacity: pressed ? 0.85 : 1})}
          onPress={checkout}
          disabled={loading}
        >
          {
            loading ? 
            <ActivityIndicator color={"#FFFFFF"}/> :
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          }
        </Pressable>
      </View>
    </View>
  );
}

function AddressSelector({address, index, selectedIndex, setIndex, disabled}:{address: addressType, index: number, selectedIndex: number, setIndex: (index: number)=>void, disabled: boolean}) {
  const editAddress = async () => {
    router.push({
      pathname: '/profile/addOrEditAddress',
      params: {
        operation: 'Edit',
        c_address: JSON.stringify([
          address.id,
          address.name,
          address.phone,
          address.address,
          address.city,
          String(address.pincode),
          String(address.isDefault)
        ])
      }
    })
  }
  return(
    <Pressable
      style={[
        styles.addressCard,
        index == selectedIndex && styles.addressCardSelected,
      ]}
      onPress={()=>{setIndex(index)}}
      disabled={disabled}
    >
      <View style={styles.radioOuter}>
        {index == selectedIndex && <View style={styles.radioInner} />}
      </View>

      <View style={styles.addressDetails}>
        <View style={styles.addressTopRow}>
          <Text style={styles.addressName}>{address.name}</Text>
        </View>

        <Text style={styles.addressText}>{address.address}, {address.city.length > 0 ? address.city : address.district}, {address.state} {address.pincode}</Text>

        <View style={styles.phoneRow}>
          <Ionicons name="call-outline" size={13} color="#8E8E93" />
          <Text style={styles.phoneText}>{address.phone}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={editAddress} style={styles.editButton}>
        <Ionicons name="create-outline" size={18} color="#8E8E93" />
      </TouchableOpacity>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  addressCardSelected: {
    borderColor: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A1A1A',
  },
  addressDetails: {
    flex: 1,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelBadge: {
    backgroundColor: '#EDEDEF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  labelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  addressText: {
    fontSize: 13,
    color: '#6E6E73',
    lineHeight: 18,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 6,
  },
  editButton: {
    padding: 4,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  newAddressForm: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  saveAddressButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveAddressButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryContainer: {
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
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
  },
  placeOrderButton: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});