import {
  getBorderRadius,
  getColor,
  getPrimaryFont,
  getSpacing,
  useThemedStyles,
} from '@/shared';
import { SpeedIcon, WishlistFill, WishlistLine } from '@assets/svg/NavBarIcons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
  View
} from 'react-native';
import { S3Image } from '../S3Image';

export interface ProductCardProps extends Omit<TouchableOpacityProps, 'children'> {
  imageUrl: string;
  productName: string;
  originalPrice: number;
  discountedPrice?: number;
  brandName?: string;
  deliveryTime?: string;
  isWishlisted?: boolean;
  onWishlistPress?: () => void;
  onShowOptionsPress?: () => void;
  slug: string;
}

export const S3ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  productName,
  originalPrice,
  discountedPrice,
  brandName,
  deliveryTime,
  isWishlisted = false,
  onWishlistPress,
  onShowOptionsPress,
  slug,
  style,
  ...props
}) => {
  // Calculate discount percentage only if discounted price exists
  const hasDiscount = discountedPrice !== undefined && discountedPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const { width: screenWidth } = useWindowDimensions();

  // Card width = (screenWidth - 32px) / 2.5, max 180px for wide screens
  const cardWidth = Math.min((screenWidth - 32) / 2.5, 180);

  useEffect(() => {
    setWishlisted(isWishlisted);
  }, [isWishlisted]);

  const handleWishlistPress = () => {
    setWishlisted(!wishlisted);
    onWishlistPress?.();
  };

  const styles = useThemedStyles((tokens) => ({
    container: {
      width: cardWidth,
      // backgroundColor: "red",
      gap: 8,
    },
    imageContainer: {
      aspectRatio: 3 / 4,
      borderRadius: 8,
      overflow: 'hidden',
      // backgroundColor: "red",
    },
    image: {
      width: '100%',
      height: '100%',
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
      bottom: 36,
      right: 4,
      width: 30,
      height: 30,
      borderRadius: 18,
      backgroundColor: getColor(tokens, 'bg.screen'),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: getColor(tokens, 'neutral.400'),
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
      backgroundColor: getColor(tokens, 'bg.screen'),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: getColor(tokens, 'neutral.50'),
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    showOptionsText: {
      fontFamily: getPrimaryFont(tokens, 'regular'),
      fontSize: 12,
      color: getColor(tokens, 'text.main'),
    },
    content: {
      paddingHorizontal: getSpacing(tokens, 'gap.minigrid'),
      gap: 4,
    },
    brandChip: {
      alignSelf: 'flex-start',
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: getBorderRadius(tokens, '2x'),
    },
    brandText: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 10,
      color: getColor(tokens, 'text.main'),
    },
    productName: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 14,
      color: getColor(tokens, 'text.main'),
      // lineHeight: 22,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      // flexWrap: 'wrap',
    },
    mainPrice: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 12,
      color: getColor(tokens, 'text.main'),
    },
    strikethroughPrice: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 10,
      color: getColor(tokens, 'text.suggestion'),
      textDecorationLine: 'line-through',
    },
    discountBadge: {
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: getBorderRadius(tokens, '2x'),
    },
    discountText: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 10,
      color: getColor(tokens, 'icon.success'),
    },
    deliveryBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: getBorderRadius(tokens, '2x'),
      marginTop: 4,
    },
    deliveryText: {
      fontFamily: getPrimaryFont(tokens, 'medium'),
      fontSize: 10,
      color: getColor(tokens, 'secondary.900'),
    },
  }));

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  return (
    <Link
      href={{
        pathname: '/product/[product]',
        params: {
          product: slug,
        }
      }}
    >
      <View
        style={[styles.container, style]}
        activeOpacity={0.9}
        {...props}
      >
        {/* Image Container with 3:4 ratio */}
        <View style={styles.imageContainer}>
          <S3Image imageId={imageUrl} style={styles.image} contentFit='cover' />

          {/* Top gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(147, 147, 159, 0.3)']}
            style={styles.imageGradient}
          />

          {/* Wishlist Button */}
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistPress}
            activeOpacity={0.7}
          >
            {wishlisted ? (
              <WishlistFill width={16} height={14} style={styles.wishlistIcon} />
            ) : (
              <WishlistLine width={16} height={14} style={styles.wishlistIcon} />
            )}
          </TouchableOpacity>

          {/* Show Options Bar */}
          <TouchableOpacity
            style={styles.showOptionsBar}
            onPress={onShowOptionsPress}
            activeOpacity={0.7}
          >
            <Text style={styles.showOptionsText}>Show Options</Text>
            <Ionicons name="chevron-down" size={14} color="#18181B" style={{ marginTop:1 }}/>
          </TouchableOpacity>
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
                <Text style={styles.discountText}>{discountPercentage}% Off</Text>
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
      </View>
    </Link>
    
  );
};
