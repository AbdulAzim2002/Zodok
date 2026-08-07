import { useStateContext } from '@/hooks/use-state-context';
import { Button } from '@zodok/components';
import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define onboarding content
const onboardingScreens = [
  {
    id: '1',
    title: 'Try First, Pay Later',
    description: 'Delivering doorstep fashion trials in 60 mins.',
    image: require('@assets/images/Try.jpeg'),
  },
  {
    id: '2',
    title: 'Delivered Fast, Return Easy',
    description: 'Fits delivered in minutes. No more guesswork.',
    image: require('@assets/images/Delivery.jpeg'),
  },
  {
    id: '3',
    title: 'A Small Trial Fee Upfront',
    description: 'And pay for clothes only after your trial',
    image: require('@assets/images/Buy.jpeg'),
  },
  {
    id: '4',
    title: 'Get Unbelievable Discounts ',
    description: 'Ready for a fashion revolution?',
    image: require('@assets/images/Win.jpg'),
  },
];

export default function OnboardingScreen() {
  const {setOnboarded} = useStateContext();
  const router = useRouter();
  const imageContainerRef = useRef<null | FlatList>(null);
  const pathName = usePathname();
  const [currentScreen, setCurrentScreen] = useState(0);

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: "#0C0C0D", //getColor(tokens, 'bg.screen'),
      // position: 'absolute'
      height: '100%',
      width: '100%'
    },
    imageContainer: {
      height: width * 16 / 9,
      width: '100%',
      position: 'absolute',
      resizeMode: 'contain'

    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    contentContainer: {
      paddingHorizontal: 16, //getSpacing(tokens, 'padding.container'),
      position: 'absolute',
      backgroundColor: "#fff", //getColor(tokens, 'bg.screen'),
      bottom: 0,
      right: 0,
      width: '100%',
      paddingTop: 20,
      paddingBottom: 40,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    title: {
      fontFamily: "CreatoDisplay",
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 40,
      //...getTypography(tokens, 'h1'),
      color: "#110b2c", //getColor(tokens, 'text.main'),
      marginBottom: 4, //getSpacing(tokens, 'gap.heading_to_paragraph'),
      textAlign: 'center',
      // textStyle: 'italic'
    },
    description: {
      fontSize: 15,
      fontWeight: '400',
      color: "#787887", //getColor(tokens, 'text.help'),
      textAlign: 'center',
      marginBottom: 20, //getSpacing(tokens, 'gap.section'),
    },
    buttonContainer: {
      // paddingHorizontal: getSpacing(tokens, 'padding.button'),
      paddingBottom: 16, //getSpacing(tokens, 'padding.button'),
      gap: 12, //getSpacing(tokens, 'gap.button'),
      justifyContent: 'flex-end',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32, //getSpacing(tokens, 'padding.max'),
    },
    paginationDot: {
      width: 30,
      height: 4,
      borderRadius: 1,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: "#5439DB", //getColor(tokens, 'brand.primary'),
    },
    inactiveDot: {
      backgroundColor: "#303036", //getColor(tokens, 'border.divider'),
    },
    skipText: {
      fontFamily: "CreatoDisplay",
      fontSize: 14,
      color: "#93939F", //getColor(tokens, 'text.help'),
      textAlign: 'center',
    }
  });

  const scrollBackGround = (index: number) => {
    if (imageContainerRef)
      imageContainerRef.current?.scrollToIndex({ index, animated: true });
  }

  const Content = ({ goToScreen, currentIndex, setCurrentIndex }: { goToScreen: (index: number) => void, currentIndex: number, setCurrentIndex: (index: number) => void }) => {
    // const [currentIndex, setCurrentIndex] = useState(0);
    const isLastScreen = currentIndex === onboardingScreens.length - 1;
    const isFirstScreen = currentIndex === 0;
    const currentScreen = onboardingScreens[currentIndex];

    // Handle completing onboarding
    const completeOnboarding = () => {
      router.push('/signUp');
      setOnboarded(true);
    };

    // Handle navigation to next screen
    const goToNextScreen = () => {
      if (isLastScreen) {
        completeOnboarding();
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    };
    const goToPreviousScreen = () => {
      setCurrentIndex(currentIndex - 1);
    };

    useEffect(() => {
      const goBack = () => {
        if(pathName === '/onboarding' && currentIndex > 0) {
          goToScreen(currentIndex - 1);
          setCurrentIndex(currentIndex - 1);
          return true;
        }
        return false;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', goBack);
      return () => backHandler.remove();
    });

    useEffect(()=>{
      goToScreen(currentIndex);
    }, [currentIndex]);

    return (
      <View style={styles.contentContainer}>
        <View style={styles.paginationContainer}>
          {onboardingScreens.map((screen, index) => (
            <View
              key={screen.id}
              style={[
                styles.paginationDot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
        <Text style={styles.title}>{currentScreen.title}</Text>
        <Text style={styles.description}>{currentScreen.description}</Text>
        <View style={styles.buttonContainer}>
          {isFirstScreen ?
            <View style={{ height: 48 }}></View> :
            <Button
              label={"Previous"}
              variant="neutralsecondary"
              size="large"
              onPress={goToPreviousScreen}
              style={{ width: '100%' }}
            />
          }
          <Button
            label={isLastScreen ? "Continue!" : "Next"}
            variant="neutral"
            size="large"
            onPress={goToNextScreen}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.imageContainer]}>
        <FlatList
          ref={imageContainerRef}
          data={onboardingScreens}
          scrollEnabled={false}
          horizontal={true}
          renderItem={({ item }: any) =>
            <View style={{ height, width }}>
              <Image
                source={item.image}
                style={styles.image}
              />
            </View>
          }
          getItemLayout={(data: any, index: number) => ({ length: width, offset: width * (index), index })}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Content goToScreen={scrollBackGround} currentIndex={currentScreen} setCurrentIndex={setCurrentScreen} />
    </View>
  );
}
