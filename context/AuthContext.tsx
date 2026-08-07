import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOTP, verifyOTP, validatePhoneNumber, SendOTPResponse, VerifyOTPResponse } from '../lib/authkey-api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  formFilled: boolean;
  fromPune: boolean;
  noInternet: boolean;
  signUp: (phone: string, channel?: 'SMS' | 'WHATSAPP') => Promise<SendOTPResponse>;
  verifyPhoneNumber: (firstName: string, lastName: string, phone: string, otp: string, sessionId: string) => Promise<VerifyOTPResponse & { success: boolean }>;
  signIn: (phone: string, channel?: 'SMS' | 'WHATSAPP') => Promise<SendOTPResponse>;
  signOut: () => Promise<void>;
  resendOtp: (phone: string, channel?: 'SMS' | 'WHATSAPP') => Promise<SendOTPResponse>;
  setFromPune: React.Dispatch<React.SetStateAction<boolean>>;
  // Store session ID for OTP verification
  otpSessionId: string | null;
  setOtpSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [fromPune, setFromPune] = useState<boolean>(false);
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [noInternet, setNoInternet] = useState<boolean>(false);

  const getFormFilledStatus = async (userId?: string) => {
    try {
      // Use provided userId or get from current session
      const userIdToUse = userId || user?.id;

      if (userIdToUse) {
        console.log('Getting form filled status for user:', userIdToUse);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('form_completed, is_from_pune')
          .eq('user_id', userIdToUse)
          .single();

        if (error) {
          console.error('Error fetching form status:', error);
          if(error.message === "TypeError: Network request failed")
            setNoInternet(true);
          const formFilled = await AsyncStorage.getItem('formFilled');
          const fromPune = await AsyncStorage.getItem('fromPune');
          setFormFilled(formFilled === 'true');
          console.log(formFilled === 'true', "I am here")
          setFromPune(fromPune === 'true');
          return;
        }

        console.log('Form status data:', data);
        setFormFilled(data?.form_completed ?? false);
        setFromPune(data?.is_from_pune ?? false);
        AsyncStorage.setItem('formFilled', String(data?.form_completed && true));
        AsyncStorage.setItem('fromPune', String(data?.is_from_pune && true));
      } else {
        console.log('No user ID available for form status check');
      }
    } catch (error) {
      console.error('Error getting form filled status:', error);
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session check:', { session: !!session, error });
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        getFormFilledStatus(session.user.id);
        AsyncStorage.setItem('userToken', session.access_token);
      }
      if (error) {
        console.error('Initial session error:', error);
      }
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        AsyncStorage.setItem('userToken', session.access_token);
        getFormFilledStatus(session.user.id);
      } else {
        // Clear stored data on sign out
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userSession');
        setFormFilled(false);
        setFromPune(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    phone: string,
    channel: 'SMS' | 'WHATSAPP' = 'SMS'
  ): Promise<SendOTPResponse> => {
    try {
      // Validate phone number format
      const formattedPhone = validatePhoneNumber(phone);
      const cleanPhone = formattedPhone.replace('+91', ''); // Remove +91 for AuthKey.io

      const response = await sendOTP(cleanPhone, channel);

      if (response.success && response.sessionId) {
        setOtpSessionId(response.sessionId);
      }

      return response;
    } catch (error) {
      console.error('SignUp error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP'
      };
    }
  };

  const verifyPhoneNumber = async (
    firstName: string,
    lastName: string,
    phone: string,
    otp: string,
    sessionId: string
  ): Promise<VerifyOTPResponse & { success: boolean }> => {
    try {
      // Validate phone number format
      const formattedPhone = validatePhoneNumber(phone);
      const cleanPhone = formattedPhone.replace('+91', ''); // Remove +91 for AuthKey.io

      const verifyResponse = await verifyOTP(cleanPhone, otp, sessionId, firstName, lastName);

      if (verifyResponse.success && verifyResponse.verified && verifyResponse.user) {
        try {
          console.log('OTP verified, user created in Supabase Auth:', verifyResponse.user.id);

          // Clear the OTP session ID
          setOtpSessionId(null);

          // Now we have proper auth tokens, let's set the Supabase session
          if (verifyResponse.access_token && verifyResponse.refresh_token) {
            console.log('Setting Supabase auth session with tokens');

            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: verifyResponse.access_token,
              refresh_token: verifyResponse.refresh_token
            });

            if (error) {
              console.error('Error setting auth session:', error);
              throw new Error(`Failed to set auth session: ${error.message}`);
            }

            if (session) {
              console.log('Supabase auth session created successfully:', session.user.id);
              // The auth state will be updated automatically by the onAuthStateChange listener
            } else {
              throw new Error('Session creation returned null');
            }
          } else {
            console.warn('No auth tokens received, falling back to manual user state');
            // Fallback: manually set user state if no tokens
            setUser({ id: verifyResponse.user.id, phone: verifyResponse.user.phone } as any);
            await getFormFilledStatus(verifyResponse.user.id);
          }

          return { ...verifyResponse, success: true };
        } catch (sessionError) {
          console.error('Session creation error:', sessionError);
          return {
            success: false,
            error: 'Failed to create session after OTP verification'
          };
        }
      }

      return { ...verifyResponse, success: false };
    } catch (error) {
      console.error('Verify phone number error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP'
      };
    }
  };

  const resendOtp = async (
    phone: string,
    channel: 'SMS' | 'WHATSAPP' = 'SMS'
  ): Promise<SendOTPResponse> => {
    try {
      // Validate phone number format
      const formattedPhone = validatePhoneNumber(phone);
      const cleanPhone = formattedPhone.replace('+91', ''); // Remove +91 for AuthKey.io

      const response = await sendOTP(cleanPhone, channel);

      if (response.success && response.sessionId) {
        setOtpSessionId(response.sessionId);
      }

      return response;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend OTP'
      };
    }
  };

  const signIn = async (
    phone: string,
    channel: 'SMS' | 'WHATSAPP' = 'SMS'
  ): Promise<SendOTPResponse> => {
    // For now, signIn is the same as signUp - just sends OTP
    return signUp(phone, channel);
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');

      // Sign out from Supabase Auth
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase sign out error:', error);
        throw error;
      }

      // Clear any remaining stored data
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userSession');

      // Clear state (will also be cleared by onAuthStateChange)
      setUser(null);
      setSession(null);
      setFormFilled(false);
      setFromPune(false);
      setOtpSessionId(null);

      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      formFilled,
      fromPune,
      noInternet,
      signUp,
      signIn,
      signOut,
      verifyPhoneNumber,
      resendOtp,
      setFromPune,
      otpSessionId,
      setOtpSessionId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};