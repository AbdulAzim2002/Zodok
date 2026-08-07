import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 14) / 2;

// Dummy static data just for UI display purposes
const categories = [
  { id: '1', name: 'Women', image: 'https://picsum.photos/200/200?random=11' },
  { id: '2', name: 'Men', image: 'https://picsum.photos/200/200?random=12' },
  { id: '3', name: 'Kids', image: 'https://picsum.photos/200/200?random=13' },
  { id: '4', name: 'Bags', image: 'https://picsum.photos/200/200?random=14' },
  { id: '5', name: 'Shoes', image: 'https://picsum.photos/200/200?random=15' },
];

const newArrivals = [
  {
    id: '1',
    name: 'Oversized Cotton Shirt',
    brand: 'Norra',
    price: 42.99,
    image: 'https://picsum.photos/300/300?random=21',
  },
  {
    id: '2',
    name: 'Pleated Midi Skirt',
    brand: 'Everleigh',
    price: 54.5,
    image: 'https://picsum.photos/300/300?random=22',
  },
  {
    id: '3',
    name: 'Wool Blend Coat',
    brand: 'Norra',
    price: 129.0,
    image: 'https://picsum.photos/300/300?random=23',
  },
];

const featuredProducts = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    brand: 'Urban Walk',
    price: 59.99,
    oldPrice: 79.99,
    rating: 4.6,
    image: 'https://picsum.photos/300/300?random=31',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    brand: 'BlueRoot',
    price: 89.99,
    oldPrice: null,
    rating: 4.8,
    image: 'https://picsum.photos/300/300?random=32',
  },
  {
    id: '3',
    name: 'Leather Crossbody Bag',
    brand: 'Nomad Co.',
    price: 74.99,
    oldPrice: 94.99,
    rating: 4.4,
    image: 'https://picsum.photos/300/300?random=33',
  },
  {
    id: '4',
    name: 'Aviator Sunglasses',
    brand: 'SunRay',
    price: 34.99,
    oldPrice: null,
    rating: 4.5,
    image: 'https://picsum.photos/300/300?random=34',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.headerTitle}>Find your style</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="bag-outline" size={20} color="#1A1A1A" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name="search" size={18} color="#9B9B9B" />
          <Text style={styles.searchPlaceholder}>Search for products, brands...</Text>
          <Ionicons name="options-outline" size={18} color="#1A1A1A" />
        </TouchableOpacity>

        {/* Promo Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://picsum.photos/600/300?random=99' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTag}>New Season</Text>
            <Text style={styles.bannerTitle}>Up to 40% Off</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <Text style={styles.categoryLabel}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Arrivals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newArrivalsRow}
        >
          {newArrivals.map((item) => (
            <TouchableOpacity key={item.id} style={styles.arrivalCard}>
              <Image source={{ uri: item.image }} style={styles.arrivalImage} />
              <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={15} color="#1A1A1A" />
              </TouchableOpacity>
              <View style={styles.arrivalBody}>
                <Text style={styles.arrivalBrand}>{item.brand}</Text>
                <Text style={styles.arrivalName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.arrivalPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Flash Sale Banner */}
        <View style={styles.flashBanner}>
          <View style={styles.flashLeft}>
            <Ionicons name="flash" size={22} color="#FF9500" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.flashTitle}>Flash Sale</Text>
              <Text style={styles.flashSubtitle}>Ends in 06:42:18</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.flashButton}>
            <Text style={styles.flashButtonText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {featuredProducts.map((item) => (
            <TouchableOpacity key={item.id} style={styles.productCard}>
              <View style={styles.productImageWrapper}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity style={styles.heartButtonSmall}>
                  <Ionicons name="heart-outline" size={14} color="#1A1A1A" />
                </TouchableOpacity>
                {item.oldPrice && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>
                      -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.productBody}>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FF9500" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  {item.oldPrice && (
                    <Text style={styles.oldPrice}>${item.oldPrice.toFixed(2)}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 18,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#9B9B9B',
    marginLeft: 8,
  },
  banner: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22,
    height: 160,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#E9E9EC',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,26,0.35)',
    padding: 18,
    justifyContent: 'center',
  },
  bannerTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginLeft: 5,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  categoriesRow: {
    paddingBottom: 22,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E9E9EC',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  newArrivalsRow: {
    paddingBottom: 22,
  },
  arrivalCard: {
    width: 150,
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
  },
  arrivalImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E9E9EC',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalBody: {
    padding: 10,
  },
  arrivalBrand: {
    fontSize: 10,
    color: '#9B9B9B',
    marginBottom: 2,
  },
  arrivalName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  arrivalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  flashBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF4E5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },
  flashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  flashSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  flashButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flashButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#E9E9EC',
  },
  heartButtonSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productBody: {
    padding: 10,
  },
  productBrand: {
    fontSize: 11,
    color: '#9B9B9B',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 11,
    color: '#B0B0B5',
    textDecorationLine: 'line-through',
  },
});