import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProductCard } from "./Zodok/ProductCard";

const {height, width} = Dimensions.get('screen');

export type CategoryCarouselProps = {
  id: string,
  categorySlug: string,
  gender: string
} 

export default function CategoryCarousel({id, categorySlug, gender}:CategoryCarouselProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any>([]);
  const [categoryName, setCategoryName] = useState();
  const category = useRef<{categoryId: string, parentCategoryId: string}>({categoryId: '', parentCategoryId: ''});
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
              loadCategories();
            else {
              setProducts(item.data);
              setCategoryName(item.name);
              category.current.categoryId = item.id;
              category.current.parentCategoryId = item.parentId;
              setLoading(false);
            }
          } else
            loadCategories();
      } catch (error) {
          console.error('Error retrieving imageUrl from cache:', error);
      } 
    }
    async function loadCategories() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_products_by_category', {
        category_slug: categorySlug,
        filter_gender: gender,
      })

      if(error)
        console.log(error);
      else {
        const {data: categoryDetails, error} = await supabase.from('categories').select('id, name, parent_id').eq('slug', categorySlug).single();

        if(error)
          console.log(error)
        else {
          setProducts(data)
          setLoading(false)
          setCategoryName(categoryDetails.name)
          category.current.categoryId = categoryDetails.id
          category.current.parentCategoryId = categoryDetails.parent_id
          AsyncStorage.setItem(id, JSON.stringify({
              data,
              name: categoryDetails.name,
              id: categoryDetails.id,
              parentId: categoryDetails.parent_id,
              expirationTime: Date.now()/60000 + 360
          }));
        }
      }
    }
    loadFormLocalStorage();
  }, [])
  
  return (
    <View style={{width: '100%', paddingVertical: 8, gap: 12}}>
      <Text style={{fontFamily: 'CreatoDisplay', fontSize: 22, marginHorizontal: 16}}>{categoryName}</Text>
      {
        loading ?
        <View style={{width: width, flexDirection: 'row', gap: 8, overflow: 'hidden'}}>
          <View style={{width: 8}}/>
          <View style={{width: (width-32)/2.5, gap: 8}}>
            <View style={{width: '100%', height: (width-32)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
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
                isWishlisted={wishlist.includes(item.id)}
                productId={String(item.id)}
                productName={String(item.name)}
                originalPrice={Number(item.compare_at_price)}
                discountedPrice={Number(item.price)}
                imageUrl={String(item.image_url)}
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
                  pathname: '/category/[category]',
                  params: {
                    category: gender,
                    categoryId: category.current.parentCategoryId, 
                    section: gender,
                    subCategory: category.current.categoryId
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