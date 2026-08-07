import { WishlistFill } from '@/assets/svg/NavBarIcons';
import { ProductCard } from '@/components';
import CartPopUp from '@/components/cartPopUp';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 8) / 2;

type product = {
	id: string,
	name: string,
	slug: string,
	product_images: {image_url: string}[] | null,
	product_variants: productVarients[],
}
type productVarients = {
	color: string,
	size: string,
	price: number,
	compare_at_price: number,
	stock: number,
}

// Dummy static data just for UI display purposes
const wishlistItems = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    brand: 'Urban Walk',
    price: 59.99,
    oldPrice: 79.99,
    image: 'https://picsum.photos/300/300?random=1',
    inStock: true,
  },
  {
    id: '2',
    name: 'Denim Jacket',
    brand: 'BlueRoot',
    price: 89.99,
    oldPrice: null,
    image: 'https://picsum.photos/300/300?random=2',
    inStock: true,
  },
  {
    id: '3',
    name: 'Leather Backpack',
    brand: 'Nomad Co.',
    price: 129.99,
    oldPrice: 159.99,
    image: 'https://picsum.photos/300/300?random=3',
    inStock: false,
  },
  {
    id: '4',
    name: 'Aviator Sunglasses',
    brand: 'SunRay',
    price: 34.99,
    oldPrice: null,
    image: 'https://picsum.photos/300/300?random=4',
    inStock: true,
  },
];

export default function WishlistScreen({tabNavigator=true}:{tabNavigator?: boolean}) {
	const {top, bottom} = useSafeAreaInsets();
	const {wishlist, profile} = useAuthContext();
	const [products, setProducts] = useState<product[]>([]);
	const Product: ListRenderItem<product> = useCallback(({item, index}) => {
		return (
			<>
				{
					<ProductCard
						productId={item.id}
						cardWidth={CARD_WIDTH}
						isWishlisted={wishlist.includes(item.id)}
						imageUrl={item.product_images ? item.product_images[0].image_url : ''}
						productName={item.name}
						originalPrice={item.product_variants[0].compare_at_price}
						discountedPrice={item.product_variants[0].price}
						onPress={()=>{
							console.log(item.name);
							router.push({
								pathname: '/product/[product]',
								params: {
									product: item.slug,
									name: item.name,
									id: item.id,
								}
							})

						}}
					/>
				}
			</>
		);
	}, [wishlist]);

    useEffect(()=>{
			const fetchProducts = async () => {
				const {data, error} = await supabase
				.from('wishlist')
				.select(`
					products(
							id,
							name,
							slug,
							product_images!inner(image_url),
							product_variants!inner(
									price,
									compare_at_price,
									stock
							)
					)
				`)
				.eq('user_id', profile.user.id)
				.order('display_order', {
					referencedTable: 'products.product_variants',
					ascending: true,
				})
				.order('display_order', {
					referencedTable: 'products.product_images',
					ascending: true,
				})
				.overrideTypes<{products:product}[]>();
				if(error)
						console.log(error)
				else {
						const productsList: product[] | undefined = data?.map(({products})=>(products));
						setProducts(productsList);
				}
			}
			fetchProducts();
    }, [wishlist])

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      {/* Header */}
      <View style={{
          paddingTop: top, 
          boxShadow:[{
            offsetX: 0,
            offsetY: 0,
            blurRadius: '4px',
            spreadDistance: '0px',
            color: '#e4e4e7',
            inset: false,
          }]
        }}
      >
        {
          tabNavigator ?
          <View style={{height: 76, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'space-around'}}>
            <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 18, color: '#18181b'}}>WishList</Text>
          </View> :
          <View style={{height: 76, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between'}}>
            <Pressable 
              style={{ borderRadius: 12, backgroundColor: '#fff', borderColor: '#f1f1f3', borderWidth: 1, height: 48, width: 48, padding: 4, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center'}}
              onPress={()=>{router.back()}}
            >
              <Ionicons name='chevron-back' size={24} color={'#aeaeb7'}/>
            </Pressable>
            <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 18, color: '#18181b'}}>WishList</Text>
            <View style={{ height: 48, width: 48}} />
          </View>
        }
      </View>

			<FlatList
				data={products}
				renderItem={Product}
        ListHeaderComponent={()=>(<Text style={{margin: 16, fontSize: 22, fontFamily: 'CreatoDisplayMedium'}}><WishlistFill height={18} width={20.5}/> Your Wishlist</Text>)}
				ItemSeparatorComponent={()=>(<View style={{height: 16}}/>)}
				columnWrapperStyle={{justifyContent: 'space-between'}}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingBottom: 24,
				}}
				getItemLayout={(data, index) => (
						{length: 200, offset: 200 * index, index}
				)}
				numColumns={2}
				keyExtractor={(item)=>(item.id)}
				showsVerticalScrollIndicator={false}
				// refreshControl={
				//     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				// }
			/>
      <CartPopUp />
      {
        tabNavigator &&
        <View style={{height: 60, backgroundColor: '#fff'}}/>
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
  itemCount: {
    fontSize: 13,
    color: '#8E8E93',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#E9E9EC',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26,26,26,0.75)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  stockOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    padding: 10,
  },
  itemBrand: {
    fontSize: 11,
    color: '#9B9B9B',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 12,
    color: '#B0B0B5',
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    height: 36,
  },
  addButtonDisabled: {
    backgroundColor: '#EDEDEF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButtonTextDisabled: {
    color: '#9B9B9B',
  },
});