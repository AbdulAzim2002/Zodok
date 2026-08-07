import SignOutButton from '@/components/sign-out-button';
import { Ionicons } from '@expo/vector-icons';
// import LottieView from 'lottie-react-native';
import { Carousel, ProductCard, ThemeToggle } from '@/components';
import { useRef, useState } from 'react';
import { Animated, Button, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

//---------------------------------Test elments. To be removed---------------------------------

const Red = ({ title }: { title: string }) => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'red' }}>
            <Text>{title}</Text>
        </View>
    )
}
const Orange = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'orange' }}></View>
    )
}
const Yellow = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'yellow' }}></View>
    )
}
const Green = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'green' }}></View>
    )
}
const Blue = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'blue' }}></View>
    )
}
const Indigo = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'indiogo' }}></View>
    )
}
const Violet = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'violet' }}></View>
    )
}
const Purpel = () => {
    return (
        <View style={{ height: 250, width: '100%', backgroundColor: 'purpel' }}></View>
    )
}

//---------------------------------Test elments. To be removed---------------------------------

//Components of the sections. To add a new component, add a property having component value set to it
type Components = Record<string, React.FC<any>>;

const components: Components = {
    Red: Red,
    Orange: Orange,
    Yellow: Yellow,
    Green: Green,
    Blue: Blue,
    Indigo: Indigo,
    Purpel: Purpel,
    Carousel: Carousel,
};

type Component = {
    type: string;
    props?: any;
}

const sections: Component[] = [
    {
        type: 'Red',
        props: {
            title: "I am Red!!!"
        }
    },
    {
        type: 'Carousel',
    },
    {
        type: 'Blue',
    },
    {
        type: 'Green',
    },
    {
        type: 'Red',
        props: {
            title: "Another Red"
        }
    },
];

interface NavIconInterface {
    title: string,
    iconName: 'home-outline' | 'grid-outline' | 'search-outline' | 'cut-outline' | 'heart-outline',
}

const navIcons: NavIconInterface[] = [
    {
        title: 'Home',
        iconName: 'home-outline',
    },
    {
        title: 'Category',
        iconName: 'grid-outline',
    },
    {
        title: 'Explore',
        iconName: 'search-outline',
    },
    {
        title: 'Dar-Z',
        iconName: 'cut-outline',
    },
    {
        title: 'Whishlist',
        iconName: 'heart-outline',
    },
]

export default function Home() {
    const styles = StyleSheet.create({
        navigationBar: {
            position: 'absolute',
            bottom: 0,
            height: 80,
            width: '100%',
            borderWidth: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 10,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        navIcon: {
            height: 50,
            width: 50,
            alignItems: 'center',
        },
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        footer: {
            height: 150,
            width: '100%',
            alignItems: 'center',
        }
    })
    function NavIcon(NavIconProps: NavIconInterface) {
        return (
            <View style={styles.navIcon}>
                <Ionicons name={NavIconProps.iconName} size={40}></Ionicons>
                <Text>{NavIconProps.title}</Text>
            </View>
        )
    }

    // const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

    // const animationRef = useRef<LottieView>(null);
    const animationProgress = useRef<Animated.Value>(new Animated.Value(0)).current;
    const [speed, setSpeed] = useState<number>(0);

    const playForward = () => {
        // Will change progress value to 1 in 5 seconds
        Animated.timing(animationProgress, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        }).start();
    };

    const playBackward = () => {
        // Will change progress value to 0 in 3 seconds
        Animated.timing(animationProgress, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: false,
        }).start();
    };
    return (
        <View style={{ height: '100%', width: '100%' }}>
            {/* <AnimatedLottieView 
                ref={animationRef}
                style={{height: '50%', width: '100%'}} 
                source={require('../../assets/images/GlassCard.json')} 
                // cacheComposition={true}
                // progress={Animated.Value}
                loop={false}
                autoPlay={false}
                // speed={-1}
                progress={animationProgress}
            /> */}
            <View style={{ height: 20 }}></View>
            <Button
                onPress={() => { console.log("forward"), playForward() }}
                title="Forward"
                color="#841584"
            />

            <ThemeToggle />
            <Carousel gap={8}>
                <ProductCard
                    imageUrl="https://cdn.shopify.com/s/files/1/0719/2326/9868/files/meesho_1_b8bb34de-ac5f-465f-891e-77b7b6bc4a1d.webp?v=1767134802"
                    brandName="Burger Bae"
                    productName="Red Floral Dress"
                    originalPrice={899}
                    discountedPrice={499}
                    deliveryTime="60 Mins"
                    isWishlisted={false}
                    onWishlistPress={() => console.log('Wishlist pressed')}
                    onShowOptionsPress={() => console.log('Show options pressed')}
                    onPress={() => console.log('Card pressed')}
                />
                <ProductCard
                    imageUrl="https://cdn.shopify.com/s/files/1/0719/2326/9868/files/meesho_2_f6744d9d-7485-4137-8313-75b46b1d45df.webp?v=1767134093"
                    brandName="Burger Bae"
                    productName="Red Floral Dress"
                    originalPrice={3999}
                    discountedPrice={1999}
                    deliveryTime="60 Mins"
                    isWishlisted={false}
                    onWishlistPress={() => console.log('Wishlist pressed')}
                    onShowOptionsPress={() => console.log('Show options pressed')}
                    onPress={() => console.log('Card pressed')}
                />
                <ProductCard
                    imageUrl="https://cdn.shopify.com/s/files/1/0719/2326/9868/files/meesho_1.webp?v=1767026597"
                    productName="Red Floral Dress (No Brand, No Discount)"
                    originalPrice={3999}
                    isWishlisted={false}
                    onWishlistPress={() => console.log('Wishlist pressed')}
                    onShowOptionsPress={() => console.log('Show options pressed')}
                    onPress={() => console.log('Card pressed')}
                />
            </Carousel>
            <View style={{ height: 20 }}></View>
            <Button
                onPress={() => { console.log("backward"), playBackward() }}
                title="Backward"
                color="#845415ff"
            />

            <SignOutButton />
        </View>
    )
}