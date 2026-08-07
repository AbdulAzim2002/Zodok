import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { Easing, useAnimatedProps, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Button } from "../Button";
import { ScrollWheel } from "../ScrollWheelPicker";

type sizeChartType = {
  visible: boolean;
  close: ()=>void;
};

const {height, width} = Dimensions.get('window');
const sizeChart = [
  {size: 'XS', bust: 32, waist: 26, hips: 34},
  {size: 'S', bust: 34, waist: 28, hips: 36},
  {size: 'M', bust: 36, waist: 30, hips: 38},
  {size: 'L', bust: 38, waist: 32, hips: 40},
  {size: 'XL', bust: 40, waist: 34, hips: 42},
  {size: 'XXL', bust: 42, waist: 36, hips: 44},
]

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const SizeChart = ({visible, close}:sizeChartType) => {
  const [selected, setSelected] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [suggestedSize, setSuggestedSize] = useState<number>(-1);
  const [bustSize, setBustSize] = useState<number>(0);
  const [waistSize, setWaistSize] = useState<number>(0);
  const [hipsSize, setHipsSize] = useState<number>(0);
  const [unit, setUnit] = useState<boolean>(true);
  const [tabSize, setTabSize] = useState<number>(0);
  const tabPosition = useSharedValue(0);
  const setSize = () => {
    setSuggestedSize(Math.max(
      sizeChart.findIndex(item => item.bust == bustSize), 
      sizeChart.findIndex(item => item.waist == waistSize), 
      sizeChart.findIndex(item => item.waist == waistSize)
    ))
  }
  useEffect(()=>{
    tabPosition.value = withSpring(unit ? 0 : tabSize)
  }, [unit])
  useEffect(()=>{
    setShowSizeGuide(visible ? showSizeGuide : false)
  },[visible])

  useEffect(() => {setSize()}, [hipsSize])

  const screenDetails = [
    {
      title: "Your Bust Size",
      tip: "Measure along the fullest part of your chest while wearing a non-padded bra. Keep the tape snuge, not tight.",
      initialValue: 36,
      min: 32,
      max: 42,
      animationProgress: 0,
      promtText: "Your bust is ",
    },
    {
      title: "Your Waist Size",
      tip: "Measure at your natural waistline (the narrowest point). If unsure, bned sideways, where your body creases is your waist.",
      initialValue: 30,
      min: 26,
      max: 36,
      animationProgress: 0.54,
      promtText: "Your waist is ",
    },
    {
      title: "Your Bust Size",
      tip: "Measure around the widest part of your hips and bottom while standing naturally with feet together.",
      initialValue: 38,
      min: 34,
      max: 44,
      animationProgress: 1,
      promtText: "Your hips are ",
    },
  ]

  const ChartPage = () => {
    
    return (
      <>
        <View
          style={{
            paddingVertical: 8,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text
            style={{
              marginLeft: 4,
              fontSize: 22,
              color: '#18181b',
              fontFamily: 'CreatoDisplayMedium'
            }}
          >
            Size Guide
          </Text>
          <Pressable
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: '#f1f1f3',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={close}
          >
            <Ionicons name="close" size={16} color='#93939f'/>
          </Pressable>
        </View>
        <View
          style={{
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: '#ffebff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          <Image
            style={{
              height: 150,
              width: 123.5,
              top: -27,
              left: -40,
              position: 'absolute'
            }}
            source={require('@assets/svg/sizeChartHelper.svg')}
          />
          <View
            style={{
              gap: 4,
              marginLeft: 40
            }}
          >
            <Text
              style={{
                fontFamily: 'CreatoDisplayMedium',
                fontSize: 18,
                color: '#18181b'
              }}
            >
              Cant't Choose Size?
            </Text>
            <Text
              style={{
                fontFamily: 'CreatoDisplay',
                fontSize: 12,
                height: 14,
                color: '#18181b'
              }}
            >
              Test our Size suggestion
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: '#18181b',
              borderRadius: 8,
              padding: 12
            }}
            onPress={() => {setShowSizeGuide(true)}}
          >
            <Text
              style={{
                fontFamily: 'CreatoDisplay',
                fontSize: 16,
                height: 18,
                color: '#fff'
              }}
            >
              Find out!
            </Text>
          </Pressable>
        </View>
        <View style={{height: 16}}/>
        <View style={{height: 1, backgroundColor: '#f1f1f3'}}/>
        <View style={{height: 16}}/>
        <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 22, color: '#18181b'}}>Size Chart</Text>
        <View style={{height: 16}}/>
        <View
          style={{
            backgroundColor: '#f1f1f3',
            borderColor: '#e4e4e7',
            borderWidth: 1,
            borderRadius: 8,
            flexDirection: 'row'
          }}
          onLayout={({nativeEvent:{layout}}) => {setTabSize(layout.width/2)}}
        >
          <Animated.View
            style={{
              backgroundColor: '#18181b',
              borderRadius: 8,
              height: 40,
              width: '50%',
              position: 'absolute',
              left: tabPosition
            }}
          />
          <Pressable
            style={{
              borderRadius: 8,
              height: 40,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={()=>{setUnit(true)}}
          >
            <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 16, color: unit ? '#fff' : '#93939f'}}>IN</Text>
          </Pressable>
          <Pressable
            style={{
              borderRadius: 8,
              height: 40,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={()=>{setUnit(false)}}
          >
            <Text style={{fontFamily: 'CreatoDisplayMedium', fontSize: 16, color: unit ? '#93939f' : '#fff'}}>CM</Text>
          </Pressable>
        </View>
        <View style={{height: 16}}/>
        <View
          style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e4e4e7',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 33,
              width: '100%',
              alignItems: 'center'
            }}
          >
            <View style={{
              backgroundColor: '#f1f1f3', 
              flex: 1,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text 
                style={{
                  color: '#18181b',
                  fontFamily: 'CreatoDisplay Medium',
                  fontSize: 12
                }}
              >SIZES</Text>
            </View>
            <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
            <View style={{
              backgroundColor: '#f1f1f3', 
              flex: 1.5,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text 
                style={{
                  color: '#18181b',
                  fontFamily: 'CreatoDisplay Medium',
                  fontSize: 12
                }}
              >BUST {unit ? '(IN)' : '(CM)'}</Text>
            </View>
            <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
            <View style={{
              backgroundColor: '#f1f1f3', 
              flex: 1.5,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text 
                style={{
                  color: '#18181b',
                  fontFamily: 'CreatoDisplay Medium',
                  fontSize: 12
                }}
              >WAIST {unit ? '(IN)' : '(CM)'}</Text>
            </View>
            <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
            <View style={{
              backgroundColor: '#f1f1f3', 
              flex: 1.5,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text 
                style={{
                  color: '#18181b',
                  fontFamily: 'CreatoDisplay Medium',
                  fontSize: 12
                }}
              >HIPS {unit ? '(IN)' : '(CM)'}</Text>
            </View>
          </View>
          {
            sizeChart.map((item, index) => (
              <View key={index}>
                <View style={{width: '100%', height: 1, backgroundColor: '#e4e4e7'}}/>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 33,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: 8,
                    borderWidth: index == suggestedSize ? 1 : 0,
                    borderColor: index == suggestedSize ? '#5439db' : 'transparent',
                    backgroundColor: index == suggestedSize ? '#ddd7f866' : '#fff'
                  }}
                >
                  <View style={{
                    backgroundColor: '#7878870d', 
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text 
                      style={{
                        color: '#18181b',
                        fontFamily: 'CreatoDisplay Medium',
                        fontSize: 12
                      }}
                    >{item.size}</Text>
                  </View>
                  <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
                  <View style={{
                    flex: 1.5,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text 
                      style={{
                        color: bustSize == item.bust ? '#fff' : '#18181b',
                        textAlign: 'center',
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        fontFamily: 'CreatoDisplay Medium',
                        fontSize: 12,
                        borderRadius: 6,
                        backgroundColor: bustSize == item.bust ? '#18181b' : 'transparent',
                      }}
                    >{unit ? item.bust : (item.bust*2.54).toFixed(0)}</Text>
                  </View>
                  <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
                  <View style={{
                    flex: 1.5,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text 
                      style={{
                        color: waistSize == item.waist ? '#fff' : '#18181b',
                        textAlign: 'center',
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        fontFamily: 'CreatoDisplay Medium',
                        fontSize: 12,
                        borderRadius: 6,
                        backgroundColor: waistSize == item.waist ? '#18181b' : 'transparent',
                      }}
                    >{unit ? item.waist : (item.waist*2.54).toFixed(0)}</Text>
                  </View>
                  <View style={{width: 1, height: '100%', backgroundColor: '#e4e4e7'}}/>
                  <View style={{
                    flex: 1.5,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text 
                      style={{
                        color: hipsSize == item.hips ? '#fff' : '#18181b',
                        textAlign: 'center',
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        fontFamily: 'CreatoDisplay Medium',
                        fontSize: 12,
                        borderRadius: 6,
                        backgroundColor: hipsSize == item.hips ? '#18181b' : 'transparent',
                      }}
                    >{unit ? item.hips : (item.hips*2.54).toFixed(0)}</Text>
                  </View>
                </View>
              </View>
            ))
          }
        </View>
      </>
    )
  }

  const SizeGuide = useCallback(({unit}:{unit:boolean}) => {
    const initialRender = useRef(true);
    const [integerPart, setIntegerPart] = useState(screenDetails[0].initialValue);
    const [fractionPart, setFractionPart] = useState(0);
    const [centimeter, setCentimeter] = useState(Math.round(screenDetails[0].initialValue*2.54));
    const animationProgress = useSharedValue(0);
    const animationProgressProp = useAnimatedProps(() => ({progress: animationProgress.value}));
    const [step, setStep] = useState(0);
    const [scale, setScale] = useState(unit);
    const tabPosition = useSharedValue(unit ? 0 : 60);
    const currentMeasurements = useRef([screenDetails[0].initialValue, screenDetails[1].initialValue, screenDetails[2].initialValue]);
    const setBust = () => {
      const size = scale ? (integerPart + fractionPart/10) : centimeter/2.54;
      let prev = 0;
      for(const item of sizeChart) {
        if(item.bust >= size) {
          setBustSize(item.bust - size < size - prev ? item.bust : prev);
          console.log('Bust Size', item.bust - size < size - prev ? item.bust : prev)
          return;
        } else 
          prev = item.bust;
      }
      setBustSize(prev);
    }
    const setWaist = () => {
      const size = scale ? integerPart + fractionPart/10 : centimeter/2.54;
      let prev = 0;
      for(const item of sizeChart) {
        if(item.waist >= size) {
          setWaistSize(item.waist - size < size - prev ? item.waist : prev)
          console.log('Waist Size', item.waist - size < size - prev ? item.waist : prev)
          return;
        } else 
          prev = item.waist;
      }
      setWaistSize(prev)
    }
    const setHips = () => {
      const size = scale ? integerPart + fractionPart/10 : centimeter/2.54;
      let prev = 0;
      for(const item of sizeChart) {
        if(item.hips >= size) {
          setHipsSize(item.hips - size < size - prev ? item.hips : prev)
          console.log("Hip Size", item.hips - size < size - prev ? item.hips : prev)
          return;
        } else 
          prev = item.hips;
      }
      setHipsSize(prev)
    }
    useEffect(()=>{
      if(initialRender.current) {
        initialRender.current = false;
        return;
      }
      tabPosition.value = withSpring(scale ? 0 : 60);
      setUnit(scale);
      if(scale) {
        const inch = centimeter/2.54;
        if(inch > screenDetails[step].max) {
          setIntegerPart(screenDetails[step].max);
          setFractionPart(0);
          return;
        }
        if(inch < screenDetails[step].min) {
          setIntegerPart(screenDetails[step].min);
          setFractionPart(0);
          return
        }
        const fraction = (inch - Math.trunc(inch));
        setIntegerPart(inch - fraction);
        setFractionPart(Math.round(fraction*10));
      } else {
        const centimeter = (integerPart + fractionPart/10)*2.54;
        if(centimeter > Math.round(screenDetails[step].max*2.54)) {
          setCentimeter(Math.round(screenDetails[step].max*2.54));
          return;
        }
        if(centimeter < Math.round(screenDetails[step].min*2.54)) {
          setCentimeter(Math.round(screenDetails[step].min*2.54));
          return;
        }

        setCentimeter(Math.round(centimeter))
      }
    }, [scale])

    useEffect(()=>{
      animationProgress.value = withTiming(
        screenDetails[step].animationProgress, 
        {
          duration: Math.abs(screenDetails[step].animationProgress-animationProgress.value) * 1500,
          easing: Easing.linear
        }
      )
      setIntegerPart(Math.trunc(currentMeasurements.current[step]))
      setFraction(Math.round((currentMeasurements.current[step]-Math.trunc(currentMeasurements.current[step]))*10))
      setCentimeter(Math.round(currentMeasurements.current[step]*2.54))
    }, [step])

    useEffect(()=>{
      // console.log(`${integerPart}.${fractionPart}`)
      currentMeasurements.current[step] = scale ? integerPart + fractionPart/10 : centimeter/2.54;
    }, [fractionPart, integerPart, centimeter])

    return(
      <View style={{justifyContent: 'space-between', flex: 1, backgroundColor: '#fff'}}>
        <View>
          <View
            style={{
              paddingVertical: 8,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                marginLeft: 4,
                fontSize: 22,
                color: '#18181b',
                fontFamily: 'CreatoDisplayMedium'
              }}
            >
              Measurements
            </Text>
            <Pressable
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: '#f1f1f3',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={close}
            >
              <Ionicons name="close" size={16} color='#93939f'/>
            </Pressable>
          </View>
          <View style={{height: 16}}/>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 4,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: '#18181b',
                fontFamily: 'CreatoDisplayMedium'
              }}
            >
              {screenDetails[step].title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#f1f1f3',
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Animated.View
                style={{
                  height: 40,
                  width: 60,
                  borderRadius: 8,
                  backgroundColor: '#18181b',
                  position: 'absolute',
                  left: tabPosition,
                }}
              />
              <Pressable
                onPress={() => {setScale(true)}}
              >
                <Text
                  style={{
                    height: 40,
                    width: 60,
                    color: scale ? '#fff' : '#93939f',
                    fontSize: 16,
                    fontFamily: 'CreatoDisplayMedium',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    borderRadius: 8
                  }}
                >
                  IN
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {setScale(false)}}
              >
                <Text
                  style={{
                    height: 40,
                    width: 60,
                    color: scale ? '#93939f' : '#fff',
                    fontSize: 16,
                    fontFamily: 'CreatoDisplayMedium',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    borderRadius: 8
                  }}
                >
                  CM
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{height: 16}}/>
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              backgroundColor: '#eeebfb',
              borderColor: '#ddd7f8'
            }}
          >
            <Text
              style={{
                fontFamily: 'CreatoDisplay',
                fontSize: 12,
                color: '#110b2c'
              }}
            >
              <Text style={{fontFamily: 'CreatoDisplayBold'}}>Tip:</Text> {screenDetails[step].tip}
            </Text>
          </View>
          <View style={{height: 32}}/>
          <View style={{flexDirection: 'row', flex: 1, paddingHorizontal: 16, height: (width-88)*1.25/2}}>
            <AnimatedLottieView 
              style={{height: '100%', aspectRatio: 0.8}} 
              source={require('@assets/animation/womenSizeGuide.json')} 
              // cacheComposition={true}
              loop={false}
              autoPlay={false}
              // speed={-1}
              animatedProps={animationProgressProp}
            />
            <View style={{width: 24}}/>
            <View style={{width: (width-88)/2, height: '100%', flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
              {
                scale ?
                <>
                  <ScrollWheel
                    onValueChange={setIntegerPart}
                    containerStyle={{width: 74, height: '100%', alignItems: unit ? 'flex-start' : 'center'}} //74
                    textStyle={{fontFamily: 'CreatoDisplayMedium', color: '#18181b', fontSize: 40, textAlign: 'right', width: 127, paddingRight: 50, textDecorationLine: 'none'}}
                    selectedValueStyle={{fontSize: 60, paddingRight: 53, textDecorationColor: '#5439db', textDecorationStyle: 'solid', textDecorationLine: 'underline'}}
                    value={integerPart}
                    min={screenDetails[step].min}
                    max={screenDetails[step].max}
                    visibleCount={5}
                  />
                  <Text style={{fontSize: 60, color: '#18181b', width: 16}}>.</Text>
                  <ScrollWheel
                    onValueChange={setFractionPart}
                    containerStyle={{width: 37, height: '100%', alignItems: 'flex-end'}}  //37
                    textStyle={{fontFamily: 'CreatoDisplayMedium', color: '#18181b', fontSize: 40, textAlign: 'left', width: 127, paddingLeft: 87, textDecorationLine: 'none'}}
                    selectedValueStyle={{fontSize: 60, paddingLeft: 90, textDecorationColor: '#5439db', textDecorationStyle: 'solid', textDecorationLine: 'underline'}}
                    value={fractionPart}
                    min={0}
                    max={9}
                    visibleCount={5}
                    circular
                  />
                </> :
                <ScrollWheel
                  onValueChange={setCentimeter}
                  containerStyle={{width: 127, height: '100%', alignItems: 'center'}} //74
                  textStyle={{fontFamily: 'CreatoDisplayMedium', color: '#18181b', fontSize: 40, textAlign: 'center', width: 127, textDecorationLine: 'none'}}
                  selectedValueStyle={{fontSize: 60, textDecorationColor: '#5439db', textDecorationStyle: 'solid', textDecorationLine: 'underline'}}
                  value={centimeter}
                  min={Math.round(screenDetails[step].min*2.54)}
                  max={Math.round(screenDetails[step].max*2.54)}
                  visibleCount={5}
                />
              }
              <LinearGradient
                colors={['#fff','#ffffff88', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff88', '#fff']}
                locations={[0, 0.25,0.45, 0.5, 0.55, 0.75, 1]}
                style={{
                  position:'absolute', 
                  height: (width-88)*1.25/2+2, 
                  top:-1,
                  width: 127, 
                  // flexDirection: 'row', 
                  // alignSelf: 'center', 
                  // alignItems: 'flex-end', 
                  // backgroundColor: 'purple'
                }}
              />
            </View>
          </View>
          <View style={{height: 24}}/>
          <Text style={{fontSize: 18, fontFamily: 'CreatoDisplay', color: '#110b2c', textAlign: 'center'}}>
            {screenDetails[step].promtText}<Text style={{fontFamily: 'CreatoDisplayBold'}}>{scale ? `${integerPart}.${fractionPart}` : centimeter} {scale ? 'in' : 'cm'}</Text>.
          </Text>
          
        </View>
        <View style={{height: 40, flexDirection: 'row', gap: 12}}>
        <Button
          label="Go back"
          onPress={() => {
            if(step > 0) 
              setStep(step-1);
            else
              setShowSizeGuide(false)
          }}
          variant="neutral"
        />
        <Button
          label={step == 2 ? "Continue" : "Next"}
          onPress={() => {
            switch(step) {
              case 0:
                setBust();
                break;
              case 1:
                setWaist();
                break;
              case 2:
                setHips();
                break;
            }
            if(step < 2) 
              setStep(step+1);
            else
              setShowSizeGuide(false)
          }}
          variant="primary"
        />
        </View>
      </View>
    )
  }, [])

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      backdropColor="#00000061"
      onRequestClose={close}
    >
      <View style={{height: '100%', width: '100%', flexDirection: 'column-reverse'}}>
        <View 
          style={{
            height: '80%', 
            width: '100%', 
            backgroundColor: 'white', 
            paddingHorizontal: 16, 
            paddingTop: 8, 
            paddingBottom: 32,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <ScrollView
            style={{height: '100%'}}
            contentContainerStyle={{minHeight: '100%'}}
            showsVerticalScrollIndicator={false}
          >
            <View style={{position: 'absolute', width: '100%'}}>
              <View
                style={{
                  paddingVertical: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 22,
                    color: '#18181b',
                    fontFamily: 'CreatoDisplayMedium'
                  }}
                >
                  Size Guide
                </Text>
                <Pressable
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    backgroundColor: '#f1f1f3',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={close}
                >
                  <Ionicons name="close" size={16} color='#93939f'/>
                </Pressable>
              </View>
              <View
                style={{
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ffebff',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                <Image
                  style={{
                    height: 150,
                    width: 123.5,
                    top: -27,
                    left: -40,
                    position: 'absolute'
                  }}
                  source={require('@assets/svg/sizeChartHelper.svg')}
                />
                <View
                  style={{
                    gap: 4,
                    marginLeft: 40
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'CreatoDisplayMedium',
                      fontSize: 18,
                      color: '#18181b'
                    }}
                  >
                    Cant't Choose Size?
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'CreatoDisplay',
                      fontSize: 12,
                      height: 14,
                      color: '#18181b'
                    }}
                  >
                    Test our Size suggestion
                  </Text>
                </View>
                <Pressable
                  style={{
                    backgroundColor: '#18181b',
                    borderRadius: 8,
                    padding: 12
                  }}
                  onPress={() => {setShowSizeGuide(true)}}
                >
                  <Text
                    style={{
                      fontFamily: 'CreatoDisplay',
                      fontSize: 16,
                      height: 18,
                      color: '#fff'
                    }}
                  >
                    Find out!
                  </Text>
                </Pressable>
              </View>
            </View>
            {
              showSizeGuide ?
              <SizeGuide unit={unit}/> :
              <ChartPage/>
            }
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}