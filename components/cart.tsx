import { cartItemType, useAuthContext } from '@/hooks/use-auth-context';
import { useStateContext } from '@/hooks/use-state-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function Cart() {
  const {cart} = useAuthContext();
  return (
    <View style={{flexDirection: 'column-reverse', gap: 12}}>
      {/* Cart Items */}
      {cart.map((item) => (
        <CartItemTemplate key={item.id} item={item}/>
      ))}
    </View>
  );
}

function CartItemTemplate({item}:{item: cartItemType}) {
  const {profile, updateCart, cart} = useAuthContext();
  const {trynbuy} = useStateContext();
  const [quantity, setQuantity] = React.useState<number>(item.quantity);
  const timer = React.useRef<number>(null);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [cardWidth, setCardWidth] = React.useState<number>(0);
  useEffect(()=>{
    setQuantity(item.quantity);
  }, [cart])

  async function removeItem() {
    const response = await supabase
    .from('cart_items')
    .delete()
    .eq('id', item.id)
    .eq('user_id', profile.user.id)
    if(response.error)
      console.log(response.error)
    else
      updateCart(profile.user.id)
  }

  async function changeQuantity(quantity: number) {
    if(timer.current != null)
      clearTimeout(timer.current)
    const change = async () =>{
      if(quantity < 1) {
        removeItem();
        return;
      } else if(quantity > item.varient.stock) {
        console.log('Limited stock availabel')
        setQuantity(item.varient.stock);
        return;
      }
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: quantity })
        .eq('id', item.id)
        .eq('user_id', profile.user.id)
      if(error)
        console.log(error);
      else
        updateCart(profile.user.id)
    }
    timer.current = setTimeout(change,200);
  }

  return (
    <View style={styles.cartItem} onLayout={({nativeEvent:{layout}})=>{setCardWidth(layout.width)}}>
      <Image source={{ uri: item.varient.info.image[0].url }} style={styles.itemImage} />

      <View style={{gap: 8, flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{gap: 8}}>
            <Text style={{fontFamily: 'CreatoDisplay', fontSize: 14, color:'#484851', width: cardWidth-139}} numberOfLines={1} ellipsizeMode='tail'>
              {item.varient.info.name}
            </Text>
            <View style={{flexDirection: 'row', gap: 4}}>
              <Text style={{fontSize: 18, color: '#18181b', fontFamily: 'CreatoDisplay'}}>₹{(item.varient.price)}</Text>
              <Text style={{fontSize: 14, color: '#93939f', fontFamily: 'CreatoDisplay', verticalAlign:'bottom', textDecorationLine: 'line-through'}}>₹{(item.varient.compare_at_price)}</Text>
              {
                trynbuy &&
                (
                  item.varient.info.trynbuy ?
                  <Text style={{color: '#00a34c', fontFamily: 'CreatoDisplayMedium', verticalAlign:'bottom', fontSize: 14}}>TRY & BUY</Text>:
                  <Text style={{color: '#484851', fontFamily: 'CreatoDisplay', verticalAlign:'bottom', fontSize: 14}}>Trial Unavailable</Text>
                )
              }
            </View>
          </View>
          <Pressable
            style={(state)=>{
              return {
                opacity: state.pressed ? 0.2 : 1, 
                height: 32,
                width: 32,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#e4e4e7',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }}
            onPress={async ()=>{
              setDisabled(true);
              await removeItem();
              setDisabled(false);
            }}
            disabled={disabled}
          >
            <Ionicons name="trash-outline" size={16} color="#9B9B9B" />
          </Pressable>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7'}}>
              <Text style={{fontFamily: 'CreatoDisplay', fontSize: 12, color: '#18181b'}}>{item.varient.size && `Size: ${item.varient.size}`} {item.varient.size && item.varient.color && '/'} {item.varient.color}</Text>
            </View>
            <View style={{padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7', flexDirection: 'row'}}>
              <TouchableOpacity 
                style={{height: 16, width: 16}}
                onPress={()=>{
                  const qty = quantity > 0 ? quantity-1: 0
                  setQuantity(qty);
                  changeQuantity(qty);
                }}
              >
                <Ionicons name="remove" size={16} color="#1A1A1A" />
              </TouchableOpacity>
              <Text style={{height: 16, width: 16, textAlign: 'center', fontFamily: 'CreatoDisplay', fontSize: 12, color: '#18181b'}}>{quantity}</Text>
              <TouchableOpacity 
                style={{height: 16, width: 16}}
                onPress={()=>{
                  const qty = quantity+1
                  setQuantity(qty);
                  changeQuantity(qty);
                }}
              >
                <Ionicons name="add" size={16} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cartItem: {
    flexDirection: 'row',
    gap: 8,
  },
  itemImage: {
    width: 75,
    height: 100,
    borderRadius: 8,
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
  ItemPriceContainer: {
    flexDirection: 'row',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ItemCompareAtPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    textAlignVertical: 'bottom',
    fontWeight: '700',
    color: '#5f5f5f',
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
});