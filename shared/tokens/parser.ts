import { TokenTree, DesignToken } from './types';
import globalTokens from './global.json';
import semanticTokens from './semantic.json';
import lightTokens from './light.json';
import darkTokens from './dark.json';

// Type for the flattened token structure
export type FlattenedTokens = Record<string, string | number | object>;

/**
 * Resolves token references in the format {token.path}
 */
function resolveTokenReference(
  reference: string,
  tokenTree: TokenTree
): string | number | object {
  // If it's not a reference, return the value as is
  if (!reference.startsWith('{') || !reference.endsWith('}')) {
    return reference;
  }

  // Extract the path from the reference
  const path = reference.slice(1, -1).split('.');
  
  // Navigate through the token tree to find the referenced token
  let current: any = tokenTree;
  for (const segment of path) {
    if (!current[segment]) {
      throw new Error(`Token reference not found: ${reference}`);
    }
    current = current[segment];
  }

  // If the value is another reference, resolve it recursively
  if (
    typeof current.value === 'string' &&
    current.value.startsWith('{') &&
    current.value.endsWith('}')
  ) {
    return resolveTokenReference(current.value, tokenTree);
  }

  return current.value;
}

/**
 * Flattens a token tree into a flat structure with fully resolved values
 */
function flattenTokens(
  tree: TokenTree,
  prefix = '',
  result: FlattenedTokens = {},
  allTokens: TokenTree
): FlattenedTokens {
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;

    // If it's a token with a value property
    if ('value' in value && 'type' in value) {
      const token = value as DesignToken;
      
      // Resolve any references in the token value
      if (typeof token.value === 'string') {
        result[path] = resolveTokenReference(token.value, allTokens);
      } else if (typeof token.value === 'object') {
        // For complex tokens like typography, resolve each property
        const resolvedValue: Record<string, any> = {};
        for (const [propKey, propValue] of Object.entries(token.value)) {
          if (typeof propValue === 'string') {
            resolvedValue[propKey] = resolveTokenReference(propValue, allTokens);
          } else {
            resolvedValue[propKey] = propValue;
          }
        }
        result[path] = resolvedValue;
      } else {
        result[path] = token.value;
      }
    } else {
      // It's a nested object, recurse
      flattenTokens(value as TokenTree, path, result, allTokens);
    }
  }

  return result;
}

/**
 * Merges multiple token trees into a single tree
 */
function mergeTokenTrees(...trees: TokenTree[]): TokenTree {
  return trees.reduce((merged, tree) => {
    return deepMerge(merged, tree);
  }, {} as TokenTree);
}

/**
 * Deep merges two objects
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };

  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Generates a complete set of tokens for a specific theme
 */
export function generateTokens(theme: 'light' | 'dark'): FlattenedTokens {
  // Merge the token trees in the correct order of precedence
  const themeTokens = theme === 'light' ? lightTokens : darkTokens;
  const allTokens = mergeTokenTrees(
    globalTokens as TokenTree,
    semanticTokens as TokenTree,
    themeTokens as TokenTree
  );

  // Flatten and resolve all token references
  return flattenTokens(allTokens, '', {}, allTokens);
}

// Pre-generate tokens for both themes
export const lightThemeTokens = generateTokens('light');
export const darkThemeTokens = generateTokens('dark');
