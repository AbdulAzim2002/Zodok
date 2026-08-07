import { ProductCard } from '@/components';
import CartPopUp from '@/components/cartPopUp';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');
const CARD_WIDTH = (width - 16 * 2 - 8) / 2;
const headerHeight = 66;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;

// Dummy static data just for UI display purposes
const recentSearches = ['Sneakers', 'Denim jacket', 'Leather bag', 'Sunglasses'];

const trendingSearches = [
  'Summer dresses',
  'Running shoes',
  'Smart watches',
  'Backpacks',
  'Wireless earbuds',
];

type category = {
    id: string,
    name: string,
    icon: 'man-outline' | 'woman-outline' | 'footsteps-outline' | 'watch-outline',
}

const categories: category[] = [
  { id: '1', name: 'Men', icon: 'man-outline' },
  { id: '2', name: 'Women', icon: 'woman-outline' },
  { id: '3', name: 'Footwear', icon: 'footsteps-outline' },
  { id: '4', name: 'Accessories', icon: 'watch-outline' },
];

const resultItems = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    brand: 'Urban Walk',
    price: 59.99,
    image: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: '2',
    name: 'Running Shoes Pro',
    brand: 'SprintX',
    price: 74.99,
    image: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: '3',
    name: 'Canvas Slip-Ons',
    brand: 'Urban Walk',
    price: 44.99,
    image: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: '4',
    name: 'Trail Runners',
    brand: 'SprintX',
    price: 89.99,
    image: 'https://picsum.photos/300/300?random=4',
  },
];

type result = {
	id: string,
	name: string,
	images: {url: string, position: number}[],
	variants: {stock: number, price: number, compareAtPrice: number}[]
}

export default function SearchScreen() {
		const {gender} = useLocalSearchParams();
		const { width: screenWidth } = useWindowDimensions();
		const {wishlist} = useAuthContext();
		const {top, bottom} = useSafeAreaInsets();
    const [searchParameter, setSearchParameter] = useState<string>('');
    const [searched, setSearched] = useState<string>('');
		const [result, setResult] = useState<result[]>([]);
    const [showProducts, setShowProducts] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const loadProducts = async () => {
        setLoading(true);
        const {data, error} = await supabase
          .from('products')
          .select(`
            id,
            name,
            product_images!inner(image_url, display_order),
            product_variants!inner(
              price,
              compare_at_price,
              stock
            )
          `)
          .order('rating', {ascending: false})
          .in('gender', ['unisex', ...(gender == undefined ? ['male', 'female'] : [gender])])
          .range(0, 20)
        
        if(error)
          console.error(error);
        else {
          setResult(data.map(item => ({
            id: item.id,
            name: item.name,
            images: item.product_images.map(item => ({url: item.image_url, position: item.display_order})),
            variants: item.product_variants.map(item => ({stock: item.stock, price: item.price, compareAtPrice: item.compare_at_price}))
          })));
          setLoading(false);
        }
      }
      loadProducts()
    }, [])

		async function search() {
      setLoading(true);
      const searchTerm = searchParameter
        .split(' ')
        .filter(item => item != '')
        .join(' ');

			const {data, error} = await supabase.rpc('search_products', {
				search_term: searchTerm,
        filter_gender: gender
			})
			if(error)
				console.log(error)
			else {
				setResult(data)
        setSearched(searchTerm)
        setShowProducts(false)
      }
      setLoading(false);
		}

		const Product: ListRenderItem<result> = useCallback(({item, index}) => {
			return (
				<>
					{
						<ProductCard
							productId={item.id}
							cardWidth={CARD_WIDTH}
							isWishlisted={wishlist.includes(item.id)}
							imageUrl={item.images.length > 0 ? item.images[0].url : ''}
							productName={item.name}
							originalPrice={item.variants[0].compareAtPrice}
							discountedPrice={item.variants[0].price}
							onPress={()=>{
								console.log(item.name);
								router.push({
									pathname: '/product/[product]',
									params: {
										product: item.name,
										name: item.name,
										id: item.id
									}
								})

							}}
						/>
					}
				</>
			);
		}, []);

  return (
    <View style={[styles.safeArea, {paddingBottom: gender == undefined ? 0 : bottom}]}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Search Bar */}
      <View>
        <View style={{height: top}}/>
        <View style={{bottom: 0, width: width, height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight, position: 'absolute', backgroundColor: 'white'}}>
          {
            gender &&
            <LinearGradient
              colors={gender == 'female' ? ['#9888e9', '#fcf','#ffebff']:['#7661e2', '#ddd7f8']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
              }}
            />
          }
        </View>
        <View style={{flexDirection: 'row', gap: 8, marginHorizontal: 16, marginVertical: 8}}>
          {
            gender &&
            <Pressable 
              style={{ borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, width: 48, padding: 4, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center'}}
              onPress={()=>{router.back()}}
            >
              <Ionicons name='chevron-back' size={24} color={'#c9c9cf'}/>
            </Pressable>
          }
          <View style={{ flex: 1, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
            <TextInput
              value={searchParameter}
              onChangeText={setSearchParameter}
              style={styles.searchInput}
              placeholder="Search for products"
              placeholderTextColor='#c9c9cf'
              onSubmitEditing={search}
              editable={!loading}
            />
          </View>
        </View>
      </View>

      <View style={{flex: 1, paddingHorizontal: 16}}>
        {
          loading ?
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={'large'}/>
          </View> :
          <>


            <FlatList
              data={result}
              renderItem={Product}
              ListHeaderComponent={() => (
                <Text style={styles.sectionTitle}>
                  {
                    showProducts ?
                    "Popular products" :
                    `Results for "${searched}"`
                  }
                </Text>
              )}
              ItemSeparatorComponent={()=>(<View style={{height: 16}}/>)}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              contentContainerStyle={{
                paddingBottom: 24,
              }}
              getItemLayout={(data, index) => (
                  {length: 200, offset: 200 * index, index}
              )}
              numColumns={2}
              keyExtractor={(item)=>(item.id)}
              showsVerticalScrollIndicator={false}
            />
          </>
        }
      </View>
			<CartPopUp bottomOffset={bottom}/>
      {
        gender == undefined &&
        <View style={{backgroundColor: '#fff', height: 60}}/>
      }
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
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
		marginTop: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 48,
    color: '#1b1b18',
    fontFamily: 'CreatoDisplay',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#18181b',
    paddingLeft: 4,
    marginVertical: 16,
    fontFamily: 'CreatoDisplayMedium'
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#1A1A1A',
    marginLeft: 6,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  trendingChipText: {
    fontSize: 12,
    color: '#1A1A1A',
    marginLeft: 6,
    fontWeight: '500',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - 32 - 30) / 4,
  },
  categoryIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F9F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#E9E9EC',
  },
  resultBody: {
    padding: 10,
  },
  resultBrand: {
    fontSize: 11,
    color: '#9B9B9B',
    marginBottom: 2,
  },
  resultName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});