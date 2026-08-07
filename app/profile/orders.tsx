import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface statusStyles {
  [statue: string]: { bg: string, color: string }
}

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
  tracking_steps: any
}

type trackingStep = { id: string, title: string, done: boolean }

type product = {
  id: string,
  name: string,
  price: number,
  quantity: number,
  imageUrl: string,
  color: string,
  size: string,
  trynbuy: boolean
}

type rawOrderData = {
  id: string,
  address_id: string,
  status: string,
  total_amount: number,
  payment_status: string,
  created_at: string,
  order_number: string,
  order_items: order_items[]
}

type order_items = {
  quantity: number,
  price: number,
  product_variants: product_variants,
}

type product_variants = {
  color: string,
  size: string,
  products: products
}

type products = {
  id: string,
  name: string,
  trynbuy: boolean,
  product_images: {image_url: string}[] 
}

const statusStyles: statusStyles = {
  Delivered: { bg: '#E8F7EE', color: '#2E9E5B' },
  Shipped: { bg: '#E9F1FF', color: '#3478F6' },
  Processing: { bg: '#FFF4E5', color: '#FF9500' },
  Cancelled: { bg: '#FDEAEA', color: '#FF3B30' },
};

const orderStatus = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  const {top, bottom} = useSafeAreaInsets()
  const [orders, setOrders] = useState<order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<number>(0)
  useEffect(() => {
    async function fetchOrders() {
      console.log('loading...')
      setLoading(true)
      const {data, error} = await supabase
        .from('orders')
        .select(`
          id,
          address_id,
          status,
          total_amount,
          payment_status,
          created_at,
          order_number,
          address_id,
          trial,
          tracking_steps,
          order_items(
            quantity,
            price,
            product_variants(
              color,
              size,
              products(
                id,
                name,
                trynbuy,
                product_images(
                  image_url
                )
              )
            )
          )
        `)
        .order('created_at')
        .overrideTypes<rawOrderData[]>()
        
      if (error)
        console.log(error)
      else {
        setOrders(data.map((item) => ({
          id: item.id,
          orderId: item.order_number,
          totalAmount: item.total_amount,
          date: formatedDate(item.created_at),
          status: item.status,
          paymentStatus: item.payment_status,
          products: item.order_items.map((item) => ({
            id: item.product_variants.products.id,
            name: item.product_variants.products.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.product_variants.products.product_images[0].image_url,
            color: item.product_variants.color,
            size: item.product_variants.size,
            trynbuy: item.product_variants.products.trynbuy
          })),
          addressId: item.address_id,
          trial: item.trial,
          tracking_steps: item.tracking_steps
        })))
      }
      setLoading(false)
      console.log('loaded')
    }
    fetchOrders()
  }, [])

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: top > 12 ? top : 12}]}>
        <TouchableOpacity onPress={()=>{router.back()}} style={[styles.iconButton, {borderRadius: 8}]}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={[styles.iconButton, {backgroundColor: 'transparent'}]}>
          {/* <Ionicons name="search-outline" size={20} color="#1A1A1A" /> */}
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {orderStatus.map(
            (tab, index) => (
              <Pressable
                key={index}
                style={[styles.tab, index === filter && styles.tabActive]}
                onPress={()=>{setFilter(index)}}
              >
                <Text
                  style={[
                    styles.tabText,
                    index === filter && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            )
          )}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottom > 24 ? bottom : 24}]}
        showsVerticalScrollIndicator={false}
      >
        {orders.filter(item => item.status == orderStatus[filter] || orderStatus[filter] == 'All').map((order) => {
          const statusStyle = statusStyles[order.status];
          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              activeOpacity={0.85}
              onPress={() => {
                router.push({
                  pathname:'/profile/orderDetails', 
                  params: {
                    orderDetails: JSON.stringify(order)
                  }
                })
              }}
            >
              <View style={styles.orderTopRow}>
                <Text style={styles.orderId}>{order.orderId}</Text>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
                >
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {order.status}
                  </Text>
                </View>
              </View>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.orderDate}>{order.date}</Text>
                {
                  order.trial &&
                  <Text style={[styles.orderDate, {color: '#00a34c'}]}>TRY & BUY</Text>
                }
              </View>

              <View style={styles.orderBottomRow}>
                <View style={styles.imagesRow}>
                  {order.products.slice(0, 3).map((product, index) => (
                    <Image
                      key={index}
                      source={{ uri: product.imageUrl }}
                      style={[
                        styles.thumbImage,
                        { marginLeft: index === 0 ? 0 : -12, zIndex: 3 - index },
                      ]}
                    />
                  ))}
                  {order.products.length > 3 && (
                    <View style={styles.moreItemsBadge}>
                      <Text style={styles.moreItemsText}>
                        +{order.products.length - 3}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.itemsCountText}>
                    {order.products.length} {order.products.length > 1 ? 'items' : 'item'}
                  </Text>
                  <Text style={styles.orderTotal}>
                    ₹{order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.footerButton}>
                  <Text style={styles.footerButtonText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function formatedDate(date: string) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'NOv',
    'Dec'
  ]
  const year = date.slice(0, 4)
  const month = months[Number(date.slice(5, 7))]
  const day = Number(date.slice(8, 10))
  return `${month} ${day}, ${year}`
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
  tabsRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 36,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    height: 36,
  },
  tabActive: {
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E9E9EC',
    borderWidth: 2,
    borderColor: '#F9F9FB',
  },
  moreItemsBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EDEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
    borderWidth: 2,
    borderColor: '#F9F9FB',
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E6E73',
  },
  orderInfo: {
    alignItems: 'flex-end',
  },
  itemsCountText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EC',
    marginTop: 12,
    paddingTop: 10,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 2,
  },
  reorderButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});