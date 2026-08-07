import SignOutButton from '@/components/sign-out-button';
import SimpleCarousel from '@/components/Zodok/Carousel/Carousel';
import { Ionicons } from '@expo/vector-icons';
// import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

//---------------------------------Test elments. To be removed---------------------------------

const Red = ({title}: {title: string}) => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'red'}}>
            <Text>{title}</Text>
        </View>
    )
}
const Orange = () => {
    const styles = StyleSheet.create({
        
        legend: {
            fontFamily: "CreatoDisplay",
        }
    });
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'orange'}}>
            <Text style = {styles.legend} >Creato Display</Text>
        </View>
    )
}
const Yellow = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'yellow'}}></View>
    )
}
const Green = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'green'}}></View>
    )
}
const Blue = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'blue'}}></View>
    )
}
const Indigo = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'indiogo'}}></View>
    )
}
const Violet = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'violet'}}></View>
    )
}
const Purpel = () => {
    return (
        <View style={{height: 250, width: '100%', backgroundColor: 'purpel'}}></View>
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
    SimpleCarousel: SimpleCarousel,
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
        type: "Orange",
    },
    {
        type: 'SimpleCarousel',
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

const navIcons: NavIconInterface[]= [
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
        <View style={{height: '100%', width: '100%'}}>
            {/* 
            <AnimatedLottieView 
            ref={animationRef}
            style={{height: '50%', width: '100%'}} 
            source={require('../../assets/images/GlassCard.json')} 
            // cacheComposition={true}
            // progress={Animated.Value}
            loop={false}
            autoPlay={false}
            // speed={-1}
            progress={animationProgress}
            />
            <View style={{height: 20}}></View>
            <Button
            onPress={()=>{console.log("forward"), playForward()}}
            title="Forward"
            color="#841584"
            />
            <View style={{height: 20}}></View>
            <Button
            onPress={()=>{console.log("backward"), playBackward()}}
            title="Backward"
            color="#845415ff"
            /> 
            */}
            <SignOutButton/>
            <ScrollView style={{width: '100%', backgroundColor: 'darkgrey'}}>
                {
                    sections.map((section, index) => {
                        const Section = components[section.type];
                        if(!Section)
                            console.error(`Component '${section.type}' not found. Add '${section.type}' in 'components' object present in app/(home)/index.tsx`);
                            
                        return (
                            Section ?
                            <Section
                                key={index}
                                {...section.props}
                            /> :
                            <View key={index}></View>
                        )
                    })
                }
                <View style={styles.footer}><Text style={{fontSize: 46, fontWeight: 700}}>The End</Text></View>
            </ScrollView>
            {/* <View style={styles.navigationBar}>
                {
                    navIcons.map((icon, index) => (
                        <NavIcon 
                            key={index}
                            title={icon.title}
                            iconName={icon.iconName}
                        />
                    ))
                }
            </View> */}
        </View>
    )
}