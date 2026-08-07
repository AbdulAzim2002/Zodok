import { getProductImageById } from "@/services/productImageService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ImageContentFit, ImageSource, ImageStyle } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { StyleProp } from "react-native";

interface S3ImageProps {
    imageId: string,
    style?: StyleProp<ImageStyle>,
    contentFit?: ImageContentFit,
    alt?: string,
    placeholder?: string | number | ImageSource | string[] | ImageSource[] | null | undefined
}

export const S3Image = ({imageId, style, contentFit, alt, placeholder}: S3ImageProps) => {

    const [url, setUrl] = useState<string|null|undefined>();
    const [retryAttempts, setRetryAttempts] = useState(0);
    const expirationTime = useRef(0);

    const getSignedUrl = async () => {
        try{
            const response = await getProductImageById(imageId);
            if(response.success) {
                expirationTime.current = Date.parse(response.expires_at?response.expires_at:'');
                setUrl(response.image?.signed_url);
                AsyncStorage.setItem(imageId, JSON.stringify({
                    url: response.image?.signed_url,
                    expirationTime: expirationTime.current,
                }));
            } else
                console.error('Error loading signed url:', response.error);
        } catch(error) {
            console.error(error);
        }
        
    }

    const onFailedLoad = () => {
        const currentTime = Date.now();
        if(currentTime > expirationTime.current) {
            setRetryAttempts(0);
            getSignedUrl();
        }
        else {
            if(retryAttempts < 5)
                setRetryAttempts(retryAttempts+1);
        }
    }

    useEffect(()=>{
        const getCachedUrl = async () => {
            try {
                const storedItem = await AsyncStorage.getItem(imageId);
                if (storedItem) {
                    const item = JSON.parse(storedItem);
                    expirationTime.current = item.expirationTime;
                    setUrl(item.url);
                } else
                    getSignedUrl();
            } catch (error) {
                console.error('Error retrieving imageUrl from cache:', error);
            } 
        }
        getCachedUrl();
    }, []);

    return(
        <Image
            key={`${imageId}-${retryAttempts}`}
            style={style}
            contentFit={contentFit}
            source={url}
            onError={onFailedLoad}
            alt={alt}
            placeholder={placeholder}
            placeholderContentFit='cover'
        />
    );
}