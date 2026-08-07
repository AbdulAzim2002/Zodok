import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { SpeedIcon, WishlistFill, WishlistLine } from '@assets/svg/NavBarIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
  View
} from 'react-native';

export interface ProductCardProps extends Omit<TouchableOpacityProps, 'children'> {
  productId: string,
  imageUrl: string;
  productName: string;
  originalPrice: number;
  discountedPrice?: number;
  brandName?: string;
  deliveryTime?: string;
  isWishlisted?: boolean;
  onWishlistPress?: () => Promise<void>;
  onShowOptionsPress?: () => void;
  cardWidth?: number,
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  imageUrl,
  productName,
  originalPrice,
  discountedPrice,
  brandName,
  deliveryTime,
  isWishlisted = false,
  onWishlistPress,
  onShowOptionsPress,
  style,
  cardWidth,
  ...props
}) => {
  // Calculate discount percentage only if discounted price exists
  const hasDiscount = discountedPrice !== undefined && discountedPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [disabled, setDisabled] = useState<boolean>();
  const { width: screenWidth } = useWindowDimensions();

  // Card width = (screenWidth - 32px) / 2.5, max 180px for wide screens
  // const cardWidth = Math.min((screenWidth - 32) / 2.5, 180);

  const {profile, updateWishlist} = useAuthContext();

  useEffect(() => {
    setWishlisted(isWishlisted);
  }, [isWishlisted]);

  const addToWishlist = async (user_id: string, product_id:string) => {
    const { error } = await supabase
    .from('wishlist')
    .insert({ user_id, product_id});

    if(error) {
      console.log(error);
      setWishlisted(false);
    } else
      updateWishlist(user_id);
  }

  const removeFromWishlist = async(user_id: string, product_id:string) => {
    console.log('removing from wishlist')
    const response = await supabase
      .from('wishlist')
      .delete()
      .eq('product_id', product_id)
      .eq('user_id', user_id);
      if(response.error) {
        console.log(response.error);
        setWishlisted(true);
      } else
        updateWishlist(user_id)
  }

  const handleWishlistPress = async () => {
    setDisabled(true);
    if(wishlisted)
      await removeFromWishlist(profile.user.id, productId);
    else
      await addToWishlist(profile.user.id, productId);
    setWishlisted(!wishlisted);
    setDisabled(false);
  };

  const styles = StyleSheet.create({
    container: {
      width: cardWidth,
      gap: 8,
    },
    imageContainer: {
      aspectRatio: 3 / 4,
      borderRadius: 8,
      overflow: 'hidden',
      width: cardWidth,
      // backgroundColor: "red",
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      // backgroundColor: "red",
    },
    imageGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
    },
    wishlistButton: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 30,
      height: 30,
      borderRadius: 18,
      backgroundColor: "#fff",
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#93939F",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    wishlistIcon: {
      marginTop: 2,
    },
    showOptionsBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 32,
      backgroundColor: "#0C0C0D",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#F1F1F3",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    showOptionsText: {
      fontFamily: "CreatoDisplay",
      fontSize: 12,
      color: "#EEEBFB",
    },
    content: {
      paddingHorizontal: 8,
      gap: 8,
    },
    brandChip: {
      alignSelf: 'flex-start',
      backgroundColor: "#18181B",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    brandText: {
      fontFamily: "CreatoDisplayBold",
      fontSize: 10,
      color: "#EEEBFB",
    },
    productName: {
      fontFamily: "CreatoDisplayMedium",
      fontSize: 16,
      color:'#18181b',
      // lineHeight: 22,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      flexWrap: 'wrap',
    },
    mainPrice: {
      fontFamily: "CreatoDisplay",
      fontSize: 16,
      color: "#18181b",
    },
    strikethroughPrice: {
      fontFamily: "CreatoDisplay",
      fontSize: 12,
      color: "#93939f",
      textDecorationLine: 'line-through',
    },
    discountBadge: {
      backgroundColor: "#18181B",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    discountText: {
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "CreatoDisplayMedium",
      fontSize: 12,
      color: "#18181b",
    },
    deliveryBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginTop: 4,
    },
    deliveryText: {
      fontFamily: "CreatoDisplayBold",
      fontSize: 10,
      color: "#332933",
    },
  });

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      {...props}
    >
      {/* Image Container with 3:4 ratio */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Top gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(147, 147, 159, 0.3)']}
          style={styles.imageGradient}
        />

        {/* Wishlist Button */}
        <Pressable
          style={(state)=>([styles.wishlistButton, {opacity: state.pressed ? 0.7 : 1}])}
          onPress={handleWishlistPress}
          disabled={disabled}
        >
          {wishlisted ? (
            <WishlistFill width={16} height={14} style={styles.wishlistIcon} />
          ) : (
            <WishlistLine width={16} height={14} style={styles.wishlistIcon} />
          )}
        </Pressable>

        {/* Show Options Bar */}
        {/* <TouchableOpacity
          style={styles.showOptionsBar}
          onPress={onShowOptionsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.showOptionsText}>Show Options</Text>
          <Ionicons name="chevron-down" size={14} color="#18181B" style={{ marginTop:1 }}/>
        </TouchableOpacity> */}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Brand Chip - Optional */}
        {brandName && (
          <View style={styles.brandChip}>
            <Text style={styles.brandText}>{brandName}</Text>
          </View>
        )}

        {/* Product Name */}
        <Text
          style={styles.productName}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {productName}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          {hasDiscount ? (
            <>
              <Text style={styles.mainPrice}>₹{formatPrice(discountedPrice)}</Text>
              <Text style={styles.strikethroughPrice}>₹{formatPrice(originalPrice)}</Text>
              <LinearGradient colors={['#eeebfb', '#f1f1f3']} start={{x: 0, y: 0.5}} end={{x: 1, y:0.5}} style={{borderRadius: 4}}>
                <Text style={styles.discountText}>{discountPercentage}% Off</Text>
              </LinearGradient>
            </>
          ) : (
            <Text style={styles.mainPrice}>₹{formatPrice(originalPrice)}</Text>
          )}
        </View>

        {/* Delivery Badge */}
        {deliveryTime && (
          <LinearGradient
            colors={['#ffccff', '#fff5ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.deliveryBadge}
          >
            <SpeedIcon width={8} height={12} />
            <Text style={styles.deliveryText}>{deliveryTime} Delivery</Text>
          </LinearGradient>
        )}
      </View>
    </TouchableOpacity>
  );
};
