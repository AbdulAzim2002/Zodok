import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardTypeOptions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const pincodeRegex = /^[1-9][0-9]{5}$/

export default function AddOrEditAddress({screenOffset=0, onClose}:{screenOffset?: number, onClose?: ()=>void}) {
  const {top, bottom} = useSafeAreaInsets();
  const {operation, c_address } = useLocalSearchParams();
  const currentAddress = c_address ? JSON.parse(c_address as string) : '0123456';

  const {profile:{user}, updateAddressList, editAddressList, savedAddressList} = useAuthContext()
  const [name, setName] = useState<string>(operation == 'Edit' ? currentAddress[1] : '');
  const [phone, setPhone] = useState<string>(operation == 'Edit' ? currentAddress[2] : '');
  const [address, setAddress] = useState<string>(operation == 'Edit' ? currentAddress[3] : '');
  const [city, setCity] = useState<string>(operation == 'Edit' ? currentAddress[4] : '');
  const [pincode, setPincode] = useState<string>(operation == 'Edit' ? currentAddress[5] : '');

  const [nameError, setNameError] = useState<boolean>(name.length < 2);
  const [phoneError, setPhoneError] = useState<boolean>(phone.length < 10 || phone.length > 11);
  const [addressError, setAddressError] = useState<boolean>(address.length < 2);
  const [pincodeError, setPincodeError] = useState<boolean>(!pincodeRegex.test(pincode));

  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const offset = 14;
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [footerHight, setFooterHeight] = useState<number>(0);
  const [headerHight, setHeaderHeight] = useState<number>(0);
  const [keyboardOffset, setKeyboardOffse] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [base, setBase] = useState(0);
  // const [screenOffset, setScreenOffset] = useState(0);

  const [horizontalAlignedInputBase, sethHorizontalAlignedInputBase] = useState<number>(0);
  const [pincodeErrorHighLight, setPincodeErrorHighLight] = useState<boolean>(false);

  async function addAddress() {
    setLoading(true)

    const {state, district} = await getPincodeDetails(Number(pincode))

    if(state == '') {
      setPincodeErrorHighLight(true)
      setLoading(false)
      return
    }

    const { error } = await supabase
    .from('shipping_addresses')
    .insert({user_id: user.id, full_name:name, phone, address_lane: address, city, district, state, pincode: Number(pincode)})

    if(error)
      console.log(error)
    else {
      const newAddress = ({
        id: `newAddress:${Date.now()}`,
        name,
        phone,
        address,
        city,
        pincode: Number(pincode),
        state,
        district,
        isDefault: false
      })
      updateAddressList(user.id)
      editAddressList([...savedAddressList, newAddress])
      if(onClose == undefined)
        router.back()
      else
        onClose()
      
    }
    setLoading(false)
  }

  async function editAddress () {
    setLoading(true)

    const {state, district} = await getPincodeDetails(Number(pincode))

    if(state == '') {
      setPincodeErrorHighLight(true)
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('shipping_addresses')
      .update({ full_name:name, phone, address_lane: address, city, district, state, pincode: Number(pincode) })
      .eq('id', currentAddress[0])
    
    if(error)
      console.log(error)
    else {
      const editedAddress = ({
        id: currentAddress[0],
        name,
        phone,
        address,
        city,
        pincode: Number(pincode),
        state,
        district,
        isDefault: currentAddress[6] == "true"
      })
      updateAddressList(user.id)
      editAddressList(savedAddressList.map((item)=>(item.id == currentAddress[0] ? editedAddress : item)))
      if(onClose == undefined)
        router.back()
      else
        onClose()
    }
    
    setLoading(false)
    }

  useEffect(() => {
    const nameError = name.length < 2
    const phoneError = phone.length < 10 || phone.length > 11
    const addressError = address.length < 2
    const pincodeError = !pincodeRegex.test(pincode)
    setNameError(nameError)
    setPhoneError(phoneError)
    setAddressError(addressError)
    setPincodeError(pincodeError)
    setDisabled(nameError || phoneError || addressError || pincodeError)
  }, [name, phone, address, city, pincode])

  useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
        const metrics = Keyboard.metrics();
        if(metrics) {
          setKeyboardHeight(metrics.height);
          setKeyboardOffse(metrics.screenY);
        }
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

  useEffect(() => {
    if(keyboardVisible && base+offset-offsetY+headerHight+screenOffset > keyboardOffset) {
      scrollViewRef.current?.scrollTo({y: base+offset-keyboardOffset+headerHight+screenOffset, animated: true})
    }
    console.log(screenOffset,top,base-offsetY+headerHight+offset+screenOffset > keyboardOffset)
  }, [keyboardVisible])

  const handleScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetY(event.nativeEvent.contentOffset.y);
  };

  return(
    <View style={styles.safeArea}>
      <StatusBar style='dark' />

      {/* Header */}
      <View 
        style={[styles.header, {paddingTop: top > 12 ? top : 12}]}
        onLayout={({nativeEvent:{layout}})=>{
          setHeaderHeight(layout.height);
        }}
      >
        {
          operation ?
          <TouchableOpacity onPress={()=>{if(loading) return; router.back()}} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity> :
          <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} />
        }
        <Text style={styles.headerTitle}>{operation || 'Add'} Address</Text>
        {
          onClose ?
          <TouchableOpacity onPress={()=>{if(loading) return; onClose()}} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#1A1A1A" />
          </TouchableOpacity> :
          <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} />
        }
        
        {/* <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} /> */}
      </View>

      <ScrollView
        ref={scrollViewRef} 
        onScroll={handleScroll} 
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label='Full Name'
          value={name}
          placeHolder='Enter full name'
          onChangeText={setName}
          containerStyle={styles.inputGroup}
          inputStyle={styles.input}
          labelStyle={styles.inputLabel}
          errorInputStyle={styles.inputError}
          setBase={setBase}
          autoCapitalize='words'
          editable={!loading}
          error={nameError}
        />

        <Input
          label='Phone Number'
          value={phone}
          placeHolder='Enter phone number'
          keyboardType='numeric'
          onChangeText={setPhone}
          containerStyle={styles.inputGroup}
          inputStyle={styles.input}
          labelStyle={styles.inputLabel}
          errorInputStyle={styles.inputError}
          setBase={setBase}
          editable={!loading}
          error={phoneError}
        />

        <Input
          label='Address'
          value={address}
          placeHolder='House no, building, street, area'
          onChangeText={setAddress}
          containerStyle={styles.inputGroup}
          inputStyle={{...styles.input, ...styles.textArea}}
          labelStyle={styles.inputLabel}
          errorInputStyle={styles.inputError}
          setBase={setBase}
          multiline
          numberOfLines={3}
          editable={!loading}
          error={addressError}
        />

        <View 
          style={styles.inputRow}
          onLayout={({nativeEvent})=>{sethHorizontalAlignedInputBase(nativeEvent.layout.y + nativeEvent.layout.height - 14)}}
        >
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#B0B0B5"
              onFocus={()=>{setBase(horizontalAlignedInputBase)}}
              editable={!loading}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Pincode</Text>
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              onChange={()=>{setPincodeErrorHighLight(false)}}
              onBlur={()=>{setPincodeErrorHighLight(pincodeError)}}
              style={[styles.input, pincodeErrorHighLight && styles.inputError]}
              placeholder="Pincode"
              placeholderTextColor="#B0B0B5"
              keyboardType="numeric"
              onFocus={()=>{setBase(horizontalAlignedInputBase)}}
              editable={!loading}
            />
          </View>
        </View>

        <View style={{height: keyboardHeight-footerHight+bottom}}/>
      </ScrollView>

      {/* Add New Address Button */}
      <View 
        style={[styles.footer,{paddingBottom: bottom > 0 && screenOffset <= 0 ? bottom+8 : 16}]}
        onLayout={({nativeEvent:{layout}})=>{
          setFooterHeight(layout.height);
        }}
      >
        <Pressable
          style={({pressed})=>{
            const enabledStyle = pressed ? {...styles.saveAddressButton, ...{opacity: 0.85}} : styles.saveAddressButton;
            return disabled ? styles.disabledSaveAddressButton : enabledStyle;
          }}
          onPress={operation == 'Edit' ? editAddress : addAddress}
          disabled={disabled || loading}
        >
          {
            loading ?
            <ActivityIndicator color={styles.saveAddressButtonText.color} size='small'/> :
            <Text style={disabled?styles.disabledSaveAddressButtonText:styles.saveAddressButtonText}>Save Address</Text>
          }
        </Pressable>
      </View>
      {/* <View style={{position: 'absolute', height: footerHight, width: 40, backgroundColor: 'yellow', bottom: 0}}></View> */}
    </View>
  )
}

function Input({
    label,
    value,
    onChangeText,
    placeHolder,
    setBase,
    autoCapitalize,
    keyboardType,
    editable,
    containerStyle,
    labelStyle,
    inputStyle,
    errorInputStyle,
    multiline,
    numberOfLines,
    error=false,
  }: {
    label: string,
    value: string,
    onChangeText?: (value:string)=>void,
    placeHolder?: string,
    setBase:(base:number)=>void,
    autoCapitalize?: "none" | "words" | "sentences" | "characters",
    keyboardType?: KeyboardTypeOptions,
    editable?: boolean,
    containerStyle: ViewStyle,
    labelStyle: TextStyle,
    inputStyle: TextStyle,
    errorInputStyle?: TextStyle,
    multiline?: boolean,
    numberOfLines?: number,
    error?: boolean
  }
) {
  const [thisBase, setThisBase] = useState<number>(0);
  const [errorHighLight, setErrorHighLight] = useState<boolean>(false);
  return (
    <View 
      style={containerStyle} 
      onLayout={({nativeEvent})=>{setThisBase(nativeEvent.layout.y + nativeEvent.layout.height)}}
    >
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onChange={()=>{setErrorHighLight(false)}}
        onBlur={()=>{setErrorHighLight(error)}}
        style={[inputStyle, errorHighLight && errorInputStyle]}
        placeholder={placeHolder}
        placeholderTextColor="#B0B0B5"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={()=>{setBase(thisBase)}}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
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
    paddingBottom: 12,
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
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
    marginLeft: 5
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
  inputError : {
    borderColor: 'red',
    color: 'red'
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
  disabledSaveAddressButton: {
    backgroundColor: '#525252',
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
  disabledSaveAddressButtonText: {
    color: '#b9b9b9',
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
    borderRadius: 14,
    height: 54,
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