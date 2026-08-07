import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@zodok/components';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('screen');

const getKeyboardHeight = () => {
    const keyboardHeight = useSharedValue(0);
    useKeyboardHandler(
        {
            onMove: event => {
                'worklet';
                keyboardHeight.value = Math.max(event.height, 0);
            },
        },
    );
    return {keyboardHeight};
}

export default function SignIn() {

  const { bottom, top } = useSafeAreaInsets();

  const {keyboardHeight} = getKeyboardHeight();
  const fakeView = useAnimatedStyle(() => {
      return {
        height: Math.abs(keyboardHeight.value)-bottom,
      };
  }, []);

  const emailInput = React.useRef<TextInput>(null);
  const passwordInput = React.useRef<TextInput>(null);

  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');


  const [registered, setRegistered] = React.useState<boolean>(false);
  const [hidePassword, setHidePassword] = React.useState<boolean>(true);
  const [emailCheck, setEmailCheck] = React.useState<boolean>(false);
  const [passwordCheck, setPasswordCheck] = React.useState<boolean>(false);
  const [editable, setEditable] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('Something went wrong!');

  useEffect(()=>{
    setDisabled(!emailCheck || !passwordCheck || name.length == 0);
  }, [emailCheck, passwordCheck, name]);

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
      backgroundColor: "#0C0C0D", //getColor(tokens, 'bg.screen'),
      bottom: 0,
      right: 0,
      width: '100%',
      paddingTop: 20,
      paddingBottom: bottom,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      alignItems: 'center',
      gap: 20,
    },
    title: {
            fontFamily: "CreatoDisplayItalic",
            fontWeight: 600,
            fontSize: 40,
            lineHeight: 40,
      //...getTypography(tokens, 'h1'),
      color: "#EEEBFB", //getColor(tokens, 'text.main'),
      marginBottom: 4, //getSpacing(tokens, 'gap.heading_to_paragraph'),
      textAlign: 'center',
    },
    description: {
      fontFamily: "SpaceMono", //getSecondaryFont(tokens),
      fontSize: 15,
      fontWeight: '400',
      color: "#93939F", //getColor(tokens, 'text.help'),
      textAlign: 'center',
      marginBottom: 20, //getSpacing(tokens, 'gap.section'),
    },
    buttonContainer: {
      // paddingHorizontal: getSpacing(tokens, 'padding.button'),
      paddingBottom: 16, //getSpacing(tokens, 'padding.button'),
      gap: 16, //getSpacing(tokens, 'gap.button'),
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
      fontFamily: "CreatoDisplay", //getPrimaryFont(tokens, 'medium', 'normal'),
      fontSize: 14,
      color: "#93939F", //getColor(tokens, 'text.help'),
      textAlign: 'center',
    },
    inputContainer: {
            flex: 1,
            height: 50,
                    width: '100%',
            borderWidth: 1,
            borderColor: "#303036", //getColor(tokens, 'border.input'),
            borderRadius: 8, //getBorderRadius(tokens, 'input'),
            paddingHorizontal: 16, //getSpacing(tokens, 'padding.input'),
            backgroundColor: "#18181B", //getColor(tokens, 'bg.input'),
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        },
    input: {
            height: 50,
            flexGrow:1,
      flexShrink:1,
            fontSize: 16,
            color: "#EEEBFB", //getColor(tokens, 'text.input_main'),
            // backgroundColor: 'red',
        },
  });

  const register = async (email: string, password: string) => {
    setEditable(false);
    setLoading(true);

    emailInput.current?.blur();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if(error) {
      if(error.message)
        setErrorMessage(error.message);
      setEditable(true);
      setLoading(false);
      setError(true);
      setTimeout(()=>{setError(false)}, 2500);
    } else 
      setRegistered(true);

  };

  const checkEmail = (email: string) => {
   const emailRegex = /^[A-Za-z0-9][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkPassword = (password: string) => {
    if(password.length >= 6)
      return true;
    return false;
  };

  return (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <View style={{ height, width }}>
        <Image
          source={require('@assets/images/Delivery.jpeg')}
          style={styles.image}
        />
      </View>
    </View>

    <View style={styles.contentContainer} >
      <Text style={{color: 'white', fontSize: 28}}>Verify</Text>
        <View style={{flexDirection: "row"}}>
          <Text style={{color:"#ffffffbe", fontSize:16, textAlign: "center"}}>We have sent an verification mail to your email address. Please confirm your Email address and then Continue.</Text>
        </View>
        <Button label="Continue" 
          onPress={()=>{
            router.replace('/signIn');
          }} 
          style={{ width: '100%' }}
        />
        <Animated.View style={fakeView}/>
    </View>
    
    {
      !registered && (
        <View style={styles.contentContainer} >
          <Text style={{color: 'white', fontSize: 28}}>SignUp</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color={'grey'} />
            <TextInput
              ref={emailInput}
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={'grey'}
              value={name}
              onChangeText={setName}
              keyboardType="default"
              autoCapitalize="words"
              editable={editable}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color={'grey'} />
            <TextInput
              ref={emailInput}
              style={styles.input}
              placeholder="Enter an email address"
              placeholderTextColor={'grey'}
              value={email}
              onChangeText={(email)=>{
                setEmail(email);
                setEmailCheck(checkEmail(email));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={editable}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={22} color={'grey'} />
            <TextInput
            ref={passwordInput}
              style={styles.input}
              placeholder="Enter a password"
              placeholderTextColor={'grey'}
              value={password}
              onChangeText={(password)=>{
                setPassword(password);
                  setPasswordCheck(checkPassword(password));
              }}
              secureTextEntry={hidePassword}
              keyboardAppearance='default'
              autoCapitalize="none"
              editable={editable}
            />
            <Pressable onPress={()=>{setHidePassword(!hidePassword)}}>
              {
                hidePassword ?
                <Ionicons name="eye-off-outline" size={22} color={'grey'} />:
                <Ionicons name="eye-outline" size={22} color={'grey'} />
              }
            </Pressable>
          </View>
          <Button label="Create an Account" 
            onPress={()=>{register(email, password)}} 
            style={{ width: '100%' }}
            loading={loading}
            disabled={disabled}
          />
          <View style={{flexDirection: "row"}}>
            <Text style={{color:"#ffffffbe"}}>Already have an account? </Text>
            <Pressable 
              onPress={()=>{
                router.replace('/signIn');
                console.log('signIn')
              }}
            >
              <Text style={{color:"#5439DB"}}>LogIn</Text>
            </Pressable>
          </View>
          <Animated.View style={fakeView}/>
        </View>
      )
    }

    {error &&
      <View style={{width: '100%', paddingHorizontal: 16, paddingTop: top}}>
        <Text style={[
          styles.input, 
          {
            backgroundColor: "#F3575F", 
            borderColor: "#C0242C", 
            borderWidth: 2, 
            width: '100%', 
            textAlign: 'center', 
            textAlignVertical: 'center', 
            borderRadius: 8
          }
        ]}>{errorMessage}</Text>
        <Animated.View style={fakeView}/>
      </View>
    }
  </View>
  )
}