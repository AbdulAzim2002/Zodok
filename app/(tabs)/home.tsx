import { TabSVG } from '@/assets/svg/NotchButton';
import Speed from '@/assets/svg/speed';
import CartPopUp from '@/components/cartPopUp';
import CategoryCarousel, { CategoryCarouselProps } from '@/components/categoryCarousel';
import CollectionBanner, { CollectionBannerProps } from '@/components/collectionBanner';
import CollectionCarousel, { CollectionCarouselProps } from '@/components/collectionCarousel';
import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ListRenderItem, Modal, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Animated, { createAnimatedComponent, Extrapolation, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddOrEditAddress from '../profile/addOrEditAddress';

// const womenImage = require('@assets/images/Women.png');

const { width, height } = Dimensions.get('screen');

const headerHeight = 66;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;
const tabHeight = 56;
const noTabs = 2;
const tabWidth = (width-16-(noTabs-1)*8)/noTabs;
const totalHeaderHeight = headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight + tabHeight;

const menTabColor = '#7d13f8';
const womenTabColor = '#ebcddd';

type ComponentMap = {
    'CollectionCarousel': React.ComponentType<CategoryCarouselProps>,
    'CollectionBanner': React.ComponentType<CollectionBannerProps>,
    'CategoryCarousel':  React.ComponentType<CollectionCarouselProps>
    'SectionLoading': React.ComponentType<{}>
}

type section =  {
    id: string,
    type: keyof ComponentMap,
    props?: CategoryCarouselProps | CollectionBannerProps | CollectionCarouselProps
}

const Sections: any = {
    'CollectionCarousel': CollectionCarousel,
    'CategoryCarousel': CategoryCarousel,
    'CollectionBanner': CollectionBanner,
    'SectionLoading': SectionLoading
}

function SectionLoading() {
    return(
        <>
            <View style={{width, gap: 8, paddingVertical: 8}}>
                <View style={{height: 22}}/>
                <View style={{width, overflow: 'hidden', flexDirection: 'row', gap: 8}}>
                    <View style={{width: 8}}/>
                    <View style={{width: (width-48)/2.5, gap: 8}}>
                        <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
                            <View style={{gap: 4}}>
                            <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
                            <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
                        </View>
                    </View>
                    <View style={{width: (width-48)/2.5, gap: 8}}>
                        <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
                            <View style={{gap: 4}}>
                            <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
                            <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
                        </View>
                    </View>
                    <View style={{width: (width-48)/2.5, gap: 8}}>
                        <View style={{width: '100%', height: (width-48)*8/15, backgroundColor: 'lightgrey', borderRadius: 8}} />
                            <View style={{gap: 4}}>
                            <View style={{width: '100%', height: 14, backgroundColor: 'lightgrey'}}/>
                            <View style={{width: '100%', height: 12, backgroundColor: 'lightgrey'}}/>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{height: 16}}/>
            <View style={{width, gap: 8, paddingVertical: 8}}>
                <View style={{height: 22}}/>
                <View style={{width, overflow: 'hidden', flexDirection: 'row', gap: 8}}>
                    <View style={{width: 8}}/>
                    <View style={{aspectRatio: 15/8, width: (width-16)/1.26, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
                    <View style={{aspectRatio: 15/8, width: (width-16)/1.26, borderRadius: 8, backgroundColor: 'lightgrey'}}/>
                </View>
            </View>
        </>
    )
}

// const womenData: section[] = [
//     {type: 'CollectionCarousel', id: '9137f3bd-1a47-4a57-b044-65cbdbbc4608', props: {collectionSlug: 'summer-collection-women'}},
//     {type: 'CollectionBanner', id: 'gyviytyip-7658fft-656tyy-icrt-iuii-female', props: {label: 'Cray Golaml Collection', gender: 'female'}},
//     {type: 'CategoryCarousel', id: 'ddcd896f-1238-462f-bd9d-99da6b411129-female', props: {categorySlug: 'shirts', gender: 'female'}},
//     {type: 'CategoryCarousel', id: '8ee2930a-9fb0-432b-adc0-3a07c2a9df0e-female', props: {categorySlug: 't-shirts', gender: 'female'}},
//     {type: 'SectionLoading', id: 'loading'}
// ]

// const menData: section[] = [
//     {type: 'CollectionCarousel', id: '2bc7c3f4-8d46-41aa-b2eb-cb575f514227', props: {collectionSlug: 'summer-collection-men'}},
//     {type: 'CollectionBanner', id: 'gyviytyip-7658fft-656tyy-icrt-iuii-male', props: {label: 'Cray Golaml Collection', gender: 'male'}},
//     {type: 'CategoryCarousel', id: 'ddcd896f-1238-462f-bd9d-99da6b411129-male', props: {categorySlug: 'shirts', gender: 'male'}},
//     {type: 'CategoryCarousel', id: '8ee2930a-9fb0-432b-adc0-3a07c2a9df0e-male', props: {categorySlug: 't-shirts', gender: 'male'}}
// ]

export default function Home() {

    const {savedAddressList, addressLoading} = useAuthContext();
    const [showAddAddress, setShowAddAddress] = useState(savedAddressList.length < 1);
    const [defaultAddress, setDefaultAddress] = useState(savedAddressList[0] || null);
    const womenSections = useRef<section[]>([{type: 'SectionLoading', id: 'loading'}]);
    const menSections = useRef<section[]>([{type: 'SectionLoading', id: 'loading'}]);

    useEffect(() => {
        setDefaultAddress(savedAddressList[0] || null);
        setShowAddAddress(savedAddressList.length < 1);
    }, [savedAddressList])

    useEffect(() => {
        const loadSections = async () => {
            const {data, error} = await supabase
            .from('home_page')
            .select(`
                id,
                type:section_type,
                props,
                gender
            `)
            .order('display_order');

            if(error)
                console.log(error)
            else {
                womenSections.current = [];
                menSections.current = [];
                for(const item of data) {
                    const section: section = {
                        id: item.id,
                        type: item.type,
                        props: {
                            id: item.id,
                            ...item.props
                        }
                    }
                    if(item.gender == 'female')
                        womenSections.current.push(section);
                    else
                        menSections.current.push(section);
                }
                setCurrentData(gender == 'female' ? womenSections.current : menSections.current);
            }
        };
        loadSections();
    }, [])

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

    const [currentData, setCurrentData] = useState<section[]>(womenSections.current);
    const [gender, setGender] = useState('female');
    const offsetY = useSharedValue(0);
    const tabPosition = useSharedValue(-(noTabs-1)*(tabWidth));
    const womenProgress = useSharedValue(1);
    const menProgress = useSharedValue(0);
    const kidsProgress = useSharedValue(0);
    const womenOffsetY = useSharedValue(0);
    // const kidsOffsetY = useSharedValue(0);
    const menOffsetY = useSharedValue(0);
    const page = useSharedValue(0);
    const genderRoute = useRef('female');

    useEffect(()=>{
        if(gender == 'female') {
            womenProgress.value = withSpring(1);
            menProgress.value = withSpring(0);
            tabPosition.value = withSpring(-(noTabs-1)*(tabWidth));
        } else {
             womenProgress.value = withSpring(0);
            menProgress.value = withSpring(1);
            tabPosition.value = withSpring(0);
        }
        genderRoute.current = gender
    }, [gender])
    
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
    // const kidsStyle = useAnimatedStyle(() => ({
    //     color: interpolateColor(
    //         kidsProgress.value,
    //         [0, 1],
    //         ['white', 'black']
    //     ),
    //     fontFamily: kidsProgress.value < 0.5 ? 'CreatoDisplay' : 'CreatoDisplayMedium',
    // }));
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
    // const kidsImageStyle = useAnimatedStyle(() => ({
    //     bottom: interpolate(
    //         kidsProgress.value,
    //         [0, 1],
    //         [1, 0],
    //     ),
    //     height: interpolate(
    //         kidsProgress.value,
    //         [0, 1],
    //         [45, 48],
    //     )
    // }));
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
        setCurrentData(womenSections.current);
        setGender('female')
        page.value = 0;
        if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || womenOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
            listRef.current?.scrollToOffset({offset: womenOffsetY.value, animated: true});
        else
            listRef.current?.scrollToOffset({offset: womenOffsetY.value, animated: false});
        // womenProgress.value = withSpring(1);
        // menProgress.value = withSpring(0);
        // kidsProgress.value = withSpring(0);
        // tabPosition.value = withSpring(-(noTabs-1)*(tabWidth));
    };
    // const toKids = () => {
    //     setCurrentData(kidsData);
    //     page.value = 1;
    //     if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || kidsOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
    //         listRef.current?.scrollToOffset({offset: kidsOffsetY.value, animated: true});
    //     else
    //         listRef.current?.scrollToOffset({offset: kidsOffsetY.value, animated: false});
    //     womenProgress.value = withSpring(0);
    //     menProgress.value = withSpring(0);
    //     kidsProgress.value = withSpring(1);
    //     tabPosition.value = withSpring(0);
    // };
    const toMen = () => {
        setCurrentData(menSections.current);
        setGender('male')
        page.value = 2;
        if(offsetY.value < headerHeight+heroCardHeight+heroCanvasHeight || menOffsetY.value < headerHeight+heroCardHeight+heroCanvasHeight)
            listRef.current?.scrollToOffset({offset: menOffsetY.value, animated: true});
        else
            listRef.current?.scrollToOffset({offset: menOffsetY.value, animated: false});
        // womenProgress.value = withSpring(0);
        // menProgress.value = withSpring(1);
        // kidsProgress.value = withSpring(0);
        // tabPosition.value = withSpring(0);
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            offsetY.value = event.contentOffset.y;
            switch(page.value) {
                case 0:
                    womenOffsetY.value = event.contentOffset.y;
                    break;
                // case 1:
                //     kidsOffsetY.value = event.contentOffset.y;
                //     break;
                case 2:
                    menOffsetY.value = event.contentOffset.y;
                    break;
            }
        },
    });

    const routeToSearch = () => {
        router.push({
            pathname: '/search',
            params: { gender: genderRoute.current}
        })
    }

    const Header = useCallback(() => {
        return (
            <>
                <View style={{ height: insets.top}}/>
                <Animated.View style={[{width: width, height: tabOffsetY, position: 'absolute', backgroundColor: 'white'}, nonStickyTabStyle]}>
                    <AnimatedLinearGradient
                        colors={['#9888e9', '#fcf', womenTabColor]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: tabOffsetY,
                            opacity: womenProgress,
                        }}
                    >
                        <Animated.View style={[{height: tabOffsetY}, heroCanvasStyle]}>
                            <Image source={require('@assets/images/WomanBanner.png')} 
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    height:headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight+insets.top,
                                    width,
                                }}
                            />
                        </Animated.View>
                    </AnimatedLinearGradient>
                    <AnimatedLinearGradient
                        colors={['#7661e2', menTabColor]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: tabOffsetY,
                            opacity: menProgress,
                        }}
                    >
                        <Animated.View style={[{height: tabOffsetY}, heroCanvasStyle]}>
                            <Image source={require('@assets/images/ManBanner.png')} 
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    height:headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight+insets.top,
                                    width,
                                }}
                            />
                        </Animated.View>
                    </AnimatedLinearGradient>
                </Animated.View>
                <Animated.View style={[{width: '100%', height: headerHeight, paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, headerStyle]}>
                    <View style={{gap: 4, flexShrink: 1}}>
                        <Text style={{flex:1, fontFamily: 'CreatoDisplayBold', fontSize: 22, color: 'white'}}><Speed/> Delivering in 60 mins</Text>
                        { 
                            defaultAddress ?
                            <Text numberOfLines={1} style={{flex:1, fontFamily: 'CreatoDisplay', color: 'white'}}>{`${defaultAddress.address}, ${defaultAddress.city.length > 0 ? defaultAddress.city : defaultAddress.district}, ${defaultAddress.state} ${defaultAddress.pincode}`}</Text>:
                            <Pressable onPress={()=>{setShowAddAddress(true); console.log('true')}}>
                                <Text numberOfLines={1} style={{flex:1, fontFamily: 'CreatoDisplay', color: 'white'}}>No adress saved</Text>
                            </Pressable>
                        }
                    </View>
                    <Link href={'/profile/profilePage'}><Ionicons name='person-circle' size={46} color='white'/></Link>
                </Animated.View>
                <Animated.View style={[{ marginVertical: 8, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 16}, nonStickySearchBarStyle]}>
                    <Ionicons name='search-outline' size={20} color={'#c9c9cf'}/>
                    <Pressable onPress={routeToSearch}>
                        <Text style={{color: '#c9c9cf', flex: 1, fontFamily: 'CreatoDisplay', fontSize: 16}}>Search for products</Text>
                    </Pressable>
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
                <View style={{width: '100%', height: heroCanvasHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30}}/>
                <Animated.View style={[{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8}, nonStickyTabStyle]}>
                    <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
                    <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/>
                    {/* <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/> */}
                    <Animated.View style={{position: 'absolute', left: tabPosition}}>
                        <TabSVG color='#ffffffff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='white' gap={8} marginHorizontal={16}/>
                        <Animated.View style={{opacity: womenProgress, position:'absolute'}}>
                            <TabSVG color={womenTabColor} width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#ddd7f8' gap={8} marginHorizontal={16}/>
                        </Animated.View>
                        {/* <Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
                            <TabSVG color='#ef9' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#a9cc00' gap={8} marginHorizontal={16}/>
                        </Animated.View> */}
                        <Animated.View style={{opacity: menProgress, position:'absolute'}}>
                            <TabSVG color={menTabColor} width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={noTabs} borderColor='#bbb0f1' gap={8} marginHorizontal={16}/>
                        </Animated.View>
                    </Animated.View>
                    <View style={{height: tabHeight, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8, position: 'absolute', width: width}}>
                        <Pressable 
                            style={({pressed})=>({flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.2:1})}
                            onPress={toWomen}
                        >
                            <View style={{height: 40, width: 34}}>
                                <Animated.Image
                                    style={[{width: 34, position: 'absolute'}, womenImageStyle]}
                                    source={require('@assets/images/Woman.png')}
                                    resizeMode='center'
                                />
                            </View>
                            <Animated.Text style={[{fontFamily: 'CreatoDisplay'},womenStyle]}>Women</Animated.Text>
                        </Pressable>
                        <Pressable 
                            style={({pressed})=>({flexDirection: 'row', gap: 4, flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.2:1})}
                            onPress={toMen}
                        >
                            <View style={{height: 40, width: 34}}>
                                <Animated.Image
                                    style={[{width: 34, position: 'absolute'}, menImageStyle]}
                                    source={require('@assets/images/Men.png')}
                                    resizeMode='center'
                                />
                            </View>
                            <Animated.Text style={[{fontFamily: 'CreatoDisplay'},menStyle]}>Men</Animated.Text>
                        </Pressable>
                        {/* <TouchableOpacity 
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
                        </TouchableOpacity> */}
                    </View>
                </Animated.View>
            </>
        )
    }, [])
    const ItemRenderer: ListRenderItem<section> = useCallback(({item})=>{
        const Item = Sections[item.type]
        return(<Item  {...item.props}/>)
    }, []);

    return (
        <View style={{flex: 1}}>
            <StatusBar translucent style='light'/>
            <Animated.FlatList
                ref={listRef}
                data={currentData}
                renderItem={ItemRenderer}
                onScroll={scrollHandler}
                ListHeaderComponent={Header}
                // getItemLayout={(data, index) => (
                //     {length: 200, offset: 200 * index, index}
                // )}
                ItemSeparatorComponent={()=>(<View style={{height: 16}} />)}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                keyExtractor={item => item.id}
                // ListFooterComponent={()=>(<View style={{height: 60}}/>)}
            />
            <View style={{position: 'absolute', width}}>
                <View style={{ height: insets.top}}/>
                <Animated.View style={[{bottom: tabHeight, width: width, height: tabOffsetY, position: 'absolute', backgroundColor: 'white'}, stickyTabStyle]}>
                    <AnimatedLinearGradient
                        colors={['#9888e9', '#fcf',womenTabColor]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: tabOffsetY,
                            opacity: womenProgress,
                        }}
                    />
                    <AnimatedLinearGradient
                        colors={['#7661e2', menTabColor]}
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
                    <Link href={{
                        pathname: '/search',
                        params: {gender}
                    }}>
                        <Text style={{color: '#c9c9cf', flex: 1, fontFamily: 'CreatoDisplay', fontSize: 16}}>Search for products</Text>
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
                    {/* <View style={{flex: 1, height: 40, borderRadius: 8, backgroundColor: 'black', borderColor: '#787887', borderWidth: 1}}/> */}
                    <Animated.View style={{position: 'absolute', left: tabPosition}}>
                        <TabSVG color='#ffffffff' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='white' gap={8} marginHorizontal={16}/>
                        <Animated.View style={{opacity: womenProgress, position:'absolute'}}>
                            <TabSVG color={womenTabColor} width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#ddd7f8' gap={8} marginHorizontal={16}/>
                        </Animated.View>
                        {/* <Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
                            <TabSVG color='#ef9' width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#a9cc00' gap={8} marginHorizontal={16}/>
                        </Animated.View> */}
                        <Animated.View style={{opacity: menProgress, position:'absolute'}}>
                            <TabSVG color={menTabColor} width={width} radius={8} radius1={16} buttonHeight={48} numberOfButtons={2} borderColor='#bbb0f1' gap={8} marginHorizontal={16}/>
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
                        {/* <TouchableOpacity 
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
                        </TouchableOpacity> */}
                    </View>
                </Animated.View>
            </View>
            <AddressPopup  visible={showAddAddress} onClose={()=>{setShowAddAddress(false)}}/>
            <CartPopUp />
            <View style={{height: 60, backgroundColor: '#fff'}}/>
        </View>
    )
}

function AddressPopup({ visible, onClose } : { visible: boolean, onClose: ()=>void }) {
  const [backdropColor, setBackdropColor] = useState<'transparent' | 'rgba(0,0,0,0.4)'>('transparent');
  const close = () => {setBackdropColor('transparent'), setTimeout(()=>{onClose()}, 100)};
  const [screenOffset, setScreenOffset] = useState(0);
  const {top} = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={close}
      onShow={()=>{setTimeout(()=>{setBackdropColor('rgba(0,0,0,0.4)')}, 100)}}
    >
      {/* Backdrop */}
      <View style={[{flex: 1, justifyContent: 'flex-end'}, {backgroundColor: backdropColor}]}>
        <Pressable style={{height: '100%', width: '100%', position: 'absolute'}} onPress={onClose}/>
        <View 
            style={{height: '80%', width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden'}}
            onLayout={({nativeEvent:{layout}})=>{setScreenOffset(layout.y+top)}}
        >
            <AddOrEditAddress screenOffset={screenOffset} onClose={onClose}/>
        </View>
      </View>
    </Modal>
  );
}