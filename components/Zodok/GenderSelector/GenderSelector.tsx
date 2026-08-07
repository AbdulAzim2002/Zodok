import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';

type Parameters = {
  selectOption: (id: string, option: string) => void;
  id: string;
  initialState: (string | null);
}

const sexArray = ['Male', 'Female', 'Other']

export const GenderSelector = ({ selectOption, id, initialState }: Parameters) => {

  const index = sexArray.indexOf(initialState ? initialState : 'notSelected');
  const [highlight, changeHighlight] = useState(index);
  const { tokens, theme } = useTheme();

  const styles = useThemedStyles((tokens) => ({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: getSpacing(tokens, 'gap.grid'),
    },
    optionContainer: {
      flex: 1,
      padding: getSpacing(tokens, 'padding.card'),
      gap: getSpacing(tokens, 'gap.heading_to_heading'),
      alignItems: 'center',
      borderRadius: getBorderRadius(tokens, 'card'),
      backgroundColor: getColor(tokens, 'bg.option'),
    },
    image: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
      borderRadius: getBorderRadius(tokens, 'cardimage'),
      flexGrow: 1,
      flexShrink: 2,
    },
    text: {
      flexShrink: 0,
      fontSize: 15,
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.main'),
    },
    active: {
      borderWidth: 1,
      backgroundColor: getColor(tokens, 'bg.option_selected'),
      borderColor: getColor(tokens, 'border.option_selected'),
    },
    inactive: {
      borderColor: getColor(tokens, 'border.option'),
      borderWidth: 1,
    }
  }));

  type renderParameter = {
    item: string;
    index: number;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={highlight === 0 ? [styles.optionContainer, styles.active] : [styles.optionContainer, styles.inactive]}
        onPress={() => { selectOption(id, 'Male'); changeHighlight(0) }}
      >
        <Image
          style={styles.image}
          source={require('./Male.png')}
        />
        <Text style={styles.text}>Male</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={highlight === 1 ? [styles.optionContainer, styles.active] : [styles.optionContainer, styles.inactive]}
        onPress={() => { selectOption(id, 'Female'); changeHighlight(1) }}
      >
        <Image
          style={styles.image}
          source={require('./Female.png')}
        />
        <Text style={styles.text}>Female</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={highlight === 2 ? [styles.optionContainer, styles.active] : [styles.optionContainer, styles.inactive]}
        onPress={() => { selectOption(id, 'Other'); changeHighlight(2) }}
      >
        <Image
          style={styles.image}
          source={require('./Other.png')}
        />
        <Text style={styles.text}>Other</Text>
      </TouchableOpacity>
    </View>
  );
}