// Product Image interface
export interface ProductImage {
    id: string;
    product_color_id: string;
    image_url: string;
    thumbnail_url: string | null;
    alt_text: string | null;
    image_type: string;
    sort_order: number;
    is_primary: boolean;
    signed_url: string | null;
}
// Single image response
export interface SingleImageResponse {
    success: boolean;
    image?: ProductImage;
    expires_at?: string;
    expires_in_seconds?: number;
    error?: string;
}
// Batch images response
export interface BatchImagesResponse {
    success: boolean;
    images?: ProductImage[];
    count?: number;
    expires_at?: string;
    expires_in_seconds?: number;
    error?: string;
}