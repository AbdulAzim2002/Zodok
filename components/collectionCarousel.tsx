import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProductCard } from "./Zodok/ProductCard";

const {height, width} = Dimensions.get('screen');

export type CollectionCarouselProps = {
  id: string,
  collectionSlug: string,
}

type fetchData = {
  id: string
  name: string
  collection_products: collection_product[]
}

type collection_product = {
  products: product
}

type product = {
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

export default function CollectionCarousel({id, collectionSlug}:CollectionCarouselProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any>([]);
  const [collectionName, setCollectionName] = useState('');
  const {wishlist} = useAuthContext();

  useEffect(() => {
    async function loadFormLocalStorage() {
      setLoading(true);
      try {
          const storedItem = await AsyncStorage.getItem(id);
          if (storedItem) {
            const currentTime = Date.now()/60000;
            const item = JSON.parse(storedItem);
            if(item.expirationTime < currentTime)
              loadCollection();
            else {
              setProducts(item.data);
              setCollectionName(item.name);
              setLoading(false);
            }
          } else
            loadCollection();
      } catch (error) {
          console.error('Error retrieving imageUrl from cache:', error);
      } 
    }
    async function loadCollection() {
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
      .eq('slug', collectionSlug)
      .single()
      .overrideTypes<fetchData>();

      if(error)
        console.log(error);
      else {
        setCollectionName(data.name);
        const collectionData = data.collection_products.filter((_, index) => index < 5).map(({products}) => ({
          id: products.id,
          name: products.name,
          price: products.product_variants[0].price,
          compareAtprice: products.product_variants[0].compare_at_price,
          imageUrl: products.product_images[0].image_url,
          slug: products.slug,
        }))
        setProducts(collectionData)
        AsyncStorage.setItem(id, JSON.stringify({
              data: collectionData,
              name: data.name,
              expirationTime: Date.now()/60000 + 360
          }));
        setLoading(false)

      }
    }
    loadFormLocalStorage();
  }, [])
  
  return (
    <View style={{width: '100%', paddingVertical: 8, gap: 12}}>
      <Text style={{fontFamily: 'CreatoDisplay', fontSize: 22, marginHorizontal: 16}}>{collectionName}</Text>
      {
        loading ?
        <View style={{width: width, flexDirection: 'row', gap: 8, overflow: 'hidden'}}>
          <View style={{width: 8}}/>
          <View style={{width: (width-32)/2.5, gap: 8}}>
            <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
            <View style={{gap: 4}}>
              <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
            </View>
          </View>
          <View style={{width: (width-32)/2.5, gap: 8}}>
            <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
            <View style={{gap: 4}}>
              <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
            </View>
          </View>
          <View style={{width: (width-32)/2.5, gap: 8}}>
            <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
            <View style={{gap: 4}}>
              <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
              <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
            </View>
          </View>
        </View> :
          <ScrollView
          horizontal={true}
          contentContainerStyle={{gap: 8}}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{width: 8}}/>
          {
            products.map((item:any) => (
              <ProductCard
                key={String(item.id)}
                productId={String(item.id)}
                isWishlisted={wishlist.includes(item.id)}
                productName={String(item.name)}
                originalPrice={Number(item.compareAtprice)}
                discountedPrice={Number(item.price)}
                imageUrl={item.imageUrl}
                cardWidth={(width-32)/2.5}
                onPress={()=>{
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
            ))
          }
          {
            products.length >= 5 &&
            <Pressable 
              style={{
                width: (width-32)/5, 
                height: (width-32)*8/15,  
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e4e4e7',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                router.push({
                  pathname: '/collection/[collection]',
                  params: {
                    collection: collectionSlug,
                    name: collectionName
                  }
                })
              }}
            >
              <Ionicons name="chevron-forward" size={18} color='#787887'/>
              <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>See</Text>
              <Text style={{fontFamily: 'CreatoDisplay', color: '#787887'}}>All</Text>
            </Pressable>
          }
          <View style={{width: 8}}/>
        </ScrollView>
      }
    </View>
  )
}