import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getBorderRadius,
  getColor,
  getPrimaryFont,
  getSpacing,
  useTheme,
  useThemedStyles,
} from '../../../shared';

export interface ThemeToggleProps {
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = true,
}) => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const styles = useThemedStyles((tokens) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: getSpacing(tokens, 'gap.minigrid'),
    },
    label: {
      fontFamily: getPrimaryFont(tokens, 'regular'),
      fontSize: 14,
      color: getColor(tokens, 'text.main'),
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
      borderRadius: getBorderRadius(tokens, 'max'),
      padding: 4,
    },
    toggleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: getBorderRadius(tokens, 'max'),
      gap: 6,
    },
    toggleOptionActive: {
      backgroundColor: getColor(tokens, 'bg.screen'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleText: {
      fontFamily: getPrimaryFont(tokens, 'regular'),
      fontSize: 12,
      color: getColor(tokens, 'text.suggestion'),
    },
    toggleTextActive: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      color: getColor(tokens, 'text.main'),
    },
  }));

  const handleToggle = (mode: 'light' | 'dark') => {
    setTheme(mode);
  };

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Theme</Text>}
      <View style={styles.toggleContainer}>
        {/* Light Mode Option */}
        <TouchableOpacity
          style={[
            styles.toggleOption,
            !isDarkMode && styles.toggleOptionActive,
          ]}
          onPress={() => handleToggle('light')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sunny"
            size={16}
            color={!isDarkMode ? '#FD9300' : '#93939F'}
          />
          <Text
            style={[
              styles.toggleText,
              !isDarkMode && styles.toggleTextActive,
            ]}
          >
            Light
          </Text>
        </TouchableOpacity>

        {/* Dark Mode Option */}
        <TouchableOpacity
          style={[
            styles.toggleOption,
            isDarkMode && styles.toggleOptionActive,
          ]}
          onPress={() => handleToggle('dark')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="moon"
            size={16}
            color={isDarkMode ? '#5439DB' : '#93939F'}
          />
          <Text
            style={[
              styles.toggleText,
              isDarkMode && styles.toggleTextActive,
            ]}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
