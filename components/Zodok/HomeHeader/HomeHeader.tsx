import { TabSVG } from '@/assets/svg/NotchButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { createAnimatedComponent, Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const {height, width} = Dimensions.get('screen');

const headerHeight = 60;
const searchBarHeight = 64;
const cardHeight = (width-64)/3.5;
const heroCardHeight = cardHeight+16;
const heroCanvasHeight = 3*width/8;
const tabHeight = 56;
export const totalHeaderHeight = headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight + tabHeight;

export function HomeHeader({scrollY, setPage}:{scrollY:SharedValue<number>, setPage: (page:string) => void}) {
    const tabPosition = useSharedValue(-2*(width-24)/3);
    const womenProgress = useSharedValue(1);
    const menProgress = useSharedValue(0);
    const kidsProgress = useSharedValue(0);
    const headerStyle = useAnimatedStyle(()=>({
        top: interpolate(
            scrollY.value,
            [0, totalHeaderHeight],
            [0, -totalHeaderHeight],
            Extrapolation.CLAMP
        )
    }));
    const searchBarStyle = useAnimatedStyle(()=>({
        top: interpolate(
            scrollY.value,
            [0, headerHeight],
            [headerHeight, 0],
            Extrapolation.CLAMP
        )
    }));
    const tabStyle = useAnimatedStyle(()=>({
        top: interpolate(
            scrollY.value,
            [0, headerHeight+heroCardHeight+heroCanvasHeight],
            [headerHeight+searchBarHeight+heroCardHeight+heroCanvasHeight, searchBarHeight],
            Extrapolation.CLAMP
        )
    }));
    const backgroundStyle = useAnimatedStyle(()=>({
        top: interpolate(
            scrollY.value,
            [0, headerHeight+heroCardHeight+heroCanvasHeight],
            [0, -(headerHeight+heroCardHeight+heroCanvasHeight)],
            Extrapolation.CLAMP
        )
    }));
    const AnimatedLinearGradient = createAnimatedComponent(LinearGradient);
    const toWomen = () => {
        womenProgress.value = withSpring(1);
        menProgress.value = withSpring(0);
        kidsProgress.value = withSpring(0);
        tabPosition.value = withSpring(-2*(width-24)/3);
        setPage('women');
    };
    const toKids = () => {
        womenProgress.value = withSpring(0);
        menProgress.value = withSpring(0);
        kidsProgress.value = withSpring(1);
        tabPosition.value = withSpring(-(width-24)/3);
        setPage('kids');
    };
    const toMen = () => {
        womenProgress.value = withSpring(0);
        menProgress.value = withSpring(1);
        kidsProgress.value = withSpring(0);
        tabPosition.value = withSpring(0);
        setPage('men');
    };
    return (
        <>
            <Animated.View style={[{height:tabHeight, zIndex:1, position: 'absolute', width: '100%'}, tabStyle]}>
                <AnimatedLinearGradient
                    colors={['#feb1fdff', '#ff00fbff']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: tabHeight,
                        height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                        opacity: womenProgress,
                    }}
                />
                <AnimatedLinearGradient
                    colors={['#b3ffb8ff', '#00ff11ff']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: tabHeight,
                        height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                        opacity: kidsProgress,
                    }}
                />
                <AnimatedLinearGradient
                    colors={['#b1acffff', '#0d00ffff']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: tabHeight,
                        height: headerHeight + searchBarHeight + heroCardHeight + heroCanvasHeight,
                        opacity: menProgress,
                    }}
                />
                <LinearGradient
                    colors={[
                        'rgba(225, 225, 225, 1)', 
                        'rgba(225, 225, 225, 0.3)', 
                        'rgba(225, 225, 225, 0.15)', 
                        'rgba(225, 225, 225, 0.075)', 
                        'rgba(225, 225, 225, 0.037)', 
                        'rgba(225, 225, 225, 0.019)', 
                        'rgba(225, 225, 225, 0)',
                    ]}
                    locations={[
                        0.5, 
                        0.75, 
                        0.825, 
                        0.8775, 
                        0.91452, 
                        0.94, 
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
                <View style={{height: tabHeight, flexDirection: 'row', marginHorizontal: 16, marginVertical: 8, gap: 8}}>
                    <View style={{flex: 1, height: 40, borderRadius: 12, backgroundColor: 'black'}}/>
                    <View style={{flex: 1, height: 40, borderRadius: 12, backgroundColor: 'black'}}/>
                    <View style={{flex: 1, height: 40, borderRadius: 12, backgroundColor: 'black'}}/>
                </View>
                <Animated.View style={{position: 'absolute', left: tabPosition}}>
                    <TabSVG color='#ffffffff' width={width} radius={16} radius1={24} buttonHeight={48} borderColor='black' gap={8} marginHorizontal={16}/>
                    <Animated.View style={{opacity: womenProgress, position:'absolute'}}>
                        <TabSVG color='#ff00fbff' width={width} radius={16} radius1={24} buttonHeight={48} borderColor='black' gap={8} marginHorizontal={16}/>
                    </Animated.View>
                    <Animated.View style={{opacity: kidsProgress, position:'absolute'}}>
                        <TabSVG color='#00ff11ff' width={width} radius={16} radius1={24} buttonHeight={48} borderColor='black' gap={8} marginHorizontal={16}/>
                    </Animated.View>
                    <Animated.View style={{opacity: menProgress, position:'absolute'}}>
                        <TabSVG color='#0d00ffff' width={width} radius={16} radius1={24} buttonHeight={48} borderColor='black' gap={8} marginHorizontal={16}/>
                    </Animated.View>
                </Animated.View>
                <View style={{flexDirection: 'row', gap: 8, marginVertical: 8, marginHorizontal: 16, position: 'absolute'}}>
                    <TouchableOpacity 
                        style={{flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                        onPress={toWomen}
                    >
                        <Text style={{color: 'white'}}>Women</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                        onPress={toKids}
                    >
                        <Text style={{color: 'white'}}>Kids</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{flex: 1, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}
                        onPress={toMen}
                    >
                        <Text style={{color: 'white'}}>Men</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.View style={[{position: 'absolute', width: '100%', pointerEvents: 'box-none', zIndex: 1}, headerStyle]}>
                <View style={{width: '100%', height: 60, paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{gap: 4}}>
                        <Text style={{flex:1}}><Ionicons name='flash'/> Delivering in 60 mins</Text>
                        <Text style={{flex:1}}>Home - Felicity, Kharadi, Pune <Ionicons name='chevron-down'/></Text>
                    </View>
                    <Ionicons name='person-circle-outline' size={40}/>
                </View>
                <View style={{height: searchBarHeight}} />
                <ScrollView horizontal={true} style={{ paddingLeft: 16, paddingVertical: 8 }}>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: cardHeight, height: cardHeight, backgroundColor: '#a200ffff', borderRadius: 12, marginRight: 16}}/>
                    <View style={{width: 16}}/>
                </ScrollView>
                <View style={[{width: '100%', height: heroCanvasHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30}]}>
                    <View style={{ alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', fontSize: 40, fontStyle: 'italic', fontWeight: 800}}>Try</Text>
                        <Text style={{textAlign: 'center', fontSize: 40, fontStyle: 'italic', fontWeight: 800}}>fashion</Text>
                        <Text style={{textAlign: 'center', fontSize: 16}}>at your doorstep</Text>
                    </View>
                    <Ionicons name='storefront' size={0.8*heroCanvasHeight}/>
                </View>
                <View style={{height: tabHeight}} />
            </Animated.View>
            <Animated.View style={[{ marginVertical: 8, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', borderColor: '#c9c9cf', borderWidth: 1, height: 48, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 16, position: 'absolute', width: width-32, zIndex:1}, searchBarStyle]}>
                <Ionicons name='search-outline' size={20} color={'#c9c9cf'}/><Text style={{color: '#c9c9cf', flex: 1}}>Search for "Dress"</Text>
            </Animated.View>
        </>
    );
}