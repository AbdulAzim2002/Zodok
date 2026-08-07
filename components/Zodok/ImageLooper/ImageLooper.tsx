import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType } from 'react-native';

interface ImageLooperProps {
  images: ImageSourcePropType[];
  cycleDuration?: number; // in ms (default: 3000)
  size?: number; // width & height of the square image
}

export const ImageLooper: React.FC<ImageLooperProps> = ({ 
  images, 
  cycleDuration = 3000, 
  size = 200 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const intervalTime = cycleDuration / images.length;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images, cycleDuration]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image 
        source={images[currentIndex]} 
        style={{ width: size, height: size, resizeMode: 'cover', borderRadius: 16 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// export default ImageLooper;
