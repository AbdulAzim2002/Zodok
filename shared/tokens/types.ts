export interface TokenValue {
  value: string | number | object;
  type: string;
}

export interface ColorToken {
  value: string;
  type: 'color';
}

export interface SpacingToken {
  value: string;
  type: 'spacing';
}

export interface FontSizeToken {
  value: string;
  type: 'fontSizes';
}

export interface FontWeightToken {
  value: string;
  type: 'fontWeights';
}

export interface FontFamilyToken {
  value: string;
  type: 'fontFamilies';
}

export interface BorderRadiusToken {
  value: string;
  type: 'borderRadius';
}

export interface BorderWidthToken {
  value: string;
  type: 'borderWidth';
}

export interface TypographyToken {
  value: {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing?: string;
  };
  type: 'typography';
}

export interface SizingToken {
  value: string;
  type: 'sizing';
}

export type DesignToken = 
  | ColorToken 
  | SpacingToken 
  | FontSizeToken 
  | FontWeightToken 
  | FontFamilyToken 
  | BorderRadiusToken 
  | BorderWidthToken 
  | TypographyToken
  | SizingToken;

export interface TokenTree {
  [key: string]: TokenTree | DesignToken;
}
