import { WishlistFill, WishlistLine } from "@/assets/svg/NavBarIcons";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, ListRenderItem, Pressable, View } from "react-native";

type productImagesType = {
	images: {image_url:string}[],
	id: string,
}

const {height, width} = Dimensions.get('screen');

export const ProductImages = memo(({images=[], id}:productImagesType) => {
	const {wishlist, updateWishlist, profile:{user}} = useAuthContext();
	const [index, setIndex] = useState<number>(0);
	const [wishlisted, setWishlisted] = useState(wishlist.some(item => item == id));
	const [loading, setLoading] = useState(false);

	const addToWishlist = async () => {
		setLoading(true);
		setWishlisted(true);
		console.log("Ading to wishlist")

		const {error} = await supabase
			.from('wishlist')
			.insert({product_id: id, user_id: user.id})
		
		if(error)
			setWishlisted(false)
		else
			updateWishlist(user.id);
		setLoading(false);
	}

	const removeFromWishlist = async () => {
		setLoading(true);
		setWishlisted(false);
		
		console.log("removing from wishlist")

		const {error} = await supabase
			.from('wishlist')
			.delete()
			.eq('product_id', id);
		
		if(error)
			setWishlisted(true);
		else
			updateWishlist(user.id);

		setLoading(false);
	}

	useEffect(() => {
		setWishlisted(wishlist.some(item => item == id));
	}, [wishlist])

	const Images: ListRenderItem<{image_url:string}> =  useCallback(({item}) => (
		<View style={{height: '100%', width: width, alignItems: 'center', justifyContent: 'center'}}>
			<Image
				source={{uri: item.image_url}}
				style={{height: '100%', width: '100%'}}
			/>
			</View>
	), [])
	return (
		<View>
			<FlatList
				data={images}
				renderItem={Images}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{height: 4*width/3, backgroundColor: '#eeebfb'}}
				keyExtractor={(item, index) => item.image_url}
				onScroll={({nativeEvent})=>{setIndex((nativeEvent.contentOffset.x)/width)}}
			/>
			<View style={{flexDirection: 'row', justifyContent: 'center', padding: 6, gap: 6, position: 'absolute', width, bottom: 0}}>
				{
					images.length > 1 &&
					(images.map((item, idx)=>{
						return(
							<View key={idx} 
								style={{
									height: 8, 
									width: 8, 
									borderRadius: 6, 
									borderWidth: 1, 
									backgroundColor: index == idx ? "#5439DB" : "#ffffff57",
									borderColor: index == idx ? "#bbb0f1" : "#e4e4e7",
								}}
							/>
						)
					}))
				}
			</View>
			<Pressable 
				style={{ 
					borderRadius: 12, 
					backgroundColor: '#fff', 
					height: 48, 
					width: 48, 
					padding: 4, 
					flexDirection: 'row', 
					gap: 16, 
					alignItems: 'center', 
					justifyContent: 'center',
					position: 'absolute',
					margin: 16
				}}
				onPress={()=>{router.back()}}
			>
				<Ionicons name='chevron-back' size={24} color={'#c9c9cf'}/>
			</Pressable>
			<Pressable 
				style={{ 
					borderRadius: 24, 
					backgroundColor: '#fff', 
					height: 48, 
					width: 48, 
					padding: 4, 
					flexDirection: 'row', 
					gap: 16, 
					alignItems: 'center', 
					justifyContent: 'center',
					position: 'absolute',
					margin: 16,
					right: 0,
					bottom: 0,
				}}
				onPress={wishlisted ? removeFromWishlist : addToWishlist}
				disabled={loading}
			>
				{wishlisted ? (
					<WishlistFill width={24} height={21} style={{marginTop: 3}} />
				) : (
					<WishlistLine width={24} height={21} style={{marginTop: 3}} />
				)}
			</Pressable>
		</View>
	)
});