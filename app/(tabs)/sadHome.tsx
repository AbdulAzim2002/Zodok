import { TabSVG } from '@/assets/svg/NotchButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, ListRenderItem, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Animated, { createAnimatedComponent, Extrapolation, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const womenImage = require('@assets/images/Women.png');

const { width, height } = Dimensions.get('screen');

const headerHeight = 60;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;
const tabHeight = 56;
const noTabs = 2;
const tabWidth = (width-16*noTabs)/noTabs;
const totalHeaderHeight = headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight + tabHeight;

const womenData = [
	{text: 'women 1'},
	{text: 'women 2'},
	{text: 'women 3'},
	{text: 'women 4'},
	{text: 'women 5'},
	{text: 'women 6'},
	{text: 'women 7'},
	{text: 'women 8'},
	{text: 'women 9'},
	{text: 'women 10'},
	{text: 'women 11'},
]

const menData = [
	{text: 'men 1'},
	{text: 'men 2'},
	{text: 'men 3'},
	{text: 'men 4'},
	{text: 'men 5'},
	{text: 'men 6'},
	{text: 'men 7'},
	{text: 'men 8'},
	{text: 'men 9'},
	{text: 'men 10'},
	{text: 'men 11'},
]

const kidsData = [
	{text: 'kids 1'},
	{text: 'kids 2'},
	{text: 'kids 3'},
	{text: 'kids 4'},
	{text: 'kids 5'},
	{text: 'kids 6'},
	{text: 'kids 7'},
	{text: 'kids 8'},
	{text: 'kids 9'},
	{text: 'kids 10'},
	{text: 'kids 11'},
]

export default function Home() {

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
			setRefreshing(true);
			setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const listRef = useRef<Animated.FlatList>(null);

	const insets = useSafeAreaInsets();

	const tabOffsetY = insets.top + searchBarHeight + headerHeight + heroCardHeight + heroCanvasHeight;

	const [currentData, setCurrentData] = useState(womenData);
	const offsetY = useSharedValue(0);
	const tabPosition = useSharedValue(-(noTabs-1)*(tabWidth+8));
	const womenProgress = useSharedValue(1);
	const menProgress = useSharedValue(0);
	const kidsProgress = useSharedValue(0);
	const womenOffsetY = useSharedValue(0);
	const kidsOffsetY = useSharedValue(0);
	const menOffsetY = useSharedValue(0);
	const page = useSharedValue(0);
	
	const AnimatedLinearGradient = createAnimatedComponent(LinearGradient);

	const nonStickySearchBarStyle = useAnimatedStyle(() => ({
		opacity: offsetY.value >= headerHeight ? 0 : 1,
		pointerEvents: offsetY.value >= headerHeight ? 'none' : 'auto',
	}));
	const stickySearchBarStyle = useAnimatedStyle(() => ({
		opacity: offsetY.value >= headerHeight ? 1 : 0,
		pointerEvents: offsetY.value >= headerHeight ? 'auto' : 'none',
	}));
	const nonStickyTabStyle = useAnimatedStyle(() => ({
		opacity: offsetY.value >= headerHeight+heroCardHeight+heroCanvasHeight ? 0 : 1,
		pointerEvents: offsetY.value >= headerHeight+heroCardHeight+heroCanvasHeight ? 'none' : 'auto',
	}));
	const stickyTabStyle = useAnimatedStyle(() => ({
		opacity: offsetY.value >= headerHeight+heroCardHeight+heroCanvasHeight ? 1 : 0,
		pointerEvents: offsetY.value >= headerHeight+heroCardHeight+heroCanvasHeight ? 'auto' : 'none',
	}));
	const headerStyle = useAnimatedStyle(()=>({
		opacity: interpolate(
			offsetY.value,
			[0, headerHeight],
			[1, 0],
			Extrapolation.CLAMP,
		)
	}));
	const heroCardStyle = useAnimatedStyle(()=>({
		opacity: interpolate(
			offsetY.value,
			[headerHeight+searchBarHeight, headerHeight+searchBarHeight+heroCardHeight],
			[1, 0],
			Extrapolation.CLAMP,
		)
	}));
	const heroCanvasStyle = useAnimatedStyle(()=>({
		opacity: interpolate(
			offsetY.value,
			[headerHeight+searchBarHeight+heroCardHeight, headerHeight+heroCardHeight+heroCanvasHeight],
			[1, 0],
			Extrapolation.CLAMP,
		)
	}));
	const womenStyle = useAnimatedStyle(() => ({
		color: interpolateColor(
			womenProgress.value,
			[0, 1],
			['white', 'black']
		),
		fontFamily: womenProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
	}));
	const kidsStyle = useAnimatedStyle(() => ({
		color: interpolateColor(
			kidsProgress.value,
			[0, 1],
			['white', 'black']
		),
		fontFamily: kidsProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
	}));
	const menStyle = useAnimatedStyle(() => ({
		color: interpolateColor(
			menProgress.value,
			[0, 1],
			['white', 'black']
		),
		fontFamily: menProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
	}));
	const womenImageStyle = useAnimatedStyle(() => ({
		bottom: interpolate(
			womenProgress.value,
			[0, 1],
			[1, 0],
		),
		height: interpolate(
			womenProgress.value,
			[0, 1],
			[45, 48],
		)
	}));
	const kidsImageStyle = useAnimatedStyle(() => ({
		bottom: interpolate(
			kidsProgress.value,
			[0, 1],
			[1, 0],
		),
		height: interpolate(
			kidsProgress.value,
			[0, 1],
			[45, 48],
		)
	}));
	const menImageStyle = useAnimatedStyle(() => ({
		bottom: interpolate(
			menProgress.value,
			[0, 1],
			[1, 0.5],
		),
		height: interpolate(
			menProgress.value,
			[0, 1],
			[45, 48],
		)
	}));

	const toWomen = () => {
		setCurrentData(womenData);
		page.value = 0;
		if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || womenOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
			listRef.current?.scrollToOffset({offset: womenOffsetY.value, animated: true});
		else
			listRef.current?.scrollToOffset({offset: womenOffsetY.value, animated: false});
		womenProgress.value = withSpring(1);
		menProgress.value = withSpring(0);
		kidsProgress.value = withSpring(0);
		tabPosition.value = withSpring(-(noTabs-1)*(tabWidth+8));
	};
	const toKids = () => {
		setCurrentData(kidsData);
		page.value = 1;
		if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || kidsOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
			listRef.current?.scrollToOffset({offset: kidsOffsetY.value, animated: true});
		else
			listRef.current?.scrollToOffset({offset: kidsOffsetY.value, animated: false});
		womenProgress.value = withSpring(0);
		menProgress.value = withSpring(0);
		kidsProgress.value = withSpring(1);
		tabPosition.value = withSpring(0);
	};
	const toMen = () => {
		setCurrentData(menData);
		page.value = 2;
		if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || menOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
			listRef.current?.scrollToOffset({offset: menOffsetY.value, animated: true});
		else
			listRef.current?.scrollToOffset({offset: menOffsetY.value, animated: false});
		womenProgress.value = withSpring(0);
		menProgress.value = withSpring(1);
		kidsProgress.value = withSpring(0);
		tabPosition.value = withSpring(-(width-24)/3);
	};

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			offsetY.value = event.contentOffset.y;
			switch(page.value) {
				case 0:
					womenOffsetY.value = event.contentOffset.y;
					break;
				case 1:
					kidsOffsetY.value = event.contentOffset.y;
					break;
				case 2:
					menOffsetY.value = event.contentOffset.y;
					break;
			}
		},
	});

	const Header = () => {
		return (
			<>
				<View style={{ height: insets.top}}/>
				<Animated.View style={[{width: width, height: tabOffsetY, position: 'absolute', backgroundColor: 'white'}, nonStickyTabStyle]}>
					<AnimatedLinearGradient
						colors={['#9888e9', '#fcf','#ffebff']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: womenProgress,
						}}
					/>
					<AnimatedLinearGradient
						colors={['#e5ff66', '#ef9']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: kidsProgress,
						}}
					/>
					<AnimatedLinearGradient
						colors={['#7661e2', '#ddd7f8']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: menProgress,
						}}
					/>
				</Animated.View>
				<Animated.View style={[{width: '100%', height: 60, paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, headerStyle]}>
					<View style={{gap: 4}}>
						<Text style={{flex:1}}><Ionicons name='flash'/> Delivering in 60 mins</Text>
						<Text style={{flex:1}}>Home - Felicity, Kharadi, Pune <Ionicons name='chevron-down'/></Text>
					</View>
					<Link href={'/profilePage'}><Ionicons name='person-circle-outline' size={40}/></Link>
				</Animated.View>
				<Animated.View style={[{ marginVertical: 8, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 16}, nonStickySearchBarStyle]}>
					<Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
					<Link href='/search'>
						<Text style={{color: '#c9c9cf', flex: 1}}>Search for "Dress"</Text>
					</Link>
				</Animated.View>
				<Animated.ScrollView showsVerticalScrollIndicator={false} horizontal={true} style={[{ paddingLeft: 16, paddingVertical: 8 }, heroCardStyle]}>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
					<View style={{width: 16}}/>
				</Animated.ScrollView>
				<Animated.View style={[{width: '100%', height: heroCanvasHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30}, heroCanvasStyle]}>
					<View style={{ alignItems: 'center'}}>
						<Text style={{textAlign: 'center', fontSize: 40, fontStyle: 'italic', fontWeight: 800}}>Try</Text>
						<Text style={{textAlign: 'center', fontSize: 40, fontStyle: 'italic', fontWeight: 800}}>fashion</Text>
						<Text style={{textAlign: 'center', fontSize: 16}}>at your doorstep</Text>
					</View>
					<Ionicons name='storefront' size={0.8*heroCanvasHeight}/>
				</Animated.View>
				<Animated.View style={[{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8}, nonStickyTabStyle]}>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<Animated.View style={{position: 'absolute', left: tabPosition}}>
						<TabSVG color='#ffffffff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='white' gap={8} marginHorizontal={16}/>
						<Animated.View style={{opacity: womenProgress, position:'absolute'}}>
							<TabSVG color='#ffebff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#ddd7f8' gap={8} marginHorizontal={16}/>
						</Animated.View>
						<Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
							<TabSVG color='#ef9' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#a9cc00' gap={8} marginHorizontal={16}/>
						</Animated.View>
						<Animated.View style={{opacity: menProgress, position:'absolute'}}>
							<TabSVG color='#ddd7f8' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#bbb0f1' gap={8} marginHorizontal={16}/>
						</Animated.View>
					</Animated.View>
					<View style={{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8, position: 'absolute', width: width}}>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toWomen}
						>
							<View style={{height: 40, width: 34}}>
								<Animated.Image
									style={[{width: 34, position: 'absolute'}, womenImageStyle]}
									source={require('@assets/images/Woman.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={womenStyle}>Women</Animated.Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toMen}
						>
							<View style={{height: 40, width: 34}}>
								<Animated.Image
									style={[{width: 34, position: 'absolute'}, menImageStyle]}
									source={require('@assets/images/Men.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={menStyle}>Men</Animated.Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toKids}
						>
							<View style={{height: 40, width: 51}}>
								<Animated.Image
									style={[{width: 51, position: 'absolute'}, kidsImageStyle]}
									source={require('@assets/images/Kids.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={kidsStyle}>Kids</Animated.Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</>
		)
	}
	const ItemRenderer: ListRenderItem<{text: string}> = useCallback(({item})=>(
		<View style={{padding: 5, backgroundColor: 'red', margin: 8, height: 200, justifyContent: 'center', alignItems: 'center'}}>
			<Text>{item.text}</Text>
		</View>
	),[]);

	return (
		<>
			<Animated.FlatList
				ref={listRef}
				data={currentData}
				renderItem={ItemRenderer}
				onScroll={scrollHandler}
				ListHeaderComponent={Header}
				getItemLayout={(data, index) => (
					{length: 200, offset: 200 * index, index}
				)}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<View style={{position: 'absolute', width}}>
				<View style={{ height: insets.top}}/>
				<Animated.View style={[{bottom: tabHeight, width: width, height: tabOffsetY, position: 'absolute', backgroundColor: 'white'}, stickyTabStyle]}>
					<AnimatedLinearGradient
						colors={['#9888e9', '#fcf','#ffebff']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: womenProgress,
						}}
					/>
					<AnimatedLinearGradient
						colors={['#e5ff66', '#ef9']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: kidsProgress,
						}}
					/>
					<AnimatedLinearGradient
						colors={['#7661e2', '#ddd7f8']}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							height: tabOffsetY,
							opacity: menProgress,
						}}
					/>
				</Animated.View>
				<Animated.View style={[{ marginVertical: 8, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 16}, stickySearchBarStyle]}>
					<Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
					<Link href='/search'>
						<Text style={{color: '#c9c9cf', flex: 1}}>Search for "Dress"</Text>
					</Link>
				</Animated.View>
				<Animated.View style={[{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8}, stickyTabStyle]}>
					<LinearGradient
						colors={[
							'rgb(255, 252, 252)', 
							'rgba(255, 255, 255, 0.3)', 
							'rgba(255, 255, 255, 0.15)', 
							'rgba(255, 255, 255, 0.075)', 
							'rgba(255, 255, 255, 0.037)', 
							'rgba(255, 255, 255, 0.019)', 
							'rgba(255, 255, 255, 0)',
						]}
						locations={[
							0.2, 
							0.6,
							0.72,
							0.804,
							0.8628,
							0.904,
							1,
						]}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 0,
							height: tabHeight,
						}}
					/>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
					<Animated.View style={{position: 'absolute', left: tabPosition}}>
						<TabSVG color='#ffffffff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='white' gap={8} marginHorizontal={16}/>
						<Animated.View style={{opacity: womenProgress, position:'absolute'}}>
							<TabSVG color='#ffebff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#ddd7f8' gap={8} marginHorizontal={16}/>
						</Animated.View>
						<Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
							<TabSVG color='#ef9' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#a9cc00' gap={8} marginHorizontal={16}/>
						</Animated.View>
						<Animated.View style={{opacity: menProgress, position:'absolute'}}>
							<TabSVG color='#ddd7f8' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#bbb0f1' gap={8} marginHorizontal={16}/>
						</Animated.View>
					</Animated.View>
					<View style={{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8, position: 'absolute', width: width}}>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toWomen}
						>
							<View style={{height: 40, width: 34}}>
								<Animated.Image
									style={[{height: 45, width: 34, position: 'absolute'}, womenImageStyle]}
									source={require('@assets/images/Woman.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={womenStyle}>Women</Animated.Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toMen}
						>
							<View style={{height: 40, width: 34}}>
								<Animated.Image
									style={[{width: 34, position: 'absolute'}, menImageStyle]}
									source={require('@assets/images/Men.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={menStyle}>Men</Animated.Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
							onPress={toKids}
						>
							<View style={{height: 40, width: 51}}>
								<Animated.Image
									style={[{height: 45, width: 51, position: 'absolute'}, kidsImageStyle]}
									source={require('@assets/images/Kids.png')}
									resizeMode='center'
								/>
							</View>
							<Animated.Text style={kidsStyle}>Kids</Animated.Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		</>
	)
}