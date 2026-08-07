import { addressType, useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

export default function AddressListScreen() {
  const {top, bottom} = useSafeAreaInsets();
  const {savedAddressList, addressLoading} = useAuthContext();

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: top > 12 ? top : 12}]}>
        <TouchableOpacity onPress={()=>{router.back()}} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} />
      </View>

      
      {
        !addressLoading ?
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {savedAddressList.map((item) => (<AddressCard key={item.id} address={item} />))}
          </ScrollView>

          {/* Add New Address Button */}
          <View style={[styles.footer,{paddingBottom: bottom > 0 ? bottom : 16}]}>
            <TouchableOpacity 
              style={styles.addButton} 
              activeOpacity={0.85} 
              onPress={()=>{
                router.push({
                  pathname: '/profile/addOrEditAddress',
                  params: {
                    operation: 'Add'
                  }
                })
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </>:
        <View style={{flex:1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large'/>
        </View>
      }
    </View>
  );
}

function AddressCard({address}:{address:addressType}) {
  const {updateAddressList, editAddressList, savedAddressList, profile:{user}} = useAuthContext();
  const [disabled, setDisabled] = useState<boolean>(false);
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
  const deleteAddress = async() => {
    setDisabled(true)
    const {error} = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', address.id)

    if(error)
      console.log(error)
    else {
      editAddressList(savedAddressList.filter((item)=>(item.id != address.id)))
      updateAddressList(user.id)
    }
    setDisabled(false)
  }
  const setAsDefault = async() => {
    setDisabled(true)
    const {error} = await supabase
    .rpc('set_address_as_default', {address_id: address.id})
    if(error)
      console.log(error)
    else {
      updateAddressList(user.id)
      editAddressList(savedAddressList.map((item)=>{
        item.isDefault = item.id == address.id;
        return item;
      }))
    }
    setDisabled(false)
  }
  return (
      <View style={styles.addressCard}>
      <View style={styles.addressDetails}>
        <View style={styles.topRow}>
          <Text style={styles.labelText}>{address.name}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>

        {/* <Text style={styles.nameText}>{item.name}</Text> */}
        <Text style={styles.addressText}>{address.address}, {address.city.length > 0 ? address.city : address.district}, {address.state} {address.pincode}</Text>

        <View style={styles.phoneRow}>
          <Ionicons name="call-outline" size={13} color="#8E8E93" />
          <Text style={styles.phoneText}>{address.phone}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable 
            onPress={editAddress}
            style={({pressed})=>({...styles.actionButton, opacity: pressed ? 0.2 : 1})} 
            disabled={disabled}
          >
            <Ionicons
              name="create-outline"
              size={15}
              color="#1A1A1A"
            />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable 
            onPress={deleteAddress}
            style={({pressed})=>({...styles.actionButton, opacity: pressed ? 0.2 : 1})} 
            disabled={disabled}
          >
            <Ionicons
              name="trash-outline"
              size={15}
              color="#FF3B30"
            />
            <Text style={[styles.actionText, styles.deleteText]}>
              Delete
            </Text>
          </Pressable>

          {!address.isDefault && (
            <>
              <View style={styles.actionDivider} />
              <Pressable 
                onPress={setAsDefault}
                style={({pressed})=>({...styles.actionButton, opacity: pressed ? 0.2 : 1})} 
                disabled={disabled}
              > 
                <Text style={styles.actionText}>Set as Default</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
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
    paddingBottom: 16,
    paddingTop: 4,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#E8F7EE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E9E5B',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
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
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EC',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  deleteText: {
    color: '#FF3B30',
  },
  actionDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});