import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralsecondary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8, //getBorderRadius(tokens, 'button'),
      paddingHorizontal: 16, //getSpacing(tokens, 'padding.button'),
      gap: 16, //getSpacing(tokens, 'gap.button'),
      flex: 1,
    },
    small: {
      height: 32,
    },
    medium: {
      height: 40,
    },
    large: {
      height: 48,
    },
    primary: {
      backgroundColor: "#5439DB", //getColor(tokens, 'brand.primary'),
    },
    primaryDisabled: {
      backgroundColor: "#93939F", //getColor(tokens, 'bg.button.neutralmain_disabled'),
    },
    secondary: {
      backgroundColor: "#FFCCFF", //getColor(tokens, 'brand.secondary'),
    },
    secondaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    tertiary: {
      backgroundColor: "#D4FF00", //getColor(tokens, 'brand.tertiary'),
    },
    tertiaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    neutral: {
      backgroundColor: "#18181b", //getColor(tokens, 'bg.button.neutralmain'),
    },
    neutralDisabled: {
      backgroundColor: "#93939F", //getColor(tokens, 'bg.button.neutralmain_disabled'),
    },
    neutralsecondary: {
      backgroundColor: "#e4e4e7", //getColor(tokens, 'bg.button.neutralsecondary'),
    },
    neutralsecondaryDisabled: {
      backgroundColor: "#484851", //getColor(tokens, 'bg.button.neutralsecondary_disabled'),
    },
    labelPrimary: {
      color: "#FFF", //getColor(tokens, 'text.bg.anydark'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelSecondary: {
      color: "#332933", //getColor(tokens, 'text.bg.secondarylight'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelTertiary: {
      color: "#2A3300", //getColor(tokens, 'text.bg.tertiarylight'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelNeutral: {
      color: "#FFF", //getColor(tokens, 'text.button.neutralmain'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelNeutralsecondary: {
      color: "#000", //getColor(tokens, 'text.button.neutralsecondary'),
      fontFamily: "CreatoDisplay",
      fontSize: 18,
    },
    labelDisabled: {
      color: "#484851", //getColor(tokens, 'text.button.neutralmain_disabled'),
      fontSize: 18,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const getButtonStyle = () => {
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles[`${variant}Disabled`] : null;

    return [styles.button, variantStyle, sizeStyle, disabledStyle, style];
  };

  const getLabelStyle = () => {
    const labelStyleMap = {
      primary: styles.labelPrimary,
      secondary: styles.labelSecondary,
      tertiary: styles.labelTertiary,
      neutral: styles.labelNeutral,
      neutralsecondary: styles.labelNeutralsecondary,
    };

    const variantLabelStyle = labelStyleMap[variant] || styles.labelPrimary;

    return [variantLabelStyle, disabled && styles.labelDisabled];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color="#000"
          size="small"
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={getLabelStyle()}>{label}</Text>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
