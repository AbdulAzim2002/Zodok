import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../shared/';

interface UpdateNotificationProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
  forceUpdate?: boolean;
  onUpdate: () => void;
  onDismiss?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  visible,
  currentVersion,
  latestVersion,
  storeUrl,
  forceUpdate = false,
  onUpdate,
  onDismiss,
}) => {
  const { tokens } = useTheme();

  const handleUpdate = () => {
    Linking.openURL(storeUrl).catch(err => {
      console.error('Failed to open store URL:', err);
      Alert.alert(
        'Error',
        'Failed to open app store. Please update manually from your app store.',
        [{ text: 'OK' }]
      );
    });
    onUpdate();
  };

  const styles = useThemedStyles((tokens) => ({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: getSpacing(tokens, 'lg'),
    },
    container: {
      backgroundColor: getColor(tokens, 'bg.card'),
      borderRadius: getBorderRadius(tokens, 'lg'),
      padding: getSpacing(tokens, 'xl'),
      width: '100%',
      maxWidth: 350,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    title: {
      fontSize: 24,
      fontFamily: getFontFamily('bold'),
      color: getColor(tokens, 'text.main'),
      textAlign: 'center',
      marginBottom: getSpacing(tokens, 'md'),
    },
    message: {
      fontSize: 16,
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.secondary'),
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: getSpacing(tokens, 'lg'),
    },
    versionInfo: {
      backgroundColor: getColor(tokens, 'bg.muted'),
      padding: getSpacing(tokens, 'md'),
      borderRadius: getBorderRadius(tokens, 'md'),
      marginBottom: getSpacing(tokens, 'lg'),
    },
    versionText: {
      fontSize: 14,
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.main'),
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: getSpacing(tokens, 'md'),
    },
    button: {
      flex: 1,
      paddingVertical: getSpacing(tokens, 'md'),
      paddingHorizontal: getSpacing(tokens, 'lg'),
      borderRadius: getBorderRadius(tokens, 'md'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    updateButton: {
      backgroundColor: getColor(tokens, 'primary'),
    },
    laterButton: {
      backgroundColor: getColor(tokens, 'bg.muted'),
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.default'),
    },
    updateButtonText: {
      fontSize: 16,
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.inverse'),
    },
    laterButtonText: {
      fontSize: 16,
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.main'),
    },
    forceUpdateContainer: {
      alignItems: 'center',
    },
    forceUpdateButton: {
      minWidth: '60%',
    },
    urgentIndicator: {
      width: 4,
      height: '100%',
      backgroundColor: getColor(tokens, 'error.500'),
      position: 'absolute',
      left: 0,
      borderTopLeftRadius: getBorderRadius(tokens, 'lg'),
      borderBottomLeftRadius: getBorderRadius(tokens, 'lg'),
    },
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={forceUpdate ? undefined : onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {forceUpdate && <View style={styles.urgentIndicator} />}

          <Text style={styles.title}>
            {forceUpdate ? 'Update Required' : 'Update Available'}
          </Text>

          <Text style={styles.message}>
            {forceUpdate
              ? 'This update contains important fixes and must be installed to continue using the app.'
              : 'A new version of Zodok is available with improvements and bug fixes.'
            }
          </Text>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>
              Current: v{currentVersion} → Latest: v{latestVersion}
            </Text>
          </View>

          <View style={[
            styles.buttonContainer,
            forceUpdate && styles.forceUpdateContainer
          ]}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.updateButton,
                forceUpdate && styles.forceUpdateButton
              ]}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>
                {forceUpdate ? 'Update Now' : 'Update'}
              </Text>
            </TouchableOpacity>

            {!forceUpdate && onDismiss && (
              <TouchableOpacity
                style={[styles.button, styles.laterButton]}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};