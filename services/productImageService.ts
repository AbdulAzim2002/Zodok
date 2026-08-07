import { SUPABASE_CONFIG, getEdgeFunctionUrl } from '@/config/supabase';
import {
    BatchImagesResponse,
    SingleImageResponse
} from '@/types/productImages';

const ENDPOINT = getEdgeFunctionUrl(
    SUPABASE_CONFIG.edgeFunctions.getProductImageUrl
);

/**
* Fetch a single product image by ID
*/

export async function getProductImageById(
    imageId: string
): Promise<SingleImageResponse> {
    try {
        const url = `${ENDPOINT}?id=${encodeURIComponent(imageId)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data: SingleImageResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch image');
        }

        return data;
    } catch (error) {
        console.error('Error fetching product image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
* Fetch all images for a product color
*/
export async function getProductImagesByColorId(
    productColorId: string
): Promise<BatchImagesResponse> {
    try {
        const url = `${ENDPOINT}?product_color_id=${encodeURIComponent(productColorId)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data: BatchImagesResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch images');
        }

        return data;
    } catch (error) {
        console.error('Error fetching product images:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}