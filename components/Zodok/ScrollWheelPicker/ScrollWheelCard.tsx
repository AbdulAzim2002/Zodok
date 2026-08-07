import React from 'react';
import { Platform, TextInput, TextInputProps, TextStyle } from 'react-native';
import {
  createAnimatedComponent,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue
} from 'react-native-reanimated';

interface ScrollWheelProp {
  index: number,
  scrollOffset: SharedValue<number>,
  dragOffset: SharedValue<number>,
  wheelHeight: number,
  visibleCount: number,
  min: number,
  max: number;
  stepSize: number,
  perspective: number,
  horizontal: boolean,
  cardStyle?: TextStyle,
  renderValue?: (value: number) => string,
  prefix?: string,
  suffix?: string,
  selectedValueStyle?: TextStyle,
  circular?: boolean,
  gradient?: string[]
}

export const  ScrollWheelCard = ({
  index,
  scrollOffset,
  dragOffset,
  wheelHeight,
  visibleCount,
  min,
  max,
  stepSize,
  perspective,
  horizontal,
  cardStyle,
  renderValue,
  prefix,
  suffix,
  selectedValueStyle,
  circular,
  gradient
}: ScrollWheelProp) => {

  const gradientBreakPoints: number[] = [];
  if(gradient) {
    const len = gradient.length;
    if(len > 1) {
      const angle = Platform.OS == 'web' ? Math.atan(2*perspective/wheelHeight) : Math.PI/2;
      for(let i=0; i<len; i++)
        gradientBreakPoints.push(2*angle/(len-1)*i-angle);
    } else {
      console.error('Provide atleat two color for the gradient in ScrollWheel');
    }
  }

  const text = useDerivedValue(() => {
    const y = scrollOffset.value + dragOffset.value + wheelHeight/2 - wheelHeight/visibleCount*index;
    const indexOffset = (Math.floor(y/wheelHeight)*visibleCount+index)%((max-min)/stepSize+1)
    const value = (indexOffset >= 0 ? indexOffset : ((max-min)/stepSize+1) + indexOffset)*stepSize+min;
    return renderValue ? renderValue(value) : `${prefix||''}${value}${suffix||''}`;
  });

  const animatedText = useAnimatedProps<TextInputProps>(() => ({
    placeholder: text.value,
  }));

  const textStyle = useAnimatedStyle(()=>{
    const cardHeight = wheelHeight/visibleCount;
    const y = scrollOffset.value + dragOffset.value + wheelHeight/2 - cardHeight*index;
    const rotation = (y*Math.PI/wheelHeight)%Math.PI - Math.PI/2;
    const rotateX = `${Platform.OS == 'web' ? rotation*Math.atan(2*perspective/wheelHeight)/Math.PI*2 : rotation}rad`;
    const rotateY = `${Platform.OS == 'web' ? -rotation*Math.atan(2*perspective/wheelHeight)/Math.PI*2 : -rotation}rad`;
    const translation = -wheelHeight/2*Math.sin(rotation);
    const scale = perspective/(perspective + wheelHeight/2*Math.cos(Math.PI/visibleCount/2)*(1 - Math.cos(rotation)));
    const value = (Math.floor(y/wheelHeight)*visibleCount+index)*stepSize+min;
    const pos = y%wheelHeight;
    const selected = pos > (wheelHeight-cardHeight)/2 && pos < (wheelHeight+cardHeight)/2;

    return(
      {
        ...(gradient && (gradientBreakPoints.length > 1) ?
          {color: interpolateColor(
            rotation,
            gradientBreakPoints,
            gradient
          )} :
          {}
        ),
        ...(selected ? selectedValueStyle : cardStyle),
        transform: [
          {perspective}, 
          ...(
            horizontal ?
            [{translateX: translation}, {rotateY}] :
            [{translateY: translation}, {rotateX}]
          ), 
          {scale}
        ],
        opacity: (y >= 0) && (value <= max)  ? 1 : 0,
      }
    );
  });

  const textStyleC = useAnimatedStyle(()=>{
    const y = scrollOffset.value + dragOffset.value + wheelHeight/2 - wheelHeight/visibleCount*index;
    const rotation = (y*Math.PI/wheelHeight)%Math.PI + (y >= 0 ? -Math.PI/2 : Math.PI/2);
    const rotateX = `${Platform.OS == 'web' ? rotation*Math.atan(2*perspective/wheelHeight)/Math.PI*2 : rotation}rad`;
    const rotateY = `${Platform.OS == 'web' ? -rotation*Math.atan(2*perspective/wheelHeight)/Math.PI*2 : -rotation}rad`;
    const translation = -wheelHeight/2*Math.sin(rotation);
    const scale = perspective/(perspective + wheelHeight/2*Math.cos(Math.PI/visibleCount/2)*(1 - Math.cos(rotation)));
    const pos = y%wheelHeight + (y%wheelHeight < 0 ? wheelHeight : 0);
    const selected = pos > wheelHeight/2-wheelHeight/visibleCount/2 && pos < wheelHeight/2+wheelHeight/visibleCount/2;

    return(
      {
        ...(gradient && (gradientBreakPoints.length > 1) ?
          {color: interpolateColor(
            rotation,
            gradientBreakPoints,
            gradient
          )} :
          {}
        ),
        ...(selected ? selectedValueStyle : cardStyle),
        transform: [
          {perspective}, 
          ...(
            horizontal ?
            [{translateX: translation}, {rotateY}] :
            [{translateY: translation}, {rotateX}]
          ), 
          {scale}
        ],
        opacity: 1,
      }
    );
  });


  return (
    <AnimatedTextInput
      key={index}
      {...{text}}
      style={[
        {padding: 0, textAlign: 'center', textAlignVertical: 'center', borderWidth: 0},
        cardStyle,
        {position: 'absolute'},
        circular ? textStyleC : textStyle
      ]}
      editable={false}
      animatedProps={animatedText}
    />
  );
}

const AnimatedTextInput = createAnimatedComponent(TextInput);