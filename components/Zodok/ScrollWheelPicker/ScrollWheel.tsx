import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, TextStyle, View, ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withSpring
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ScrollWheelCard } from './ScrollWheelCard';

interface ScrollWheelProp {
  /**Style of the container enclosing the scroll wheel*/
  containerStyle?: ViewStyle,
  /**Style of the values in the scroll wheel.*/
  textStyle?: TextStyle,
  /**Style selected value in the scroll wheel.*/
  selectedValueStyle?: TextStyle,
  /**Number of values visible.*/
  visibleCount?: number,
  perspective?: number,
  /**Smallest number on the scroll wheel. Defaults to 1.*/
  min?: number,
  /**Differnce between the consicutive values. */
  stepSize?: number,
  /**Largest num number on the scroll wheel.*/
  max?: number,
  /**A function which is called when the selected value of the scroll wheel is changed. The selected value is passed as the parameter. */
  onValueChange: (selectedValue: number) => void,
  /**If provided true the scroll wheel will be horizontal.*/
  value?: number,
  horizontal?: boolean,
  /**A worklet function which accepts the `value` as parameter and returns a string. Can be used to render custom text on the scroll wheel. It overrides prefix and suffix.*/
  renderValue?: (value: number) => string,
  /**Prefix to every value on the scroll wheel. Overridden if `renderValue` is provided.*/
  prefix?: string,
  /**Suffix to every value on the scroll wheel. Overridden if `renderValue` is provided.*/
  suffix?: string,
  /**The rate at which the velocity of the scroll wheel decreases after scrolling.*/
  deceleration?: number,
  /**If true the list will be circualr.*/
  circular?: boolean,
  gradient?: string[],
  sensitivity?: number,
  dampingRatio?: number,
  damping?: number,
}

/**Scroll wheel picker by Abdul Azim*/
export const ScrollWheel = ({
  containerStyle,
  textStyle,
  selectedValueStyle,
  visibleCount=5,
  perspective=500,
  min=0,
  stepSize=1,
  max=Number.MAX_SAFE_INTEGER,
  onValueChange,
  value,
  horizontal=false,
  renderValue,
  prefix,
  suffix,
  deceleration=0.998,
  circular=false,
  gradient,
  sensitivity=1,
  dampingRatio=1,
  damping=120
}: ScrollWheelProp) => {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [wheelHeight, setWheelHeight] = useState(0);
  const scrollOffset = useSharedValue<number>(0);
  const dragOffset = useSharedValue<number>(0);

  useEffect(() => {
    if(wheelHeight <= 0)
      return;
    const current =  Math.round(scrollOffset.value/wheelHeight*visibleCount);
    onValueChange((current%((max-min)/stepSize+1))*stepSize+min);
  }, [min, max])

  useEffect(() => {
    if(value == undefined)
        return;
    if(wheelHeight <= 0)
      return;
    if(value >= min && value <= max)
      scrollOffset.value = withSpring((value-min)*stepSize*wheelHeight/visibleCount)
    else if(value > max) {
      scrollOffset.value = withSpring((max-min)*stepSize*wheelHeight/visibleCount);
      onValueChange(max);
    }
    else {
      scrollOffset.value = withSpring(0);
      onValueChange(min);
    }
  }, [value])

  useEffect(()=>{
    const currentWheelHeight = horizontal ? dimensions.width : dimensions.height;
    const current =  Math.round(scrollOffset.value/currentWheelHeight*visibleCount)*stepSize+min;
    if(Number.isNaN(current))
      return;
    if(current > max) {
      onValueChange(max);
      scrollOffset.value = (max-min)*currentWheelHeight/visibleCount/stepSize
    } else
      onValueChange(current)
    setWheelHeight(currentWheelHeight);
  }, [horizontal])

  useEffect(() => {
    if(value)
      scrollOffset.value = (value-min)*wheelHeight/visibleCount/stepSize;
  }, [wheelHeight])

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setWheelHeight(horizontal ? width : height);
    setDimensions({ width, height });
  };

  const getOnChangeHandeler = (
    horizontal: boolean, 
    circular: boolean, 
    scrollOffset: SharedValue<number>, 
    dragOffset: SharedValue<number>, 
    scrollLength: number
  ) => {
    return circular ?
      (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
        'worklet'; 
        dragOffset.value = sensitivity*(horizontal ? -event.translationX : -event.translationY);
      } : 
      (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
        'worklet'; 
        dragOffset.value = sensitivity*(horizontal ? -event.translationX : -event.translationY);
        if(scrollOffset.value + dragOffset.value < 0)
          dragOffset.value = -scrollOffset.value;
        else if(scrollOffset.value + dragOffset.value > scrollLength)
          dragOffset.value = scrollLength - scrollOffset.value;
      }
  }

  const getOnFinalizeHandeler = (
    horizontal: boolean, 
    circular: boolean,
    scrollOffset: SharedValue<number>, 
    dragOffset: SharedValue<number>, 
    scrolllHeight: number,
    cardHeight: number,
    deceleration: number,
    onValueChange: (value: number) => void,
    stepSize: number,
    min: number,
    max: number,
  ) => {
    return circular ?
      (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        'worklet';
        scrollOffset.value += dragOffset.value;
        dragOffset.value = 0;
        scrollOffset.value = withDecay(
          {
            velocity: sensitivity*(horizontal ? -event.velocityX : -event.velocityY),
            deceleration,
          },
          () => {
            scrollOffset.value = scrollOffset.value%scrolllHeight;
            if(scrollOffset.value < 0)
              scrollOffset.value += scrolllHeight;
            const current =  Math.round(scrollOffset.value/cardHeight);
            scrollOffset.value = withSpring(current*cardHeight);
            scheduleOnRN(onValueChange, (current%((max-min)/stepSize+1))*stepSize+min);
          }
        )
      } :
      (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        'worklet';
        scrollOffset.value += dragOffset.value;
        dragOffset.value = 0;
        scrollOffset.value = withDecay(
          {
            velocity: sensitivity*(horizontal ? -event.velocityX : -event.velocityY),
            deceleration,
            clamp: [
              0,
              scrolllHeight-cardHeight 
            ],
          },
          () => {
            const current =  Math.round(scrollOffset.value/cardHeight);
            scrollOffset.value = withSpring(current*cardHeight);
            scheduleOnRN(onValueChange, current*stepSize+min);
          }
        )
      }
  }

  const onChange = getOnChangeHandeler(horizontal, circular, scrollOffset, dragOffset, ((max-min)/stepSize)*wheelHeight/visibleCount);
  const onFinalize = getOnFinalizeHandeler(horizontal, circular, scrollOffset, dragOffset, ((max-min)/stepSize+1)*wheelHeight/visibleCount, wheelHeight/visibleCount, deceleration, onValueChange, stepSize, min, max);

  const pan = Gesture.Pan()
    .onChange(onChange)
    .onFinalize(onFinalize);

  return (
    <GestureHandlerRootView style={{}}>
      <View onLayout={handleLayout} style={[{alignItems: 'center', justifyContent: 'center'}, containerStyle]}>

        {Array.from({length: visibleCount}).map((_, index) =>(
          <ScrollWheelCard 
            key={index}
            index={index}
            scrollOffset={scrollOffset}
            dragOffset={dragOffset}
            wheelHeight={wheelHeight}
            visibleCount={visibleCount}
            min={min}
            max={max}
            stepSize={stepSize}
            perspective={perspective}
            horizontal={horizontal}
            cardStyle={textStyle}
            renderValue={renderValue}
            prefix={prefix}
            suffix={suffix}
            selectedValueStyle={selectedValueStyle}
            circular={circular}
            gradient={gradient}
          />
        ))}

        <GestureDetector gesture={pan}>
          <View 
            style={[
              {height: '100%', width: '100%', position: 'absolute'},
            ]}
          />
        </GestureDetector>
    </View>
    </GestureHandlerRootView>
  )
};