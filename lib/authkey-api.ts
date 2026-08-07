import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SendOTPResponse {
  success: boolean;
  request_id?: string;
  session_id?: string;
  message?: string;
  error?: string;
  retry_after?: number;
}

export interface VerifyOTPResponse {
  success: boolean;
  verified?: boolean;
  message?: string;
  error?: string;
  remainingAttempts?: number;  // Changed from remaining_attempts to match edge function
  // Auth token fields for successful verification
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: {
    id: string;
    phone: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
  };
}

/**
 * Send OTP using AuthKey.io via Supabase Edge Function
 * @param phone Phone number (10 digits)
 * @param channel SMS or WHATSAPP
 * @returns Promise with request_id and session_id for verification
 */
export async function sendOTP(
  phone: string, 
  channel: 'SMS' | 'WHATSAPP' = 'SMS'
): Promise<SendOTPResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { phone, channel }
    });

    if (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }

    return data;
  } catch (error) {
    console.error('Send OTP network error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

/**
 * Verify OTP using AuthKey.io via Supabase Edge Function
 * @param phone Phone number (10 digits)
 * @param otp OTP code (4-6 digits)
 * @param sessionId Session ID from sendOTP response
 * @param firstName Optional first name for user profile
 * @param lastName Optional last name for user profile
 * @returns Promise with verification result and auth tokens if successful
 */
export async function verifyOTP(
  phone: string,
  otp: string,
  sessionId: string,
  firstName?: string,
  lastName?: string
): Promise<VerifyOTPResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: { 
        sessionId,  // Changed from session_id to sessionId
        otp,
        firstName,
        lastName
      }
    });

    if (error) {
      console.error('Verify OTP error:', error);
      // Try to extract error from response if available
      const errorMessage = data?.error || error.message || 'Failed to verify OTP';
      return {
        success: false,
        error: errorMessage,
        remainingAttempts: data?.remainingAttempts
      };
    }

    return data;
  } catch (error) {
    console.error('Verify OTP network error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

/**
 * Create a simple user session after OTP verification
 * Since we're not using Supabase Auth directly, we'll manage our own session
 * @param userId User ID from OTP verification
 * @param phone Phone number
 * @returns Promise indicating success
 */
export async function createSimpleSession(
  userId: string,
  phone: string
) {
  try {
    console.log('Creating simple session for user:', userId);
    
    // Store user info in AsyncStorage as a simple session
    const sessionData = {
      userId,
      phone,
      createdAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
    
    console.log('Simple session created successfully');
    
    return { success: true, userId, phone };
  } catch (error) {
    console.error('Create session error:', error);
    throw error;
  }
}

/**
 * Validate phone number format for Indian mobile numbers
 * @param phone Phone number string
 * @returns Formatted phone number with +91 prefix
 */
export function validatePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Remove country code if present
  let phoneNumber = cleaned;
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    phoneNumber = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    phoneNumber = cleaned.substring(1);
  }
  
  // Check if it's a valid Indian mobile number
  if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format. Must be a 10-digit Indian mobile number.');
  }
  
  return `+91${phoneNumber}`;
}

/**
 * Format phone number for display
 * @param phone Phone number with country code
 * @returns Formatted display string
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const number = cleaned.slice(2);
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
}