import { useFonts } from 'expo-font';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkThemeTokens, lightThemeTokens } from '../tokens/parser';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  tokens: typeof lightThemeTokens;
  setTheme: (theme: ThemeType | 'system') => void;
  themePreference: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as ThemeType || 'light';
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('light');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');

  // Update theme when system preference or manual selection changes
  useEffect(() => {
    if (themePreference === 'system') {
      setCurrentTheme(systemColorScheme);
    } else {
      setCurrentTheme(themePreference);
    }
  }, [systemColorScheme, themePreference]);

  // Set theme function that allows manual override or system preference
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setThemePreference(theme);
  };

  // Get the appropriate tokens based on the current theme
  const tokens = currentTheme === 'light' ? lightThemeTokens : darkThemeTokens;

  const [loaded, error] = useFonts({
    'CreatoDisplay-Regular': require('@/assets/fonts/CreatoDisplay-Regular.otf'),
    'CreatoDisplay-RegularItalic': require('@/assets/fonts/CreatoDisplay-RegularItalic.otf'),
    'CreatoDisplay-Medium': require('@/assets/fonts/CreatoDisplay-Medium.otf'),
    'CreatoDisplay-MediumItalic': require('@/assets/fonts/CreatoDisplay-MediumItalic.otf'),
    'CreatoDisplay-Bold': require('@/assets/fonts/CreatoDisplay-Bold.otf'),
    'CreatoDisplay-BoldItalic': require('@/assets/fonts/CreatoDisplay-BoldItalic.otf'),
  });

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        tokens,
        setTheme,
        themePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme in components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
