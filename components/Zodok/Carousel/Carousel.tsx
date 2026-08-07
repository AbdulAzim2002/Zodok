import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';

export interface CarouselProps extends Omit<ScrollViewProps, 'horizontal'> {
  children: React.ReactNode;
  gap?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  gap = 8,
  style,
  contentContainerStyle,
  ...props
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={[
        styles.contentContainer,
        { gap },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
});

export default Carousel;
