import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../shared/';
import { getColor, getSpacing, getBorderRadius, getFontFamily, useThemedStyles } from '../../../shared/';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  actionText?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 10000,
  onClose,
  actionText = 'Understood',
  containerStyle,
  textStyle,
}) => {
  const { tokens, theme } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<number | null>(null);

  const styles = useThemedStyles((tokens) => ({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      paddingHorizontal: getSpacing(tokens, 'padding.button'),
      paddingTop: 16, // Account for status bar
    },
    toastContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: getToastBackgroundColor(type, tokens),
      borderRadius: getBorderRadius(tokens, 'card'),
      borderColor: getToastBorderColor(type, tokens),
      borderWidth: 1,
      padding: getSpacing(tokens, 'padding.button'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      marginRight: getSpacing(tokens, 'gap.button'),
    },
    messageContainer: {
      flex: 1,
    },
    message: {
      color: getToastTextColor(type, tokens),
      fontFamily: getFontFamily('medium'),
      fontSize: 14,
    },
    actionButton: {
      marginLeft: getSpacing(tokens, 'gap.button'),
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: getBorderRadius(tokens, 'button'),
      backgroundColor: getToastActionBackgroundColor(type, tokens),
    },
    actionText: {
      color: getToastActionTextColor(type, tokens),
      fontFamily: getFontFamily('medium'),
      fontSize: 14,
    },
  }));

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color={getToastIconColor(type, tokens)} />;
      case 'error':
        return <Ionicons name="alert-circle" size={24} color={getToastIconColor(type, tokens)} />;
      case 'warning':
        return <Ionicons name="warning" size={24} color={getToastIconColor(type, tokens)} />;
      case 'info':
      default:
        return <Ionicons name="information-circle" size={24} color={getToastIconColor(type, tokens)} />;
    }
  };

  function getToastBackgroundColor(type: ToastType, tokens: any): string {
    switch (type) {
      case 'success':
        return getColor(tokens, 'state.success');
      case 'error':
        return getColor(tokens, 'state.error');
      case 'warning':
        return getColor(tokens, 'state.warning');
      case 'info':
      default:
        return getColor(tokens, 'state.info');
    }
  }

  function getToastBorderColor(type: ToastType, tokens: any): string {
    switch (type) {
      case 'success':
        return getColor(tokens, 'border.success');
      case 'error':
        return getColor(tokens, 'border.error');
      case 'warning':
        return getColor(tokens, 'border.warning');
      case 'info':
      default:
        return getColor(tokens, 'border.info');
    }
  }

  function getToastTextColor(type: ToastType, tokens: any): string {
    return getColor(tokens, 'text.main');
  }

  function getToastIconColor(type: ToastType, tokens: any): string {
    switch (type) {
      case 'success':
        return getColor(tokens, 'icon.success');
      case 'error':
        return getColor(tokens, 'icon.error');
      case 'warning':
        return getColor(tokens, 'icon.warning');
      case 'info':
      default:
        return getColor(tokens, 'icon.info');
    }
  }

  function getToastActionBackgroundColor(type: ToastType, tokens: any): string {
    return theme === 'light' 
      ? getColor(tokens, 'bg.button.neutralsecondary') 
      : getColor(tokens, 'bg.button.neutralsecondary');
  }

  function getToastActionTextColor(type: ToastType, tokens: any): string {
    return getColor(tokens, 'text.main');
  }

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show toast
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide toast after duration
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }
    } else {
      // Hide toast
      handleClose();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
        containerStyle,
      ]}
    >
      <View style={styles.toastContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>{getToastIcon(type)}</View>
          <View style={styles.messageContainer}>
            <Text style={[styles.message, textStyle]}>{message}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={handleClose}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
