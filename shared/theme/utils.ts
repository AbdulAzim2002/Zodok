import { StyleSheet } from 'react-native';
import { FlattenedTokens } from '../tokens/parser';
import { useTheme } from './ThemeProvider';

/**
 * Converts pixel values to numbers for React Native
 */
export function pxToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseInt(value.replace('px', ''), 10);
}

/**
 * Helper to get a color token value
 */
export function getColor(tokens: FlattenedTokens, path: string): string {
  const value = tokens[`color.${path}`];
  if (typeof value !== 'string') {
    throw new Error(`Color token not found or invalid: color.${path}`);
  }
  return value;
}

/**
 * Helper to get a spacing token value as a number
 */
export function getSpacing(tokens: FlattenedTokens, path: string): number {
  const value = tokens[`space.${path}`];
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Spacing token not found or invalid: space.${path}`);
  }
  return typeof value === 'string' ? pxToNumber(value) : value;
}

/**
 * Helper to get a border radius token value as a number
 */
export function getBorderRadius(tokens: FlattenedTokens, path: string): number {
  const value = tokens[`border.radius.${path}`];
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Border radius token not found or invalid: border.radius.${path}`);
  }
  return typeof value === 'string' ? pxToNumber(value) : value;
}

/**
 * Resolves font family based on family, weight, and style
 */
export function resolveFontFamily(
  tokens: FlattenedTokens,
  family: 'creato' | 'mono' = 'creato',
  weight: 'regular' | 'medium' | 'bold' = 'regular',
  style: 'normal' | 'italic' = 'normal'
): string {
  const path = `font.family.${family}.${weight}.${style}`;
  const fontFamily = tokens[path];

  if (typeof fontFamily !== 'string') {
    // Fallback to normal style if italic not available
    if (style === 'italic') {
      const fallbackPath = `font.family.${family}.${weight}.normal`;
      const fallback = tokens[fallbackPath];
      if (typeof fallback === 'string') {
        console.warn(`Italic font not available for ${family}-${weight}, falling back to normal`);
        return fallback;
      }
    }
    throw new Error(`Font family not found: ${path}`);
  }

  return fontFamily;
}

/**
 * Helper to get primary font (Creato Display) with specific weight and style
 */
export function getPrimaryFont(
  tokens: FlattenedTokens,
  weight: 'regular' | 'medium' | 'bold' = 'regular',
  style: 'normal' | 'italic' = 'normal'
): string {
  return resolveFontFamily(tokens, 'creato', weight, style);
}

/**
 * Helper to get secondary font (Space Mono)
 */
export function getSecondaryFont(tokens: FlattenedTokens): string {
  return resolveFontFamily(tokens, 'mono', 'regular', 'normal');
}

/**
 * Helper to get font family from semantic tokens
 * Maps semantic font weights to the appropriate Creato Display font family
 * @deprecated Use resolveFontFamily, getPrimaryFont, or getSecondaryFont instead
 */
export function getFontFamily(weight: 'regular' | 'medium' | 'bold' = 'regular', italic: boolean = false): string {
  const fontPrefix = 'CreatoDisplay';
  const fontWeight = weight.charAt(0).toUpperCase() + weight.slice(1);
  const fontStyle = italic ? 'Italic' : '';

  return `${fontPrefix}-${fontWeight}${fontStyle}`;
}

/**
 * Helper to get font face from semantic tokens
 * Maps semantic font weights to the appropriate Creato Display font family
 */
export function getTypeFace(tokens: FlattenedTokens, path: string): string {
  const value = tokens[`font.family.${path}`];
  if (typeof value !== 'string') {
    throw new Error(`TypeFace token not found or invalid: font.family.${path}`);
  }
  return value;
}

/**
 * Helper to get a typography token and convert it to React Native style
 */
export function getTypography(tokens: FlattenedTokens, path: string, options?: { italic?: boolean }): {
  fontFamily: string;
  fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textDecorationLine?: "none" | "underline" | "line-through" | "underline line-through";
  fontStyle?: "normal" | "italic";
} {
  const value = tokens[`font.style.${path}`];
  if (typeof value !== 'object' || value === null) {
    throw new Error(`Typography token not found or invalid: font.style.${path}`);
  }

  const typographyValue = value as any;

  // Convert fontWeight token reference to actual value
  let fontWeight = typographyValue.fontWeight;
  if (typeof fontWeight === 'string' && fontWeight.startsWith('{') && fontWeight.endsWith('}')) {
    const weightPath = fontWeight.slice(1, -1); // Remove { and }
    fontWeight = tokens[weightPath];
  }

  // Convert to React Native compatible font weight
  const weightMap: { [key: string]: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" } = {
    '100': '100',
    '200': '200',
    '300': '300',
    '400': '400',
    'normal': '400',
    'regular': '400',
    '500': '500',
    'medium': '500',
    '600': '600',
    'semibold': '600',
    '700': '700',
    'bold': '700',
    '800': '800',
    '900': '900',
  };

  // Handle fontFamily and italic font switching
  let fontFamily = typographyValue.fontFamily;
  let fontStyle: "normal" | "italic" | undefined;

  // Resolve font family token reference if needed
  if (typeof fontFamily === 'string' && fontFamily.startsWith('{') && fontFamily.endsWith('}')) {
    const familyPath = fontFamily.slice(1, -1); // Remove { and }
    fontFamily = tokens[familyPath];
  }

  // Handle italic font family switching if requested
  if (options?.italic) {
    fontStyle = 'italic';

    // Try to find the italic variant of the font family
    // Parse the font family token path to switch from normal to italic
    const originalFamilyPath = typographyValue.fontFamily;
    if (typeof originalFamilyPath === 'string' && originalFamilyPath.startsWith('{') && originalFamilyPath.endsWith('}')) {
      const familyPath = originalFamilyPath.slice(1, -1); // Remove { and }

      // Replace .normal with .italic in the path
      if (familyPath.includes('.normal')) {
        const italicPath = familyPath.replace('.normal', '.italic');
        const italicFamily = tokens[italicPath];

        if (typeof italicFamily === 'string') {
          fontFamily = italicFamily;
        } else {
          // If italic variant doesn't exist, keep the normal font and use fontStyle
          console.warn(`Italic variant not found for ${familyPath}, using fontStyle instead`);
        }
      }
    }
  }

  // Handle textDecoration token reference and convert to React Native textDecorationLine
  let textDecorationLine: "none" | "underline" | "line-through" | "underline line-through" | undefined;
  if (typographyValue.textDecoration) {
    let textDecoration = typographyValue.textDecoration;

    // Resolve token reference if needed
    if (typeof textDecoration === 'string' && textDecoration.startsWith('{') && textDecoration.endsWith('}')) {
      const decorationPath = textDecoration.slice(1, -1); // Remove { and }
      textDecoration = tokens[decorationPath];
    }

    // Map CSS textDecoration values to React Native textDecorationLine
    const decorationMap: { [key: string]: "none" | "underline" | "line-through" | "underline line-through" } = {
      'none': 'none',
      'underline': 'underline',
      'line-through': 'line-through',
      'strikethrough': 'line-through', // Alternative mapping
      'underline line-through': 'underline line-through',
    };

    textDecorationLine = decorationMap[String(textDecoration).toLowerCase()] || 'none';
  }

  return {
    fontFamily,
    fontWeight: weightMap[String(fontWeight).toLowerCase()] || '400',
    fontSize: pxToNumber(typographyValue.fontSize),
    lineHeight: pxToNumber(typographyValue.lineHeight),
    ...(typographyValue.letterSpacing && {
      letterSpacing: pxToNumber(typographyValue.letterSpacing),
    }),
    ...(textDecorationLine && textDecorationLine !== 'none' && {
      textDecorationLine,
    }),
    ...(fontStyle && {
      fontStyle,
    }),
  };
}

/**
 * Convenience helper to get typography with style options
 * This provides a cleaner API for applying font styles like italic
 */
export function getTypographyWithStyle(
  tokens: FlattenedTokens,
  path: string,
  styleOptions?: {
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  }
): {
  fontFamily: string;
  fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textDecorationLine?: "none" | "underline" | "line-through" | "underline line-through";
  fontStyle?: "normal" | "italic";
} {
  // Get base typography
  const baseStyle = getTypography(tokens, path, { italic: styleOptions?.italic });

  // Handle additional text decoration options
  let textDecorationLine: "none" | "underline" | "line-through" | "underline line-through" | undefined;

  if (styleOptions?.underline && styleOptions?.strikethrough) {
    textDecorationLine = 'underline line-through';
  } else if (styleOptions?.underline) {
    textDecorationLine = 'underline';
  } else if (styleOptions?.strikethrough) {
    textDecorationLine = 'line-through';
  }

  return {
    ...baseStyle,
    ...(textDecorationLine && {
      textDecorationLine,
    }),
  };
}

/**
 * Hook to create themed styles
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (tokens: FlattenedTokens) => T
): T {
  const { tokens } = useTheme();
  return StyleSheet.create(styleCreator(tokens));
}

export * from './ThemeProvider';

