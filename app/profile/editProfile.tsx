import { Button } from "@/components";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, KeyboardTypeOptions, Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Input({
    value,
    placeHolder,
    icon,
    setBase,
    autoCapitalize,
    keyboardType,
    editable,
    onChangeText,
    secureTextEntry=false,
  }: {
    value: string,
    placeHolder?: string,
    icon: "person-outline" | "call-outline" | "mail-outline" | "key-outline",
    setBase:(base:number)=>void,
    autoCapitalize?: "none" | "words" | "sentences" | "characters",
    keyboardType?: KeyboardTypeOptions,
    editable?: boolean,
    onChangeText?: (value:string)=>void,
    secureTextEntry?: boolean
  }
) {
  const [thisBase, setThisBase] = useState<number>(0); 
  const [hide, setHide] = useState<boolean>(secureTextEntry);
  return (
    <View style={styles.inputContainer} onLayout={({nativeEvent})=>{setThisBase(nativeEvent.layout.y + nativeEvent.layout.height)}}>
      <Ionicons name={icon} size={20} color={'grey'} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeHolder}
        placeholderTextColor={'grey'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={()=>{setBase(thisBase)}}
        editable={editable}
        secureTextEntry={hide}
      />
      {secureTextEntry && (
          <Pressable onPress={()=>{setHide(!hide)}}>
            {
              hide ?
              <Ionicons name="eye-off-outline" size={20} color={'grey'} /> :
              <Ionicons name="eye-outline" size={20} color={'grey'} />
            }
          </Pressable>
        )
      }
    </View>
  )
}

const {height, width} = Dimensions.get('screen');

export default function EditProfile() {

  const {top, bottom} = useSafeAreaInsets();

  const {profile, session} = useAuthContext();

  const [name, setName] = useState<string>(profile.user.user_metadata.name);
  const [email, setEmail] = useState<string>(profile.user.email);
  const [phone, setPhone] = useState<string>(profile.user.user_metadata.phone || '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [disableEmailChange, setDisableEmailChange] = useState<boolean>(true);
  const [disablePasswordChange, setDisablePasswordChange] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(true);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingEmailChange, setLoadingEmaiChange] = useState<boolean>(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [keyboardOffset, setKeyboardOffse] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [offset, setOffset] = useState<number>(top);
  const [base, setBase] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErroeMessage] = useState('Error Message!');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Successful');
  const [deleteAccount, setDeleteAccount] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      const metrics = Keyboard.metrics();
      if(metrics) {
        setKeyboardHeight(metrics.height+20);
        setKeyboardOffse(metrics.screenY);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    console.log(Keyboard.metrics());

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log(base, offsetY, keyboardOffset);
    if(keyboardVisible && base-offsetY > keyboardOffset-offset) {
      scrollViewRef.current?.scrollTo({y: base+offset-keyboardOffset+20, animated: true})
    }
  }, [keyboardVisible])

  useEffect(() => {
    let nameUpdate = true, phoneUpdate = true;
    if(name != profile.user.user_metadata.name)
      nameUpdate = false;

    if((phone.length == 10 || phone.length == 11) && phone != profile.user.user_metadata.phone)
        phoneUpdate = false;
    
    setDisableSave(nameUpdate && phoneUpdate);
  }, [name, phone])

  useEffect(() => {
    setDisableEmailChange(email == profile.user.email || !checkEmail(email));
  }, [email])

  useEffect(() => {
    setDisablePasswordChange(newPassword.length < 6);
  }, [newPassword])

  const handleScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetY(event.nativeEvent.contentOffset.y);
  };

  const checkEmail = (email: string) => {
  	const emailRegex = /^[A-Za-z0-9][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  	return emailRegex.test(email);
  };

  const updateNamePhone = async (name: string, phone: string) => {
    setEditable(false);
    setDisabled(true);
    setLoadingSave(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { name, phone}
    })
    if(error) {
      setErroeMessage(error.message || 'Something went wrong');
      setError(true);
    } else {
      setSuccessMessage('Successfully saved changes');
      setSuccess(true);
      setDisableSave(true);
    }
    setEditable(true);
    setDisabled(false);
    setLoadingSave(false);
  }

  const updateEmail = async (email: string) => {
    setEditable(false);
    setDisabled(true);
    setLoadingEmaiChange(true);
    const { data, error } = await supabase.auth.updateUser({
      email,
    })
    if(error) {
      setErroeMessage(error.message || 'Something went wrong');
      setError(true);
    } else {
      setSuccessMessage('A verification email has been sent to your new email address');
      setSuccess(true);
      setDisableEmailChange(true);
    }
    setEditable(true);
    setDisabled(false);
    setLoadingEmaiChange(false);
  }

  const changePassword = async (password: string) => {
    setEditable(false);
    setDisabled(true);
    setLoadingPasswordChange(true);
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    if(error) {
      setErroeMessage(error.message || 'Something went wrong');
      setError(true);
    } else {
      setSuccessMessage('Password changed successfully');
      setSuccess(true);
      setDisablePasswordChange(true);
    }
    setNewPassword('');
    setEditable(true);
    setDisabled(false);
    setLoadingPasswordChange(false);
  }
  

  return (
    <View style={{paddingBottom: bottom, height, backgroundColor: "#FFF",}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={error}
        onRequestClose={() => {
          setError(false);
        }}
      >
        <Pressable
          style={{height: '100%', width: '100%'}}
          onPress={()=>{setError(false)}}
        >
          <View style={{height: 50, paddingHorizontal: 16}}>
          <Text style={[
            styles.input, 
            {
              backgroundColor: "#F3575F", 
              borderColor: "#C0242C", 
              borderWidth: 1, 
              width: '100%',
              textAlign: 'center', 
              textAlignVertical: 'center', 
              borderRadius: 8
            }
          ]}>{errorMessage}</Text>
          </View>
        </Pressable>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={success}
        onRequestClose={() => {
          setSuccess(false);
        }}
      >
        <Pressable
          style={{height: '100%', width: '100%'}}
          onPress={()=>{setSuccess(false)}}
        >
          <View style={{height: 50, paddingHorizontal: 16}}>
          <Text style={[
            styles.input, 
            {
              backgroundColor: "#33D67F", 
              borderColor: "#00A34C", 
              borderWidth: 1, 
              width: '100%',
              textAlign: 'center', 
              textAlignVertical: 'center', 
              borderRadius: 8
            }
          ]}>{successMessage}</Text>
          </View>
        </Pressable>
      </Modal>
      {/* <StatusBar translucent style="light" /> */}
      <View 
        onLayout={({nativeEvent})=>{setOffset(nativeEvent.layout.height)}} 
        style={[styles.header, {paddingTop: top > 12 ? top : 12}]}
      >
          <TouchableOpacity onPress={()=>{router.back()}} style={styles.iconButton}>
            <Ionicons name="chevron-back-outline" size={24} color={'grey'}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={[styles.iconButton, {backgroundColor: 'transparent'}]} />
      </View>
      <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{paddingHorizontal: 16}}>

          <Input
            value={name}
            onChangeText={setName}
            placeHolder="Tell us your name"
            icon="person-outline"
            autoCapitalize="words" 
            setBase={setBase}
            editable={editable}
          />
          <View style={{height: 20}}/>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeHolder="Your phone number"
            icon="call-outline"
            keyboardType="phone-pad"
            setBase={setBase}
            editable={editable}
          />
          <View style={{height: 20}}/>
          <Button
            label="Save"
            disabled={disableSave || disabled}
            loading={loadingSave}
            onPress={()=>{updateNamePhone(name, phone)}}
          />


        <View style={styles.sectionSeperator}/>


          <Input
            value={email}
            onChangeText={setEmail}
            placeHolder="Your email address"
            icon="mail-outline"
            keyboardType="email-address"
            setBase={setBase}
            editable={editable}
          />
          <View style={{height: 20}}/>
          <Button
            label="Change Email Address"
            disabled={disableEmailChange || disabled}
            loading={loadingEmailChange}
            onPress={()=>{updateEmail(email)}}
          />

        <View style={styles.sectionSeperator}/>

          <Input
            value={newPassword}
            onChangeText={setNewPassword}
            placeHolder="Enter new password"
            icon="key-outline"
            setBase={setBase}
            editable={editable}
            secureTextEntry={true}
          />
          <View style={{height: 20}}/>  
          <Button
            label="Change Password"
            disabled={disablePasswordChange || disabled}
            loading={loadingPasswordChange}
            onPress={()=>{changePassword(newPassword)}}
          />

          <View style={styles.sectionSeperator}/>

          <Modal
            animationType="fade"
            transparent={true}
            visible={deleteAccount}
            onRequestClose={() => {
              setDeleteAccount(false);
            }}
          >
            <View
              style={{
                height: '100%', 
                width: '100%', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#303036ec',
              }}
            >
              <View style={{
                width: 0.9*width,
                alignItems: 'center',
                backgroundColor: "#18181B",
                borderWidth: 1,
                borderColor: "#303036",
                borderRadius: 16,
                paddingVertical: 22,
                paddingHorizontal: 16,
                elevation: 20,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  color: "#C0242C",
                  fontFamily: 'CreatoDisplayBold',
                  marginVertical: 8,
                }}
              >Delete Account</Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: "#9d9d9d",
                  fontSize: 16,
                  marginVertical: 6,
                }}
              >
                Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently removed.
              </Text>
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 8, gap: 16}}>
                <Pressable  
                  style={{
                    flex: 1
                  }}
                  onPress={()=>{
                    setDeleteAccount(false);
                  }}
                  disabled={disabled}
                >
                  <Text style={{
                    fontFamily: 'CreatoDisplay',
                    fontSize: 18,
                    height: 40,
                    width: '100%',
                    backgroundColor: "#FFE0FF",
                    borderRadius: 8,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    paddingHorizontal: 16
                  }}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={{
                    flex: 1
                  }}
                  onPress={async () => {
                    setDisabled(true);
                    const { data, error } = await supabase.functions.invoke('delete-account')
                    if (error) {
                      console.error('Failed to delete account:', error)
                    } else {
                      console.log('Account deleted')
                      // Sign out locally and redirect, since the session is now invalid
                      await supabase.auth.signOut()
                    }
                    setDisabled(false) // 401
                  }}
                  disabled={disabled}
                >
                  <Text style={{
                    fontFamily: 'CreatoDisplay',
                    fontSize: 18,
                    height: 40,
                    width: '100%',
                    color: 'white',
                    backgroundColor: "#F3575F",
                    borderRadius: 8,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    paddingHorizontal: 16
                  }}>Confirm</Text>
                </Pressable>

              </View>
              </View>
            </View>
          </Modal>

          <Pressable onPress={()=>{setDeleteAccount(true)}}>
            <View style={styles.logoutButton}>
              <Text style={styles.logoutText}>Delete Account</Text>
            </View>
          </Pressable>
        <View style={{height: keyboardHeight+20}}/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 8
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 1
  },
  headerTitle: {
    color: '#1A1A1A',
    fontSize: 22,
     fontFamily: 'CreatoDisplayBold'
  },
  inputContainer: {
    // flex: 1,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E9E9EC', //getColor(tokens, 'border.input'),
    borderRadius: 8, //getBorderRadius(tokens, 'input'),
    paddingHorizontal: 16, //getSpacing(tokens, 'padding.input'),
    backgroundColor: '#F5F5F5', //getColor(tokens, 'bg.input'),
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    height: 50,
    flexGrow:1,
    flexShrink:1,
    fontSize: 16,
    color: '#1A1A1A', //getColor(tokens, 'text.input_main'),
    // backgroundColor: 'red',
  },
  label: {
    paddingLeft: 3,
  },
  sectionSeperator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E9E9EC',
    marginVertical: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fed3d3',
    marginVertical: 8,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3B30',
    marginLeft: 8,
  }
})