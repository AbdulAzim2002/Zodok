import StarIcon from '@/assets/svg/starIcon';
import { ProductCard } from '@/components';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ListRenderItem, Pressable, RefreshControl, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { SvgUri } from "react-native-svg";


const { width, height } = Dimensions.get('screen');

const headerHeight = 60;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;

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

type category = {
	id: string
  name: string, 
  slug: string, 
  image_url: string[]
}
export default function Category() {

	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const router = useRouter();
	const { category, categoryId, section, categoryName, subCategory } = useLocalSearchParams();
	const [parentCategoryName, setparentCategoryName] = useState<string>(String(categoryName))
	const [catogeries, setCatogeries] = useState<category[]>([])
	const [products, setProducts] = useState<product[]>([]);
	const [selectedCatogery, setSelectedCatogery] = useState(0);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [loading, setLoading] = useState(true);
	const insets = useSafeAreaInsets();
	const sideTabPosition = useSharedValue(8);
	const categoriesIds = useRef<string[]>([]);
	const {wishlist} = useAuthContext();
	const { width: screenWidth } = useWindowDimensions();

	useEffect(()=>{
		setLoadingProducts(true);
		sideTabPosition.value = withSpring(selectedCatogery*82+8);
		const loadProducts = async () => {
			const { data, error } = await supabase
				.from('products')
				.select(`
					id,
					name,
					slug,
					product_images!inner(image_url),
					product_variants!inner(
						price,
						compare_at_price,
						stock
					)
				`)
				.eq('category_id', catogeries[selectedCatogery].id)
				.in('gender', [section, 'unisex'])
				.order('rating')
				.order('display_order', {
					referencedTable: 'product_variants',
					ascending: true,
				})
				.order('display_order', {
					referencedTable: 'product_images',
					ascending: true,
				})
				.overrideTypes<product[]>();

			if(error) {
				console.log(error);
				setProducts([]);
			} else {
				setProducts(data);
			}
			setLoadingProducts(false);
		};

		const loadAllProducts = async () => {
			const { data, error } = await supabase
				.from('products')
				.select(`
					id,
					name,
					slug,
					product_images!inner(image_url),
					product_variants!inner(
						color,
						size,
						price,
						compare_at_price,
						stock
					)
				`)
				.in('category_id', categoriesIds.current)
				.in('gender', [section, 'unisex'])
				.order('rating')
				.order('display_order', {
					referencedTable: 'product_variants',
					ascending: true,
				})
				.order('display_order', {
					referencedTable: 'product_images',
					ascending: true,
				})
				.overrideTypes<product[]>();

			if(error) {
				console.log(error);
				setProducts([]);
			} else
				setProducts(data);
			setLoadingProducts(false);
		};

		if(catogeries.length > 0) {
			if(selectedCatogery)
				loadProducts();
			else
				loadAllProducts();
		}

	}, [catogeries, selectedCatogery]);

	useEffect(()=>{
		setLoading(true);
		const loadCatogeroies = async () => {
			console.log(`Loading ${section} categories`)
			const { data, error } = await supabase
			.from('categories')
			.select('id, name, categories(id, name, slug, image_url)')
			.eq(categoryId ? 'id':'slug', categoryId || category)
			.in('categories.gender', [section, 'unisex'])
			.order('display_order', {referencedTable: 'categories', ascending: true})
			.single();

			if(error)
				console.log(error);
			else {
				setparentCategoryName(data.name);
				setCatogeries([ {id: data.id, name: 'All', slug: 'all', image_url: ["https://xeilqvoxdkdcuwisxpap.supabase.co/storage/v1/object/public/product-images/categories/all.svg", "https://xeilqvoxdkdcuwisxpap.supabase.co/storage/v1/object/public/product-images/categories/all.svg"]}, ...data.categories.filter((item)=>(item.name!='Uncategorized'))]);
				categoriesIds.current = data.categories.map((item)=>(item.id));
				if(subCategory)
					setSelectedCatogery(Math.max(data.categories.findIndex(item => item.id == subCategory)+1, 0))
			}
			setLoading(false);
		};
		loadCatogeroies();
	}, []);

	const Product: ListRenderItem<product> = useCallback(({item, index}) => {
		const cardWidth = Math.min((screenWidth - 32) / 2.5, 180);
		return (
			<>
				{
					<ProductCard
						productId={item.id}
						cardWidth={cardWidth}
						isWishlisted={wishlist.includes(item.id)}
						imageUrl={item.product_images ? item.product_images[0].image_url : ''}
						productName={item.name}
						originalPrice={item.product_variants[0].compare_at_price}
						discountedPrice={item.product_variants[0].price}
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
					
				}
			</>
		);
	}, []);

	const ListHeader = () => (
		<View style={{flexDirection: 'row', marginVertical: 8, marginHorizontal: 8}}>
			<StarIcon/>
			<Text style={{color: 'black', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}> {selectedCatogery > 0 ? catogeries[selectedCatogery].name : parentCategoryName}</Text>
			<Text style={{color: 'grey', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}> for {section == 'female' ? 'Women' : 'Men'}</Text>
		</View>
	);

	return(
		<View style={{backgroundColor: "#FFF"}}>
			<View>
				<View style={{height: insets.top}}/>
				<View style={{bottom: 0, width: width, height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight, position: 'absolute', backgroundColor: 'white'}}>
					<LinearGradient
						colors={section == 'female' ? ['#9888e9', '#fcf','#ffebff']:['#7661e2', '#ddd7f8']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
						}}
					/>
				</View>
				<View style={{flexDirection: 'row', gap: 8, marginHorizontal: 16, marginVertical: 8}}>
					<Pressable 
						style={{ borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, width: 48, padding: 4, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center'}}
						onPress={()=>{router.back()}}
					>
						<Ionicons name='chevron-back' size={24} color={'#c9c9cf'}/>
					</Pressable>
					<View style={{ flex: 1, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 10}}>
						<Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
						<Link href={
							{
								pathname: '/search',
								params: {
									gender: section
								}
							}
						}>
							<Text style={{color: '#c9c9cf', flex: 1, fontFamily: 'CreatoDisplay', fontSize: 16}}>Search for products</Text>
						</Link>
					</View>
				</View>
			</View>
			{
				loading ?
				<View style={{height: height-searchBarHeight-insets.top, paddingBottom: insets.bottom, alignItems: 'center', justifyContent: 'center'}}>
					<ActivityIndicator size='large'/>
				</View> :
				<View style={{ flexDirection: 'row', height: height-searchBarHeight-insets.top, paddingBottom: insets.bottom}}>
					<View style={{borderRightWidth: 1, borderColor: '#E9E9EC', width: width*0.2, overflow: 'hidden'}}>
						<ScrollView
							contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
							showsVerticalScrollIndicator={false}
						>
							<View style={{height: 8}}/>
							{
								catogeries.map((item, index) => (
									<View
										key={`${index}-${item.name}`}
										style={{alignItems: 'center'}}
									>
										<Pressable 
											onPress={()=>{
												setSelectedCatogery(index);
											}} 
											style={{alignItems: 'center'}}
										>
											<View style={{height: 60, width: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
												<Image
													source={{uri:item.image_url[section == 'male' ? 0 : 1]}}
													style={{height: 60, width: 50, borderRadius: 8}}
													contentFit='contain'
												/>
											</View>
											<Text style={{height: 14, textAlign: 'center', fontFamily: 'CreatoDisplay', fontSize: 13, color: index == selectedCatogery ? '#1A1A1A' : 'grey'}}>{item.name}</Text>
										</Pressable>
										<View key={`itemSeparater-${index}`} style={{height: 8}}/>
									</View>
								))
							}
							<Animated.View style={{height: 60, width: 3, backgroundColor: '#5439db', position: 'absolute', left: 0, top:sideTabPosition, borderTopRightRadius: 3, borderBottomRightRadius: 3}}/>
						</ScrollView>
					</View>
					<View style={{flex: 1}}>
						{/* <View style={{flexDirection: 'row', marginVertical: 8, marginHorizontal: 8}}>
							<StarIcon/>
							<Text style={{color: 'black', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}> {selectedCatogery > 0 ? catogeries[selectedCatogery].name : parentCategoryName} </Text>
							<Text style={{color: 'grey', fontSize: 18, fontFamily: 'CreatoDisplayMedium'}}>for {section == 'female' ? 'Women' : 'Men'}</Text>
						</View> */}
						{
							loadingProducts ?
							<View style={{height: '100%'}}>
								<ListHeader/>
								<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
									<ActivityIndicator size='large'/>
								</View>
							</View> :
							<FlatList
								data={products}
								renderItem={Product}
								ListHeaderComponent={ListHeader}
								ItemSeparatorComponent={()=>(<View style={{height: 12}}/>)}
								columnWrapperStyle={{gap: 8, paddingHorizontal: 8}}
								contentContainerStyle={{width: width*0.8}}
								getItemLayout={(data, index) => (
									{length: 200, offset: 200 * index, index}
								)}
								numColumns={2}
								showsVerticalScrollIndicator={false}
								refreshControl={
									<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
								}
							/>
						}
					</View>
				</View>
			}
		</View>
	);
}