# Design Tokens Documentation

A comprehensive guide to using the ZodokShop design token system for React Native/Expo applications.

## Table of Contents

1. [Overview](#overview)
2. [Token System Architecture](#token-system-architecture)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing & Sizing](#spacing--sizing)
6. [Border System](#border-system)
7. [Semantic Tokens](#semantic-tokens)
8. [Utility Functions](#utility-functions)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Migration Guide](#migration-guide)

## Overview

The design token system provides a centralized, type-safe way to manage design values across the entire application. It ensures consistency, scalability, and easy theme switching between light and dark modes.

### Key Benefits

- **Consistency**: Unified design language across all components
- **Type Safety**: Full TypeScript support with compile-time validation
- **Theme Support**: Seamless light/dark mode switching
- **Scalability**: Easy to maintain and extend design values
- **Performance**: Optimized token resolution and caching
- **Developer Experience**: Intuitive helper functions and clear documentation

### Recent Improvements

- ✅ Fixed textDecoration support for React Native (uses `textDecorationLine`)
- ✅ Added automatic italic font family switching
- ✅ Enhanced typography utilities with style options
- ✅ Improved error handling and fallbacks

## Token System Architecture

The token system is organized into four main layers:

```
├── shared/tokens/
│   ├── global.json      # Base design tokens (colors, fonts, sizes)
│   ├── semantic.json    # Component-specific tokens
│   ├── light.json       # Light theme overrides
│   └── dark.json        # Dark theme overrides
├── shared/theme/
│   ├── utils.ts         # Token utility functions
│   └── ThemeProvider.tsx # Theme context and provider
```

### Token Resolution Flow

1. **Global tokens** define base values (colors, fonts, sizes)
2. **Semantic tokens** reference global tokens for component use
3. **Theme files** override tokens for light/dark variants
4. **Utility functions** resolve token references and convert to React Native styles

## Color System

The color system provides a comprehensive palette with consistent naming and semantic meaning.

### Color Palette Structure

Each color family includes 11 shades (50-950) plus semantic names:

```typescript
// Primary color family
primary: {
  50: "#EEEBFB",    // Lightest
  100: "#DDD7F8",
  200: "#BBB0F1",
  300: "#9888E9",
  400: "#7661E2",
  500: "#5439DB",   // Base color
  600: "#432EAF",
  700: "#322283",
  800: "#221758",
  900: "#110B2C",
  950: "#080616"    // Darkest
}
```

### Available Color Families

- **Primary**: Main brand color (#5439DB)
- **Secondary**: Secondary brand color (#FFCCFF)
- **Tertiary**: Accent color (#D4FF00)
- **Neutral**: Grayscale colors with white/black
- **Success**: Green color family (#00CC5F)
- **Error**: Red color family (#F02D37)
- **Warning**: Orange color family (#FD9300)
- **Info**: Blue color family (#3B76FF)

### Usage Examples

```typescript
import { getColor, useThemedStyles } from '../shared/theme/utils';

const styles = useThemedStyles((tokens) => ({
  container: {
    backgroundColor: getColor(tokens, 'primary.500'),
    borderColor: getColor(tokens, 'neutral.200'),
  },
  errorText: {
    color: getColor(tokens, 'error.600'),
  },
  successButton: {
    backgroundColor: getColor(tokens, 'success.500'),
  }
}));
```

## Typography System

The typography system provides consistent text styling with support for multiple font families, weights, and decorations.

### Font Families

#### Creato Display (Primary)
- **Regular**: CreatoDisplay-Regular / CreatoDisplay-RegularItalic
- **Medium**: CreatoDisplay-Medium / CreatoDisplay-MediumItalic
- **Bold**: CreatoDisplay-Bold / CreatoDisplay-BoldItalic

#### Space Mono (Secondary)
- **Regular**: SpaceMono-Regular

### Typography Styles

Pre-defined typography styles for consistent text hierarchy:

```typescript
// Available typography tokens
'h1'      // Large heading (34px, Creato Bold)
'h2'      // Medium heading (28px, Creato Medium)
'h3'      // Small heading (22px, Creato Medium)
'h4'      // Subheading (18px, Creato Medium)
'cta'     // Call-to-action (18px, Space Mono)
'p1'      // Body text large (16px, Space Mono)
'p2'      // Body text medium (14px, Space Mono)
'p3'      // Body text small (12px, Space Mono)
'link'    // Link text with underline (16px, Space Mono)
'slashed' // Strikethrough text (16px, Space Mono)
```

### Font Sizes

```typescript
'2xl': '34px'  // h1
'xl':  '28px'  // h2
'l':   '22px'  // h3
'm':   '18px'  // h4, cta
's':   '16px'  // p1, link, slashed
'xs':  '14px'  // p2
'2xs': '12px'  // p3
```

### Font Weights

```typescript
'100': 100    // Thin
'200': 200    // Extra Light
'300': 300    // Light
'400': 400    // Regular/Normal
'500': 500    // Medium
'600': 600    // Semi Bold
'700': 700    // Bold
'800': 800    // Extra Bold
'900': 900    // Black
```

### Text Decoration

Built-in support for text decorations:

```typescript
'link':    'underline'      // For links
'slashed': 'line-through'   // For strikethrough text
```

### Typography Usage Examples

```typescript
import { getTypography, getTypographyWithStyle, useThemedStyles } from '../shared/theme/utils';

const styles = useThemedStyles((tokens) => ({
  // Basic typography
  heading: getTypography(tokens, 'h1'),
  bodyText: getTypography(tokens, 'p1'),

  // Typography with italic
  italicText: getTypography(tokens, 'p1', { italic: true }),

  // Typography with style options
  emphasizedText: getTypographyWithStyle(tokens, 'p1', {
    italic: true,
    underline: true
  }),

  // Strikethrough text
  deletedText: getTypographyWithStyle(tokens, 'p2', {
    strikethrough: true
  }),

  // Link with hover state
  linkText: {
    ...getTypography(tokens, 'link'),
    color: getColor(tokens, 'text.link'),
  }
}));
```

## Spacing & Sizing

Consistent spacing and sizing tokens based on an 8px grid system.

### Spacing Scale

```typescript
'000x': '0px',    // No spacing
'025x': '2px',    // 0.25x base
'050x': '4px',    // 0.5x base
'100x': '8px',    // 1x base
'150x': '12px',   // 1.5x base
'200x': '16px',   // 2x base
'250x': '20px',   // 2.5x base
'300x': '24px',   // 3x base
'400x': '32px',   // 4x base
'500x': '40px',   // 5x base
'600x': '48px',   // 6x base
'700x': '56px',   // 7x base
'800x': '64px',   // 8x base
'900x': '72px',   // 9x base
'1000x': '80px',  // 10x base
'max': '100px'    // Maximum spacing
```

### Usage Examples

```typescript
import { getSpacing, useThemedStyles } from '../shared/theme/utils';

const styles = useThemedStyles((tokens) => ({
  container: {
    padding: getSpacing(tokens, '200x'),      // 16px
    marginBottom: getSpacing(tokens, '300x'), // 24px
    gap: getSpacing(tokens, '150x'),          // 12px
  },

  section: {
    paddingHorizontal: getSpacing(tokens, '250x'), // 20px
    paddingVertical: getSpacing(tokens, '400x'),   // 32px
  }
}));
```

## Border System

Consistent border radius and width tokens for UI elements.

### Border Radius

```typescript
'null': '0px',   // No radius
'05x':  '1px',   // Subtle
'1x':   '2px',   // Small
'2x':   '4px',   // Default
'3x':   '6px',   // Medium
'4x':   '8px',   // Large
'5x':   '10px',  // Extra large
'6x':   '12px',  // XXL
'7x':   '14px',  // XXXL
'8x':   '16px',  // Card radius
'9x':   '18px',  // Large card
'10x':  '20px',  // Section radius
'11x':  '22px',  // Large section
'12x':  '24px',  // Maximum
'max':  '100px'  // Circular
```

### Border Width

```typescript
'null':    '0px',  // No border
'regular': '1px',  // Standard
'medium':  '2px',  // Emphasis
'bold':    '3px'   // Strong emphasis
```

### Usage Examples

```typescript
import { getBorderRadius, useThemedStyles } from '../shared/theme/utils';

const styles = useThemedStyles((tokens) => ({
  card: {
    borderRadius: getBorderRadius(tokens, '8x'),     // 16px
    borderWidth: 1,
    borderColor: getColor(tokens, 'neutral.200'),
  },

  button: {
    borderRadius: getBorderRadius(tokens, '4x'),     // 8px
  },

  input: {
    borderRadius: getBorderRadius(tokens, '4x'),     // 8px
    borderWidth: 1,
  }
}));
```

## Semantic Tokens

Semantic tokens provide component-specific values that reference global tokens, making it easy to maintain consistency across similar components.

### Available Semantic Categories

#### Border Radius
- `image`: 12px radius for images
- `cardimage`: 8px radius for card images
- `button`: 8px radius for buttons
- `card`: 16px radius for cards
- `input`: 8px radius for form inputs
- `checkbox`: 4px radius for checkboxes
- `section`: 24px radius for sections
- `pagination`: 1px radius for pagination

#### Spacing Gaps
- `heading_to_paragraph`: 4px gap
- `heading_to_heading`: 8px gap
- `paragraph_to_paragraph`: 2px gap
- `grid`: 12px grid gap
- `button`: 12px button spacing
- `input`: 16px input spacing
- `section`: 20px section spacing
- `max`: 32px maximum gap

#### Component Padding
- `banner`: Consistent banner padding
- `button`: Standard button padding
- `card`: Card content padding
- `input`: Form input padding

### Usage Examples

```typescript
import { getBorderRadius, getSpacing, useThemedStyles } from '../shared/theme/utils';

const styles = useThemedStyles((tokens) => ({
  // Using semantic tokens for consistency
  card: {
    borderRadius: getBorderRadius(tokens, 'semantic.card'),
    padding: getSpacing(tokens, 'semantic.card'),
    gap: getSpacing(tokens, 'grid'),
  },

  button: {
    borderRadius: getBorderRadius(tokens, 'semantic.button'),
    paddingHorizontal: getSpacing(tokens, 'semantic.button'),
  },

  textSection: {
    gap: getSpacing(tokens, 'heading_to_paragraph'),
  }
}));
```

## Utility Functions

The token system provides several utility functions for easy token consumption.

### Color Functions

```typescript
/**
 * Get a color token value
 * @param tokens - Flattened token object
 * @param path - Color path (e.g., 'primary.500', 'neutral.white')
 * @returns Color hex value
 */
getColor(tokens: FlattenedTokens, path: string): string

// Examples
getColor(tokens, 'primary.500')    // "#5439DB"
getColor(tokens, 'neutral.white')  // "#FFFFFF"
getColor(tokens, 'error.600')      // "#C0242C"
```

### Spacing Functions

```typescript
/**
 * Get a spacing token value as a number
 * @param tokens - Flattened token object
 * @param path - Spacing path (e.g., '200x', 'max')
 * @returns Spacing value in pixels as number
 */
getSpacing(tokens: FlattenedTokens, path: string): number

// Examples
getSpacing(tokens, '200x')  // 16
getSpacing(tokens, 'max')   // 100
```

### Border Functions

```typescript
/**
 * Get a border radius token value as a number
 * @param tokens - Flattened token object
 * @param path - Border radius path (e.g., '4x', 'max')
 * @returns Border radius in pixels as number
 */
getBorderRadius(tokens: FlattenedTokens, path: string): number

// Examples
getBorderRadius(tokens, '4x')   // 8
getBorderRadius(tokens, 'max')  // 100
```

### Typography Functions

```typescript
/**
 * Get typography styles with optional italic support
 * @param tokens - Flattened token object
 * @param path - Typography path (e.g., 'h1', 'p1', 'link')
 * @param options - Style options
 * @returns React Native text style object
 */
getTypography(
  tokens: FlattenedTokens,
  path: string,
  options?: { italic?: boolean }
): TextStyle

/**
 * Enhanced typography with multiple style options
 * @param tokens - Flattened token object
 * @param path - Typography path
 * @param styleOptions - Extended style options
 * @returns React Native text style object
 */
getTypographyWithStyle(
  tokens: FlattenedTokens,
  path: string,
  styleOptions?: {
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  }
): TextStyle

// Examples
getTypography(tokens, 'h1')                                    // Standard h1
getTypography(tokens, 'p1', { italic: true })                 // Italic p1
getTypographyWithStyle(tokens, 'p2', {
  italic: true,
  underline: true
})                                                             // Italic underlined p2
```

### Font Family Functions

```typescript
/**
 * Get primary font (Creato Display) with weight and style
 * @param tokens - Flattened token object
 * @param weight - Font weight
 * @param style - Font style (normal/italic)
 * @returns Font family name
 */
getPrimaryFont(
  tokens: FlattenedTokens,
  weight?: 'regular' | 'medium' | 'bold',
  style?: 'normal' | 'italic'
): string

/**
 * Get secondary font (Space Mono)
 * @param tokens - Flattened token object
 * @returns Font family name
 */
getSecondaryFont(tokens: FlattenedTokens): string

// Examples
getPrimaryFont(tokens, 'bold', 'italic')  // "CreatoDisplay-BoldItalic"
getSecondaryFont(tokens)                  // "SpaceMono-Regular"
```

### Theme Hook

```typescript
/**
 * Hook to create themed styles with automatic token resolution
 * @param styleCreator - Function that creates styles using tokens
 * @returns Styled stylesheet
 */
useThemedStyles<T>(styleCreator: (tokens: FlattenedTokens) => T): T

// Example
const styles = useThemedStyles((tokens) => ({
  container: {
    backgroundColor: getColor(tokens, 'primary.50'),
    padding: getSpacing(tokens, '200x'),
    borderRadius: getBorderRadius(tokens, '8x'),
  },
  title: getTypography(tokens, 'h2'),
  description: getTypography(tokens, 'p1'),
}));
```

## Usage Examples

### Basic Component Styling

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { getColor, getSpacing, getTypography, useThemedStyles } from '../shared/theme/utils';

interface CardProps {
  title: string;
  description: string;
  isError?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, description, isError }) => {
  const styles = useThemedStyles((tokens) => ({
    container: {
      backgroundColor: getColor(tokens, isError ? 'error.50' : 'neutral.white'),
      borderColor: getColor(tokens, isError ? 'error.200' : 'neutral.200'),
      borderWidth: 1,
      borderRadius: getBorderRadius(tokens, 'card'),
      padding: getSpacing(tokens, '200x'),
      gap: getSpacing(tokens, 'heading_to_paragraph'),
    },
    title: {
      ...getTypography(tokens, 'h3'),
      color: getColor(tokens, isError ? 'error.800' : 'neutral.900'),
    },
    description: {
      ...getTypography(tokens, 'p1'),
      color: getColor(tokens, 'neutral.600'),
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};
```

### Typography with Style Options

```typescript
import React from 'react';
import { Text } from 'react-native';
import { getColor, getTypographyWithStyle, useThemedStyles } from '../shared/theme/utils';

interface StyledTextProps {
  children: string;
  variant?: 'normal' | 'italic' | 'underlined' | 'strikethrough' | 'emphasized';
}

export const StyledText: React.FC<StyledTextProps> = ({ children, variant = 'normal' }) => {
  const styles = useThemedStyles((tokens) => {
    const baseStyle = {
      color: getColor(tokens, 'neutral.900'),
    };

    switch (variant) {
      case 'italic':
        return {
          ...baseStyle,
          ...getTypographyWithStyle(tokens, 'p1', { italic: true }),
        };

      case 'underlined':
        return {
          ...baseStyle,
          ...getTypographyWithStyle(tokens, 'p1', { underline: true }),
          color: getColor(tokens, 'info.600'),
        };

      case 'strikethrough':
        return {
          ...baseStyle,
          ...getTypographyWithStyle(tokens, 'p1', { strikethrough: true }),
          color: getColor(tokens, 'neutral.500'),
        };

      case 'emphasized':
        return {
          ...baseStyle,
          ...getTypographyWithStyle(tokens, 'p1', {
            italic: true,
            underline: true
          }),
          color: getColor(tokens, 'primary.600'),
        };

      default:
        return {
          ...baseStyle,
          ...getTypography(tokens, 'p1'),
        };
    }
  });

  return <Text style={styles}>{children}</Text>;
};
```

### Form Component

```typescript
import React from 'react';
import { View, TextInput, Text } from 'react-native';
import {
  getColor,
  getSpacing,
  getBorderRadius,
  getTypography,
  useThemedStyles
} from '../shared/theme/utils';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled
}) => {
  const styles = useThemedStyles((tokens) => ({
    container: {
      gap: getSpacing(tokens, '100x'),
    },
    label: {
      ...getTypography(tokens, 'p2'),
      color: getColor(tokens, disabled ? 'neutral.400' : 'neutral.800'),
    },
    input: {
      ...getTypography(tokens, 'p1'),
      borderWidth: 1,
      borderColor: getColor(tokens, error ? 'error.400' : 'neutral.300'),
      borderRadius: getBorderRadius(tokens, 'input'),
      padding: getSpacing(tokens, '150x'),
      backgroundColor: getColor(tokens, disabled ? 'neutral.50' : 'neutral.white'),
      color: getColor(tokens, disabled ? 'neutral.400' : 'neutral.900'),
    },
    error: {
      ...getTypography(tokens, 'p3'),
      color: getColor(tokens, 'error.600'),
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={getColor(tokens, disabled ? 'input_placeholder_disabled' : 'input_placeholder')}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
```

### Button Component with States

```typescript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import {
  getColor,
  getSpacing,
  getBorderRadius,
  getTypography,
  useThemedStyles
} from '../shared/theme/utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled
}) => {
  const styles = useThemedStyles((tokens) => {
    const sizeConfig = {
      small: {
        paddingHorizontal: getSpacing(tokens, '150x'),
        paddingVertical: getSpacing(tokens, '100x'),
        typography: getTypography(tokens, 'p2'),
      },
      medium: {
        paddingHorizontal: getSpacing(tokens, '200x'),
        paddingVertical: getSpacing(tokens, '150x'),
        typography: getTypography(tokens, 'cta'),
      },
      large: {
        paddingHorizontal: getSpacing(tokens, '300x'),
        paddingVertical: getSpacing(tokens, '200x'),
        typography: getTypography(tokens, 'cta'),
      },
    };

    const variantConfig = {
      primary: {
        backgroundColor: getColor(tokens, disabled ? 'neutral.300' : 'primary.500'),
        textColor: getColor(tokens, 'neutral.white'),
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: getColor(tokens, disabled ? 'neutral.100' : 'secondary.500'),
        textColor: getColor(tokens, disabled ? 'neutral.400' : 'neutral.900'),
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: 'transparent',
        textColor: getColor(tokens, disabled ? 'neutral.400' : 'primary.500'),
        borderColor: getColor(tokens, disabled ? 'neutral.300' : 'primary.500'),
      },
    };

    const sizeStyle = sizeConfig[size];
    const variantStyle = variantConfig[variant];

    return {
      container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getBorderRadius(tokens, 'button'),
        borderWidth: variant === 'outline' ? 1 : 0,
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
        paddingHorizontal: sizeStyle.paddingHorizontal,
        paddingVertical: sizeStyle.paddingVertical,
        opacity: disabled ? 0.6 : 1,
      },
      text: {
        ...sizeStyle.typography,
        color: variantStyle.textColor,
      },
    };
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## Best Practices

### 1. Always Use Token Functions

❌ **Don't hardcode values:**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5439DB',
    padding: 16,
    borderRadius: 8,
  }
});
```

✅ **Use token functions:**
```typescript
const styles = useThemedStyles((tokens) => ({
  container: {
    backgroundColor: getColor(tokens, 'primary.500'),
    padding: getSpacing(tokens, '200x'),
    borderRadius: getBorderRadius(tokens, '4x'),
  }
}));
```

### 2. Use Semantic Tokens for Components

❌ **Don't use global tokens directly for components:**
```typescript
borderRadius: getBorderRadius(tokens, '8x') // Hard to maintain
```

✅ **Use semantic tokens:**
```typescript
borderRadius: getBorderRadius(tokens, 'semantic.card') // Self-documenting
```

### 3. Leverage Typography Helpers

❌ **Don't manually construct typography:**
```typescript
text: {
  fontFamily: 'CreatoDisplay-Bold',
  fontSize: 34,
  lineHeight: 40,
  fontWeight: '700',
}
```

✅ **Use typography functions:**
```typescript
text: getTypography(tokens, 'h1')
```

### 4. Handle Italic Fonts Properly

❌ **Don't use fontStyle directly:**
```typescript
text: {
  ...getTypography(tokens, 'p1'),
  fontStyle: 'italic', // Won't work with custom fonts
}
```

✅ **Use typography options:**
```typescript
text: getTypography(tokens, 'p1', { italic: true })
```

### 5. Use Consistent Color Naming

❌ **Don't use arbitrary color references:**
```typescript
color: getColor(tokens, 'neutral.123') // Non-standard shade
```

✅ **Use standard color scale:**
```typescript
color: getColor(tokens, 'neutral.600') // Standard shade
```

### 6. Organize Styles Logically

✅ **Group related styles together:**
```typescript
const styles = useThemedStyles((tokens) => ({
  // Container styles
  container: {
    backgroundColor: getColor(tokens, 'neutral.white'),
    padding: getSpacing(tokens, '200x'),
  },

  // Typography styles
  title: getTypography(tokens, 'h2'),
  subtitle: getTypography(tokens, 'p1'),

  // Interactive styles
  button: {
    backgroundColor: getColor(tokens, 'primary.500'),
    borderRadius: getBorderRadius(tokens, 'button'),
  },
}));
```

### 7. Theme-Aware Development

✅ **Always consider both light and dark themes:**
```typescript
const styles = useThemedStyles((tokens) => ({
  container: {
    // Uses theme-aware text color
    backgroundColor: getColor(tokens, 'text.main'),
    // Uses theme-aware background
    color: getColor(tokens, 'background.main'),
  }
}));
```

### 8. Performance Optimization

✅ **Use useThemedStyles for performance:**
```typescript
// Cached and optimized
const styles = useThemedStyles((tokens) => ({ /* styles */ }));
```

❌ **Don't create styles inline:**
```typescript
// Recreated on every render
<Text style={{
  ...getTypography(tokens, 'p1'),
  color: getColor(tokens, 'neutral.900')
}}>
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Text Decoration Not Showing

**Problem**: Underline or strikethrough not appearing on text.

**Cause**: Using CSS `textDecoration` instead of React Native `textDecorationLine`.

**Solution**: Use the typography functions which handle this automatically:

```typescript
// ✅ Correct - uses textDecorationLine internally
const linkStyle = getTypography(tokens, 'link');

// ✅ Also correct - explicit style options
const strikethroughStyle = getTypographyWithStyle(tokens, 'p1', {
  strikethrough: true
});
```

#### 2. Italic Fonts Not Working

**Problem**: Text appears normal instead of italic.

**Cause**: Using `fontStyle: 'italic'` with custom fonts that require specific font families.

**Solution**: Use typography functions with italic option:

```typescript
// ❌ Won't work with custom fonts
const wrongStyle = {
  ...getTypography(tokens, 'p1'),
  fontStyle: 'italic'
};

// ✅ Automatically switches font family
const correctStyle = getTypography(tokens, 'p1', { italic: true });
```

#### 3. Token Not Found Errors

**Problem**: Error like "Color token not found: color.primary.550"

**Cause**: Using non-existent token path.

**Solution**: Check available tokens and use correct paths:

```typescript
// ❌ Invalid shade
getColor(tokens, 'primary.550') // Error

// ✅ Valid shades
getColor(tokens, 'primary.500') // Correct
getColor(tokens, 'primary.600') // Correct
```

#### 4. Type Errors with useThemedStyles

**Problem**: TypeScript errors when using the hook.

**Solution**: Ensure proper typing:

```typescript
// ✅ Properly typed
const styles = useThemedStyles((tokens) => ({
  container: {
    backgroundColor: getColor(tokens, 'primary.500'),
    padding: getSpacing(tokens, '200x'),
  } as const,
}));
```

#### 5. Theme Not Updating

**Problem**: Components not reflecting theme changes.

**Cause**: Not using the theme context properly.

**Solution**: Ensure ThemeProvider wraps your app and use useThemedStyles:

```typescript
// App.tsx
<ThemeProvider>
  <YourApp />
</ThemeProvider>

// Component
const styles = useThemedStyles((tokens) => ({ /* styles */ }));
```

#### 6. Performance Issues

**Problem**: Sluggish UI with many themed components.

**Cause**: Creating styles inline or not memoizing properly.

**Solution**: Use useThemedStyles and avoid inline styles:

```typescript
// ✅ Memoized and optimized
const styles = useThemedStyles((tokens) => ({
  container: {
    backgroundColor: getColor(tokens, 'primary.500'),
  }
}));

// ❌ Recreated every render
<View style={{
  backgroundColor: getColor(tokens, 'primary.500')
}} />
```

### Debugging Tips

1. **Check Token Paths**: Use console.log to verify token existence:
   ```typescript
   console.log('Available tokens:', Object.keys(tokens));
   ```

2. **Validate Typography Output**: Log typography results:
   ```typescript
   const typo = getTypography(tokens, 'h1');
   console.log('Typography style:', typo);
   ```

3. **Theme Context Issues**: Verify theme provider:
   ```typescript
   const { tokens, theme } = useTheme();
   console.log('Current theme:', theme);
   ```

## Migration Guide

### From Legacy Typography (v1.250927.3.01.xxx)

If you're upgrading from an older version where text decoration and italic fonts weren't working properly:

#### 1. Update Text Decoration Usage

**Before:**
```typescript
// This wouldn't show underlines/strikethrough
const linkStyle = {
  ...getTypography(tokens, 'link'),
  // textDecoration was ignored
};
```

**After:**
```typescript
// Now automatically includes textDecorationLine
const linkStyle = getTypography(tokens, 'link');
// or use explicit options
const customStyle = getTypographyWithStyle(tokens, 'p1', {
  underline: true,
  strikethrough: true
});
```

#### 2. Update Italic Font Usage

**Before:**
```typescript
// This would not switch font families
const italicStyle = {
  ...getTypography(tokens, 'p1'),
  fontStyle: 'italic' // Didn't work with custom fonts
};
```

**After:**
```typescript
// Automatically switches to italic font family
const italicStyle = getTypography(tokens, 'p1', { italic: true });
```

#### 3. Replace Manual Font Switching

**Before:**
```typescript
// Manual font family handling
const getFontWithStyle = (base: string, italic: boolean) => {
  return italic ? base.replace('Regular', 'RegularItalic') : base;
};
```

**After:**
```typescript
// Built-in font family resolution
const fontFamily = getPrimaryFont(tokens, 'regular', 'italic');
// or use typography functions
const style = getTypography(tokens, 'p1', { italic: true });
```

#### 4. Update Component Props

**Before:**
```typescript
interface TextProps {
  style?: TextStyle;
  italic?: boolean;
}

const CustomText = ({ style, italic, children }: TextProps) => (
  <Text style={[
    style,
    italic && { fontStyle: 'italic' } // Didn't work
  ]}>
    {children}
  </Text>
);
```

**After:**
```typescript
interface TextProps {
  typographyToken?: string;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

const CustomText = ({ typographyToken = 'p1', italic, underline, strikethrough, children }: TextProps) => {
  const style = useThemedStyles((tokens) =>
    getTypographyWithStyle(tokens, typographyToken, {
      italic,
      underline,
      strikethrough
    })
  );

  return <Text style={style}>{children}</Text>;
};
```

### Migration Checklist

- [ ] Replace manual `fontStyle: 'italic'` with `getTypography(tokens, path, { italic: true })`
- [ ] Update link components to use `getTypography(tokens, 'link')` for automatic underlines
- [ ] Replace strikethrough implementations with `getTypographyWithStyle` options
- [ ] Remove manual font family switching logic
- [ ] Update components to use new typography helper functions
- [ ] Test text decoration rendering on both iOS and Android
- [ ] Verify italic fonts are displaying correctly
- [ ] Update any custom text components to use new API

### Version History

- **v1.250927.3.02.002**: Added comprehensive typography semantic tokens
- **v1.250927.3.02.001**: Enhanced typography system with style options
- **v1.250927.3.01.xxx**: Fixed text decoration and italic font support
- **v1.250926.5.02.001**: Added version tracking and documentation

---

## Conclusion

This design token system provides a robust foundation for building consistent, themeable React Native applications. By following the patterns and best practices outlined in this documentation, you can create maintainable, scalable user interfaces that automatically adapt to theme changes and provide excellent developer experience.

For questions or improvements to this documentation, please refer to the team's development guidelines or contribute to the token system repository.