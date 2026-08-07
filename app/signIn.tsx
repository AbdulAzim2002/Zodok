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
	const [email, setEmail] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');

	const [hidePassword, setHidePassword] = React.useState<boolean>(true);
	const [emailCheck, setEmailCheck] = React.useState<boolean>(false);
	const [passwordCheck, setPasswordCheck] = React.useState<boolean>(false);
	const [editable, setEditable] = React.useState<boolean>(true);
	const [error, setError] = React.useState<boolean>(false);
	const [errorMessage, setErrorMessage] = React.useState<string>('Something went wrong!');

	useEffect(()=>{
		setDisabled(!emailCheck || !passwordCheck);
	}, [emailCheck, passwordCheck]);

	const logIn = async (email: string, password: string) => {
		setEditable(false);
    setLoading(true);

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if(error) {
      if(error.message)
        setErrorMessage(error.message);
      setEditable(true);
      setLoading(false);
      setError(true);
      setTimeout(()=>{setError(false)}, 2500);
    } else
			router.replace('/(tabs)/home');
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

			{/* <Modal
				visible={otpInput}
				transparent={false}
				animationType='slide'
				onRequestClose={()=>{setOtpInput(false)}}
			>
				<Otp
					verify={submitOtp}
					phone={phone}
					resendOtp={onSignInButtonPress}
					channel="SMS"
				/>
			</Modal> */}

		<View style={styles.contentContainer} >
			<Text style={{color: 'white', fontSize: 28}}>Login</Text>
				<View style={styles.inputContainer}>
					<Ionicons name="mail-outline" size={20} color={'grey'} />
					<TextInput
						ref={emailInput}
						style={styles.input}
						placeholder="Enter your email address"
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
					<Ionicons name="key-outline" size={20} color={'grey'} />
					<TextInput
						ref={passwordInput}
						style={styles.input}
						placeholder="Enter your password"
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
				<Pressable  style={{alignSelf: 'flex-start'}}onPress={()=>{router.replace('/signUp')}}><Text style={{color:"#5439DB"}}>Forgot password?</Text></Pressable>
				<Button label="Get Started" 
					onPress={()=>{
						logIn(email, password);
					}} 
					style={{ width: '100%' }}
					loading={loading}
					disabled={disabled}
				/>
				<View style={{flexDirection: "row"}}>
					<Text style={{color:"#ffffffbe"}}>Don't have an account? </Text>
					<Pressable onPress={()=>{router.replace('/signUp');}}><Text style={{color:"#5439DB"}}>SignUp</Text></Pressable>
				</View>
				<Animated.View style={fakeView}/>
		</View>

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

// interface OTPProps {
//   verify: (otp: string, phone: string) => Promise<{session: Session | null, error: AuthError | null}>;
//   resendOtp: (phone:string) => Promise<boolean>;
//   phone: string;
//   channel?: 'SMS' | 'WHATSAPP'; // Optional, defaults to SMS
// }

// function Otp({ verify, resendOtp, phone, channel }: OTPProps) {

//     const { width, height } = Dimensions.get('window');
//     const [buttonEnabled, setButtonEnabled] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const inputRef = useRef<TextInput>(null);
//     const [otp, setOtp] = useState<string>('');
//     const [timer, setTimer] = useState<string>('');
//     const [resend, setResend] = useState<boolean>(false);
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
//     const [resendLoading, setResendLoading] = useState(false);

//     const styles = StyleSheet.create({
//         Screen: {
//             backgroundColor: "#0C0C0D", //getColor(tokens, 'bg.screen'),
//             flexDirection: 'column',
//             height: '100%',
//         },
//         OTPContainer: {
//             paddingHorizontal: 16, //getSpacing(tokens, 'padding.container'),
//             paddingTop: 16, //getSpacing(tokens, 'padding.container'),
//             flex: 1,
//             justifyContent: 'space-between'
//         },
//         header: {
//             width: '100%',
//             backgroundColor: "#18181B", //getColor(tokens, 'bg.header'),
//             padding: 16, //getSpacing(tokens, 'padding.container'),
//             elevation: 10,
//             alignItems: 'center',
//             shadowColor: "#18181B", //getColor(tokens, "neutral.900"),
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.3,
//             shadowRadius: 15,
//         },
//         headerText: {
//             fontSize: 18,
//             // fontFamily: getFontFamily('medium'),
//             color: "#EEEBFB", //getColor(tokens, 'text.main'),
//             textAlign: 'center',
//         },
//         OTPUpperPortion: {
//             gap: 16, //getSpacing(tokens, 'gap.subsection'),
//         },
//         bannerContainer: {
//             alignItems: 'center',
//             // marginTop: getSpacing(tokens, 'padding.banner'),
//         },
//         banner: {
//             width: '100%',
//             height: width / 2 - 14,
//             resizeMode: 'cover',
//             borderRadius: 12, //getBorderRadius(tokens, 'image'),
//         },
//         OTPinput: {
//             flex: 1,
//             height: 70,
//             borderWidth: 1,
//             borderColor: "#303036", //getColor(tokens, 'border.input'),
//             borderRadius: 8, //getBorderRadius(tokens, 'input'),
//             // paddingHorizontal: 16, //getSpacing(tokens, 'padding.input'),
//             backgroundColor: "#18181B", //getColor(tokens, 'bg.input'),
//         },
//         input: {
//             flex: 1,
//             height: 70,
//             borderWidth: 1,
//             borderColor: "#303036", //getColor(tokens, 'border.input'),
//             borderRadius: 8, //getBorderRadius(tokens, 'input'),
//             // paddingHorizontal: 16, //getSpacing(tokens, 'padding.input'),
//             backgroundColor: "#18181B", //getColor(tokens, 'bg.input'),

//             width: '100%',
//             fontSize: 24,
//             // fontFamily: getFontFamily('regular'),
//             color: "#EEEBFB", //getColor(tokens, 'text.input_main'),
//             textAlign: 'center',
//             justifyContent: 'center',
//         },
//         myinput: {
//             fontSize: 24,
//             // fontFamily: getFontFamily('regular'),
//             color: "#EEEBFB", //getColor(tokens, 'text.input_main'),
//             backgroundColor: "#18181B", //getColor(tokens, 'bg.input'),
//             textAlign: 'center',
//         },
//         inputContainer: {
//             width: '100%',
//             flexDirection: 'row',
//             gap: 16, //getSpacing(tokens, 'gap.subsection'),
//             backgroundColor: "#0C0C0D", //getColor(tokens, 'bg.screen'),
//         },
//         buttonContainer: {
//             paddingBottom: 32, //getSpacing(tokens, 'padding.max'),
//         },
//         textContainer: {
//             gap: 4, //getSpacing(tokens, 'gap.heading_to_paragraph'),
//         },
//         title: {
//             color: "#EEEBFB", //getColor(tokens, 'text.main'),
//             // fontFamily: getFontFamily('medium'),
//             fontSize: 26
//         },
//         subtitle: {
//             fontSize: 16,
//             // fontFamily: getFontFamily('regular'),
//             color: "#93939F", //getColor(tokens, 'text.help'),
//         },
//         resendContainer: {
//             flex: 1,
//             paddingVertical: 16, //getSpacing(tokens, 'padding.container')
//         },
//         resend: {
//             fontSize: 16,
//             // fontFamily: getFontFamily('regular'),
//             color: "#6291FF", //getColor(tokens, 'text.link'),
//         },
//         resend_disabled: {
//             fontSize: 16,
//             // fontFamily: getFontFamily('regular'),
//             color: "#93939F", //getColor(tokens, 'text.help'),
//         },
//         errorContainer: {
//             marginTop: 2, //getSpacing(tokens, 'gap.paragraph_to_paragraph'),
//             padding: 16, //getSpacing(tokens, 'padding.input'),
//             backgroundColor: "#180405", //getColor(tokens, 'bg.button.error'),
//             borderRadius: 8, //getBorderRadius(tokens, 'input'),
//             borderWidth: 1,
//             borderColor: "#601216", //getColor(tokens, 'border.error'),
//         },
//         errorText: {
//             fontSize: 14,
//             // fontFamily: getFontFamily('regular'),
//             color: "#FCD5D7", //getColor(tokens, 'text.error'),
//             textAlign: 'center',
//         },
//         attemptsText: {
//             fontSize: 14,
//             // fontFamily: getFontFamily('regular'),
//             color: "#93939F", //getColor(tokens, 'text.help'),
//             textAlign: 'center',
//             marginTop: 2, //getSpacing(tokens, 'gap.paragraph_to_paragraph'),
//         },
//         channelIndicator: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginTop: 2, //getSpacing(tokens, 'gap.paragraph_to_paragraph'),
//         },
//         channelText: {
//             fontSize: 14,
//             // fontFamily: getFontFamily('medium'),
//             color: "#93939F", //getColor(tokens, 'text.help'),
//             marginLeft: 6,
//         }
//     });

//     useEffect(() => {
//         setButtonEnabled(otp.length === 6);

//         if (timer === '' && !resend) {
//             let counter = 120;
//             setTimer(`in ${String(Math.floor(counter/60)).padStart(2,'0')}:${String(counter%60).padStart(2,'0')}`);
//             const handelTimer = () => {
//                 if (counter > 0) {
// 									--counter;
// 									setTimer(`in ${String(Math.floor(counter/60)).padStart(2,'0')}:${String(counter%60).padStart(2,'0')}`);
// 								}
//             }
//             const timer = setInterval(handelTimer, 1000);
//             const timeout = setTimeout(() => { clearInterval(timer), setTimer(''), setResend(true) }, 120050);
//         }
//     });

//     useEffect(() => {
//         const eventHanderForKeyboradDisappearing = () => {
//             inputRef.current?.blur();
//         };

//         let counter = 120;

//         const handelTimer = () => {
//             if (counter > 0) {
// 							--counter;
// 							setTimer(`in ${String(Math.floor(counter/60)).padStart(2,'0')}:${String(counter%60).padStart(2,'0')}`);
// 						}
//         }

//         const timer = setInterval(handelTimer, 1000);
//         const timeout = setTimeout(() => { clearInterval(timer), setTimer(''), setResend(true) }, 120050);

//         const keyboardDisapperHndler = Keyboard.addListener('keyboardDidHide', eventHanderForKeyboradDisappearing);
//         return (() => {
//             Keyboard.removeAllListeners('keyboardDidHide');
//             clearTimeout(timeout);
//             clearInterval(timer);
//         })
//     }, []);

//     const focusInput = () => {
//         if (inputRef.current?.isFocused() && !Keyboard.isVisible())
//             inputRef.current?.blur();
//         else
//             inputRef.current?.focus();
//     }

//     const handelInputChange = (otp: string) => {
//         if (otp === '') {
//             setOtp(otp);
// 						setErrorMessage('');
//             return;
//         }
//         switch (otp[otp.length - 1]) {
//             case '0':
//             case '1':
//             case '2':
//             case '3':
//             case '4':
//             case '5':
//             case '6':
//             case '7':
//             case '8':
//             case '9':
//                 break;
//             default:
//                 return;

//         }
//         setOtp(otp);
// 				setErrorMessage('');
//         if (otp.length === 6)
//             inputRef.current?.blur();
//     }

//     return (
//         <View style={styles.Screen}>
//             <View style={styles.header}>
//                 <Text style={styles.headerText}>Verify OTP</Text>
//             </View>
//             <View style={styles.OTPContainer}>
//                 <View style={styles.OTPUpperPortion}>
//                     <View style={styles.bannerContainer}>
//                         <Image
//                             source={require('@/assets/images/OTP.png')}
//                             style={styles.banner}
//                         />
//                     </View>
//                     <View style={styles.textContainer}>
//                         <Text style={styles.title}>
//                             Check your Message.
//                         </Text>
//                         <Text style={styles.subtitle}>
//                             We have sent you an OTP to +91 {phone}
//                         </Text>
                        
//                     </View>
//                     <View>
//                         <KeyboardAvoidingView>
//                             <View>
//                                 <View style={[styles.inputContainer, { position: 'absolute', alignItems: 'center', justifyContent: 'center', height: '100%' }]}>
//                                     <TextInput
//                                         ref={inputRef}
//                                         value={otp}
//                                         onChangeText={handelInputChange}
//                                         maxLength={6}
//                                         contextMenuHidden
//                                         keyboardType="number-pad"
//                                         textContentType="oneTimeCode"
//                                         autoComplete="sms-otp"
//                                     />
//                                 </View>
//                                 <TouchableWithoutFeedback onPress={focusInput}>
//                                     <View style={styles.inputContainer}>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 0 ? otp[0] : '_'}</Text>
//                                         </View>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 1 ? otp[1] : '_'}</Text>
//                                         </View>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 2 ? otp[2] : '_'}</Text>
//                                         </View>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 3 ? otp[3] : '_'}</Text>
//                                         </View>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 4 ? otp[4] : '_'}</Text>
//                                         </View>
//                                         <View style={styles.input}>
//                                             <Text style={styles.myinput}>{otp.length > 5 ? otp[5] : '_'}</Text>
//                                         </View>
//                                     </View>
//                                 </TouchableWithoutFeedback>
//                             </View>
//                         </KeyboardAvoidingView>
//                     </View>

//                     <TouchableOpacity
//                         onPress={()=>{resendOtp(phone), setErrorMessage(''), setResend(false)}}
//                         activeOpacity={resend && !resendLoading ? 0.2 : 1}
//                         disabled={resendLoading}
//                     >
//                         <Text style={resend && !resendLoading ? styles.resend : styles.resend_disabled}>
//                             {resendLoading ? 'Sending...' : `Resend OTP ${timer}`}
//                         </Text>
//                     </TouchableOpacity>
// 										{/* Error Display */}
//                     {errorMessage ? (
//                         <View style={styles.errorContainer}>
//                             <Text style={styles.errorText}>OTP has expired or is invalid</Text>
//                         </View>
//                     ) : null}
//                 </View>
//                 <View style={styles.buttonContainer}>
//                     <Button
//                         label="Verify"
//                         variant="primary"
//                         size="large"
//                         onPress={
//                             ()=>{
//                                 setIsLoading(true)
//                                 verify(otp, phone)
//                                 .then(({error})=>{
//                                     if(error)
//                                         setErrorMessage(error.message)
//                                     setIsLoading(false)
//                                 })
//                             }}
//                         loading={isLoading}
//                         disabled={!buttonEnabled}
//                         style={{ width: '100%' }}
//                     />
//                 </View>
//             </View>
//         </View>
//     );
// }
