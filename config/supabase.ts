// Supabase Configuration
export const SUPABASE_CONFIG = {
        url: 'https://sbzvbinzwwibknbcwrlh.supabase.co/',
        edgeFunctions: {
        getProductImageUrl: '/functions/v1/get-product-image-url',
    },
};

// Full URL helper
export const getEdgeFunctionUrl = (functionPath: string): string => {
    return `${SUPABASE_CONFIG.url}${functionPath}`;
}