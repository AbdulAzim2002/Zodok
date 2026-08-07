import { addressType, useAuthContext } from '@/hooks/use-auth-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dummy static data just for UI display purposes
const order = {
  id: '#ORD-38291',
  date: 'July 8, 2026',
  status: 'Shipped',
};

type order = {
  id: string,
  orderId: string,
  totalAmount: number,
  date: string,
  status: string,
  paymentStatus: string,
  products: product[],
  addressId: string,
  trial: boolean,
  tracking_steps: any,
}

type product = {
  id: string,
  name: string,
  price: number,
  quantity: number,
  imageUrl: string,
  color: string,
  size: string,
  trynbuy: boolean,
}

const items = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    variant: 'Size 42 / White',
    price: 59.99,
    quantity: 1,
    image: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    variant: 'Size M / Blue',
    price: 89.99,
    quantity: 2,
    image: 'https://picsum.photos/200/200?random=2',
  },
];

export default function OrderDetailsScreen() {
  const {top, bottom} = useSafeAreaInsets();
  const {orderDetails} = useLocalSearchParams();
  const {savedAddressList, addressLoading} = useAuthContext();
  const order: order = orderDetails ? JSON.parse(orderDetails as string) : {};
  const trackingSteps = [
    { id: '1', title: 'Order Placed', date: order.date, done: true },
    { id: '2', title: 'Order Confirmed', date: '', done: false },
    { id: '3', title: 'Shipped', date: '', done: false },
    { id: '4', title: 'Out for Delivery', date: '', done: false },
    { id: '5', title: 'Delivered', date: '', done: false },
  ];

  // {
  //   "trackingSteps": [
  //     { "id": "1", "title": "Order Placed", "done": true },
  //     {"id": "2", "title": "Order Confirmed", "done": false},
  //     {"id": "3", "title": "Shipped", "done": false},
  //     {"id": "4", "title": "Out for Delivery", "done": false},
  //     {"id": "5", "title": "Delivered", "done": false}
  //   ]
  // }
  const [shippingAddress, setShippingAddress] = useState<addressType>(savedAddressList.filter((item) => (item.id == order.addressId))[0]);
  function getSubTotal(products: product[]) {
    let subtotal = 0;
    for(const product of products)
      subtotal += product.price * product.quantity
    return subtotal;
  }
  const subtotal = getSubTotal(order.products);
  const discount = subtotal - order.totalAmount;

  useEffect(() => {
    setShippingAddress(savedAddressList.filter((item) => (item.id == order.addressId))[0])
  }, [addressLoading])
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: top > 12 ? top : 12}]}>
        <TouchableOpacity onPress={()=>{router.back()}} style={[styles.iconButton, {borderRadius: 8}]}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={[styles.iconButton, {backgroundColor: 'transparent'}]}>
          {/* <Ionicons name="ellipsis-horizontal" size={20} color="#1A1A1A" /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottom > 24 ? bottom : 24}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Chip */}
        <View style={styles.orderTopCard}>
          <View>
            <Text style={styles.orderId}>{order.orderId}</Text>
            <Text style={styles.orderDate}>Placed on {order.date}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        {/* Tracking Timeline */}
        <Text style={styles.sectionTitle}>Order Tracking</Text>
        <View style={styles.trackingCard}>
          {order.tracking_steps.trackingSteps.map((step: any, index: number) => (
            <View key={step.id} style={styles.trackingRow}>
              <View style={styles.trackingIconColumn}>
                <View
                  style={[
                    styles.trackingDot,
                    step.done && styles.trackingDotDone,
                  ]}
                >
                  {step.done && (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  )}
                </View>
                {index !== trackingSteps.length - 1 && (
                  <View
                    style={[
                      styles.trackingLine,
                      step.done && styles.trackingLineDone,
                    ]}
                  />
                )}
              </View>

              <View style={styles.trackingTextColumn}>
                <Text
                  style={[
                    styles.trackingTitle,
                    step.done && styles.trackingTitleDone,
                  ]}
                >
                  {step.title}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressCard}>
          {
            addressLoading ?
            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <ActivityIndicator size='large' />
            </View> :
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>{shippingAddress.name}</Text>
              <Text style={styles.addressText}>
                {shippingAddress.address}, {shippingAddress.city.length > 0 ? shippingAddress.city : shippingAddress.district}, {shippingAddress.state} {shippingAddress.pincode}
              </Text>
              <Text style={styles.phoneText}>+91 {shippingAddress.phone}</Text>
            </View>
          }
        </View>

        {/* Items */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.sectionTitle}>Items ({order.products.length})</Text>
          {
            order.trial &&
            <Text style={[styles.sectionTitle, {color: '#00a34c'}]}>TRY & BUY</Text>
          }
        </View>
        {order.products.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.itemVariant}>{item.size && `Size ${item.size}`} {item.size && item.color && '/'} {item.color}</Text>
                {
                  order.trial && item.trynbuy &&
                  <Text style={[styles.itemVariant, {color: '#00a34c'}]}>TRY & BUY</Text>
                }
              </View>
              <View style={styles.itemBottomRow}>
                {
                  item.quantity > 0 ?
                  <>
                    <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  </> :
                  <Text style={styles.itemPrice}>Trial</Text>
                }
                {/* <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text> */}
              </View>
            </View>
          </View>
        ))}

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹0.00</Text>
          </View>
          {
            discount > 0 &&
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>-₹{discount}</Text>
            </View>
          }
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>Cash on delivery</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
          <Ionicons name="chatbubble-outline" size={18} color="#1A1A1A" />
          <Text style={styles.secondaryButtonText}>Need Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Ionicons name="location-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
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
  },
  orderTopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusBadge: {
    backgroundColor: '#E9F1FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3478F6',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 4,
  },
  trackingCard: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  trackingRow: {
    flexDirection: 'row',
  },
  trackingIconColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  trackingDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingDotDone: {
    backgroundColor: '#2E9E5B',
  },
  trackingLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#E5E5EA',
    marginVertical: 2,
  },
  trackingLineDone: {
    backgroundColor: '#2E9E5B',
  },
  trackingTextColumn: {
    flex: 1,
    paddingBottom: 18,
  },
  trackingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B5',
  },
  trackingTitleDone: {
    color: '#1A1A1A',
  },
  trackingDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#6E6E73',
    lineHeight: 18,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  itemCard: {
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
  itemQty: {
    fontSize: 12,
    color: '#8E8E93',
  },
  summaryContainer: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    height: 52,
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    height: 52,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});