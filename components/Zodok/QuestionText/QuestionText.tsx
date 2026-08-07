import React, { useState} from 'react';
import { View, Text, TouchableOpacity, FlatList} from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';

type Parameters = {
  value: {
    primary: string;
    secondary: (string|null);
  };
}

export const QuestionText = ({value}: Parameters) => {
  const { tokens, theme } = useTheme();

  const styles = useThemedStyles((tokens) => ({
    container: {
        gap: 4,
    },
    primary: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('medium'),
      fontSize: 26
    },
    secondary: {
      color: getColor(tokens, 'text.help'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16
    },
  }));

  return (
    <View style={styles.container}>
      {
        value.secondary ?
        <View style={styles.container}>
            <Text style={styles.primary}>{value.primary}</Text>
            <Text style={styles.secondary}>{value.secondary}</Text>
        </View> :
        <Text style={styles.primary}>{value.primary}</Text>
      }
    </View>
  );
}