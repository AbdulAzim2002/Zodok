import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily} from '../../../shared/';


const SCREEN_WIDTH = Dimensions.get('window').width;

export const LoadingBar = ({ duration = 5000 }) => {

    const { tokens, theme } = useTheme();

    const styles = useThemedStyles((tokens) => ({
    container: {
        height: 10,
        width: '100%',
        backgroundColor: getColor(tokens, 'border.divider'),
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 20,
        alignItems: 'flex-start', // 👈 ensures bar grows from the left
    },
    bar: {
        height: '100%',
        backgroundColor: getColor(tokens, 'brand.primary'),
        borderRadius: 5,
    },
  }));
    
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: SCREEN_WIDTH,
            duration,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.bar, { width: progress }]} />
        </View>
    );
};