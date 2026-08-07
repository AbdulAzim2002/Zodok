import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const {height, width} = Dimensions.get('screen');

export type CollectionBannerProps = {
  id: string
  label:string
  gender: string
}

export default function CollectionBanner({id, label, gender}:CollectionBannerProps) {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    async function loadFormLocalStorage() {
      setLoading(true);
      try {
          const storedItem = await AsyncStorage.getItem(id);
          if (storedItem) {
            const currentTime = Date.now()/60000;
            const item = JSON.parse(storedItem);
            if(item.expirationTime > currentTime)
              loadColllections();
            else {
              setCollections(item.data);
              setLoading(false);
            }
          } else
            loadColllections();
      } catch (error) {
          console.error('Error retrieving imageUrl from cache:', error);
      } 
    }
    async function loadColllections() {
      setLoading(true);
      const {data, error} = await supabase
      .from('collections')
      .select(`
        id,
        name,
        banner_url
      `)
      .eq('is_featured', true)
      .in('gender', ['unisex', gender])
      
      if(error)
        console.log(error);
      else{
        setCollections(data);
        AsyncStorage.setItem(id, JSON.stringify({
            data,
            expirationTime: Date.now()/60000 + 360
        }));
      }
      setLoading(false)
    }
    loadFormLocalStorage();
  }, []);
  
  return (
    <View style={{width: '100%', paddingVertical: 8, gap: 8}}>
      <Text style={{fontFamily: 'CreatoDisplay', fontSize: 22, marginHorizontal: 16}}>{label}</Text>
      {
        loading ?
        <View style={{width: width, flexDirection: 'row', gap: 8, overflow: 'hidden'}}>
          <View style={{width: 8}}/>
          <View style={{aspectRatio: 15/8, width: (width-16)/1.26, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
          <View style={{aspectRatio: 15/8, width: (width-16)/1.26, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
        </View> :
          <ScrollView
          horizontal={true}
          contentContainerStyle={{gap: 8}}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{width: 8}}/>
          {
            collections.map((item:any) => (
              <Banner key={item.id} url={item.banner_url}/>
            ))
          }
          <View style={{width: 8}}/>
        </ScrollView>
      }
    </View>
  )
}

function Banner({url}:{url:string}) {
  return(
    <Pressable style={{backgroundColor: 'lightgrey', borderRadius: 8}}>
      <Image 
        style={{
          aspectRatio: 15/8, 
          width: (width-16)/1.26,
          borderRadius: 8
        }} 
        contentFit="cover" 
        contentPosition="top"
        source={{uri: url}}
      />
    </Pressable>
  )
}