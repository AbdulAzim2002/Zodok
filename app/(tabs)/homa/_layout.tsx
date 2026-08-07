import { TabSVG } from '@/assets/svg/NotchButton';
import { router, Slot } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

export default function HomeLayout() {

  const navBarRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const womenProgress = useSharedValue(1);
  const kidsProgress = useSharedValue(0);
  const menProgress = useSharedValue(0);
  const buttonPosition = useSharedValue(2*(-(width-48)/3-8)-16);

  const womenBannerAnimatedStyles = useAnimatedStyle(() => {
    return ({
      opacity: womenProgress.value,
  })});
  const kidsBannerAnimatedStyles = useAnimatedStyle(() => {
    return ({
      opacity: kidsProgress.value,
  })});
  const menBannerAnimatedStyles = useAnimatedStyle(() => {
    return ({
      opacity: menProgress.value,
  })});

  const animatedWomenButtonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      womenProgress.value,
      [0, 1],
      ['#ffffffff', '#2b2b2bff']
    ),
  }));
  const animatedKidsButtonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      kidsProgress.value,
      [0, 1],
      ['#ffffffff', '#2b2b2bff']
    ),
  }));
  const animatedMenButtonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      menProgress.value,
      [0, 1],
      ['#ffffffff', '#2b2b2bff']
    ),
  }));

  const toWomen = () => {
    womenProgress.value = 1;
    kidsProgress.value = 0;
    menProgress.value = 0;
    womenProgress.value = withSpring(1);
    kidsProgress.value = withSpring(0);
    menProgress.value = withSpring(0);
    buttonPosition.value = withSpring(2*(-(width-48)/3-8)-16);
  };
  const toKids = () => {
    womenProgress.value = withSpring(0);
    kidsProgress.value = withSpring(1);
    menProgress.value = withSpring(0);
    buttonPosition.value = withSpring((-(width-48)/3-8)-16);
  };
  const toMen = () => {
    womenProgress.value = withSpring(0);
    kidsProgress.value = withSpring(0);
    menProgress.value = withSpring(1);
    buttonPosition.value = withSpring(-16);
  };

  const getPosition = () => {
    navBarRef.current?.measure((x, y, width, height, pageX, pageY) => {
      console.log({ x, y, width, height, pageX, pageY });
    });
  };

  const styles = StyleSheet.create({
    iconLable: {
      fontFamily: 'CreatoDisplay',
      fontSize: 12,
      marginTop: 4,
      height: 14,
    }
  });

  const [headerStick, setHeaderStick] = useState(false);
  const [searchStick, setSearchStick] = useState(false);

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={{height: '100%', width: '100%'}}
        onScroll={(event) => {
          const scroll = event.nativeEvent.contentOffset.y;
          if(scroll >= 20)
            setSearchStick(true);
          else
            setSearchStick(false);
          if(event.nativeEvent.contentOffset.y >= 236)
              setHeaderStick(true);
          else
            setHeaderStick(false);
        }}
        scrollEventThrottle={16}
      >
        <View ref={navBarRef} style={{flexDirection: 'row', justifyContent: 'space-between', height: 20}}>
          <Text>Dilvery in 60 mins</Text><Text>ProfileIcon</Text>
        </View>
        {
          !searchStick ?
            <View style={{ borderRadius: 8, marginHorizontal: 16, backgroundColor: '#d6d4d4ff', borderWidth: 2, borderColor: '#b0b0b0ff', height: 24}}>
              <Text>Search</Text>
            </View> :
            <View style={{height: 24}}/>
        }
        <View>
          {
            !headerStick ?
            <>
              <View style={{ height: 216 }}>
                <Animated.View style={[{position: 'absolute', backgroundColor:'#ff00fbff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, womenBannerAnimatedStyles]}>
                  <Text>Women Image</Text>
                </Animated.View>
                <Animated.View style={[{position: 'absolute', backgroundColor:'#00ff11ff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, kidsBannerAnimatedStyles]}>
                  <Text>Kids Image</Text>
                </Animated.View>
                <Animated.View style={[{position: 'absolute', backgroundColor:'#0d00ffff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, menBannerAnimatedStyles]}>
                  <Text>Men Image</Text>
                </Animated.View>
              </View>
              <View  style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', marginHorizontal: 16, marginVertical: 8, height: 30}}>
                
                <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>
                <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>
                <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>

                <Animated.View style={{height: 30, top:-8, width: '100%', position: 'absolute', left: buttonPosition}}>
                  <View style={{height: 38, position:'absolute'}}>
                    <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#ffff' borderColor='black' gap={8} marginHorizontal={16}/>
                  </View>
                  <Animated.View style={[{height: 38, position:'absolute'}, womenBannerAnimatedStyles]}>
                    <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#ff00fbff' borderColor='black' gap={8} marginHorizontal={16}/>
                  </Animated.View>
                  <Animated.View style={[{height: 38, position:'absolute'}, kidsBannerAnimatedStyles]}>
                    <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#00ff11ff' borderColor='black' gap={8} marginHorizontal={16}/>
                  </Animated.View>
                  <Animated.View style={[{height: 38, position:'absolute'}, menBannerAnimatedStyles]}>
                    <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#0d00ffff' borderColor='black' gap={8} marginHorizontal={16}/>
                  </Animated.View>
                </Animated.View>

                <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', height: 30, width: '100%', position: 'absolute'}}>
                  <TouchableOpacity 
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                    onPress={()=>{router.replace('/(tabs)/homa/women'), toWomen()}}
                  >
                    <Animated.Text style={animatedWomenButtonStyle}>Women</Animated.Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                    onPress={()=>{router.replace('/(tabs)/homa/kids'), toKids()}}
                  >
                    <Animated.Text style={animatedKidsButtonStyle}>Kids</Animated.Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                    onPress={()=>{router.replace('/(tabs)/homa/men'), toMen()}}
                  >
                    <Animated.Text style={animatedMenButtonStyle}>Men</Animated.Text>
                  </TouchableOpacity>
                </View>
              </View>
            </> :
            <View style={{height: 262}}/>
          }
        </View>
        <Slot/>
      </ScrollView>
      {
        headerStick && (
          <View style={{top: -192, position: 'absolute', width: "100%"}}>
            <View style={{ height: 216 }}>
              <Animated.View style={[{position: 'absolute', backgroundColor:'#ff00fbff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, womenBannerAnimatedStyles]}>
                <Text>Women Image</Text>
              </Animated.View>
              <Animated.View style={[{position: 'absolute', backgroundColor:'#00ff11ff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, kidsBannerAnimatedStyles]}>
                <Text>Kids Image</Text>
              </Animated.View>
              <Animated.View style={[{position: 'absolute', backgroundColor:'#0d00ffff', width: width, height: 216, alignItems: 'center', justifyContent: 'center'}, menBannerAnimatedStyles]}>
                <Text>Men Image</Text>
              </Animated.View>
            </View>
            <View  style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', marginHorizontal: 16, marginVertical: 8, height: 30}}>
              
              <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>
              <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>
              <View style={{backgroundColor:'black', flex: 1, borderRadius: 8}}/>

              <Animated.View style={{height: 30, top:-8, width: '100%', position: 'absolute', left: buttonPosition}}>
                <View style={{height: 38, position:'absolute'}}>
                  <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#ffff' borderColor='black' gap={8} marginHorizontal={16}/>
                </View>
                <Animated.View style={[{height: 38, position:'absolute'}, womenBannerAnimatedStyles]}>
                  <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#ff00fbff' borderColor='black' gap={8} marginHorizontal={16}/>
                </Animated.View>
                <Animated.View style={[{height: 38, position:'absolute'}, kidsBannerAnimatedStyles]}>
                  <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#00ff11ff' borderColor='black' gap={8} marginHorizontal={16}/>
                </Animated.View>
                <Animated.View style={[{height: 38, position:'absolute'}, menBannerAnimatedStyles]}>
                  <TabSVG buttonHeight={38} width={width} radius={8} radius1={16} color='#0d00ffff' borderColor='black' gap={8} marginHorizontal={16}/>
                </Animated.View>
              </Animated.View>

              <View style={{flexDirection: 'row', gap: 8, justifyContent: 'space-between', height: 30, width: '100%', position: 'absolute'}}>
                <TouchableOpacity 
                  style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                  onPress={()=>{router.replace('./'), toWomen()}}
                >
                  <Animated.Text style={animatedWomenButtonStyle}>Women</Animated.Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                  onPress={()=>{router.replace('./kids'), toKids()}}
                >
                  <Animated.Text style={animatedKidsButtonStyle}>Kids</Animated.Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}}
                  onPress={()=>{router.replace('./men'), toMen()}}
                >
                  <Animated.Text style={animatedMenButtonStyle}>Men</Animated.Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
      {
        searchStick && (
          <View style={{ borderRadius: 8, marginHorizontal: 16, backgroundColor: '#d6d4d4ff', borderWidth: 2, borderColor: '#b0b0b0ff', width: width-32, height: 24, position: "absolute"}}>
            <Text>Search</Text>
          </View>
        )
      }
    </>
  );
}