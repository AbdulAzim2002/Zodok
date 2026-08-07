import StarIcon from '@/assets/svg/starIcon';
import { ProductCard } from '@/components';
import CartPopUp from '@/components/cartPopUp';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

type fetchData = {
  id: string
  name: string
  collection_products: collection_product[]
}

type collection_product = {
  products: dproduct
}

type dproduct = {
  id: string
  name: string
  slug: string
  product_variants: product_variant[]
  product_images: product_image[]
}

type product_variant = {
  price: number
  compare_at_price: number
}

type product_image = {
  image_url: string
}

type product = {
	id: string,
	name: string,
	slug: string,
	product_images: product_image[] | null,
	product_variants: product_variant[],
}

export default function CollectionScreen() {
  const {collection, name} = useLocalSearchParams();
	const {top, bottom} = useSafeAreaInsets();
	const {wishlist, profile} = useAuthContext();
	const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          name,
          collection_products (
            products!collection_products_product_id_fkey (
              id,
              name,
              slug,
              product_variants (
                price,
                compare_at_price
              ),
              product_images (
                image_url
              )
            )
          )
        `)
        .eq('slug', collection)
        .single()
        .overrideTypes<fetchData>();

        if(error)
          console.log(error);
        else {
          const collectionData:product[] = data.collection_products.filter((_, index) => index < 5).map(({products}) => ({
            id: products.id,
            name: products.name,
            slug: products.slug,
            product_variants: products.product_variants,
            product_images: products.product_images
          }))
          setProducts(collectionData)
          setLoading(false)
        }
      }
			fetchProducts();
    }, [])

    const ListHeader = () => (
      <View style={{flexDirection: 'row', marginVertical: 8, marginHorizontal: 8}}>
        <StarIcon/>
        <Text style={{color: 'black', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}> {name}</Text>
        {/* <Text style={{color: 'grey', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}> for {gender == 'female' ? 'Women' : 'Men'}</Text> */}
      </View>
    );

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
        <View style={{height: 76, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between'}}>
          <Pressable 
            style={{ borderRadius: 12, backgroundColor: '#fff', borderColor: '#f1f1f3', borderWidth: 1, height: 48, width: 48, padding: 4, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center'}}
            onPress={()=>{router.back()}}
          >
            <Ionicons name='chevron-back' size={24} color={'#aeaeb7'}/>
          </Pressable>
          <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 18, color: '#18181b'}}>{name}</Text>
          <View style={{ height: 48, width: 48}} />
        </View>
      </View>

      {
        loading ?
        <View style={{paddingHorizontal: 16, flex: 1}}>
          {/* <ListHeader/> */}
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large'/>
          </View>
        </View> :
        <>
          <FlatList
            data={products}
            renderItem={Product}
            // ListHeaderComponent={ListHeader}
            ItemSeparatorComponent={()=>(<View style={{height: 16}}/>)}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
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
          
        </>
      }
      <CartPopUp />
      <View style={{height: bottom, backgroundColor: '#fff'}}/>
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