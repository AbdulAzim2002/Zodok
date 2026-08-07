import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';

type Parameters = {
  selectOption: (id: string, option: string | null) => void;
  options: string[];
  id: string;
  initialState: (string | null);
}

export const MCQ = ({ selectOption, options, id, initialState }: Parameters) => {

  const numOptions = options.length - 1;
  const [selected, setSelected] = useState(() => {
    if (initialState === options[numOptions])
      return true;
    else
      return false;
  });
  const [highlight, changeHighlight] = useState(() => {
    const array: boolean[] = [];
    if (initialState) {
      const initalArray = initialState.split('|');
      for (let i = 0; i < numOptions; i++) {
        const value = initalArray.findIndex((item) => (item === options[i]));
        if (value === -1)
          array.push(false);
        else
          array.push(true);
      }
    } else {
      for (let i = 0; i < numOptions; i++)
        array.push(false);
    }
    return array;
  });
  const numRow = Math.floor(numOptions / 2);
  const rowElements: any[] = [];
  const isOddLength = numOptions % 2 == 1;
  const { tokens, theme } = useTheme();

  const styles = useThemedStyles((tokens) => ({
    listWrapper: {
      gap: getSpacing(tokens, 'gap.grid'),
    },
    columnWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: getSpacing(tokens, 'gap.grid'),
    },
    optionBox: {
      flex: 1,
      flexDirection: 'row',
      padding: getSpacing(tokens, 'padding.button'),
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
      borderRadius: getBorderRadius(tokens, 'button'),
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.option'),
    },
    activeOptionBox: {
      backgroundColor: getColor(tokens, 'bg.option_selected'),
      borderColor: getColor(tokens, 'border.option_selected'),
    },
    active: {
      height: 8,
      width: 8,
      borderRadius: 5,
      backgroundColor: getColor(tokens, 'radio.selection'),
    },
    inactive: {
      height: 8,
      width: 8,
      borderRadius: 5,
      backgroundColor: getColor(tokens, 'radio.inner'),
    },
    button: {
      height: 20,
      width: 20,
      borderRadius: 100,
      borderWidth: 4,
      borderColor: getColor(tokens, 'radio.outer'),
      justifySelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    activeButton: {
      borderColor: getColor(tokens, 'radio.outer_selected'),
    },
    text: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 15,

    },
    orContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    or: {
      color: 'grey',
    },
    line: {
      height: 0.5,
      borderRadius: 1,
      backgroundColor: 'grey',
      flex: 1,
    },
  }));

  for (let i = 0; i < numRow; i++) {
    rowElements.push(
      <View
        key={id + ':' + options[2 * i]}
        style={styles.columnWrapper}
      >
        <TouchableOpacity
          style={[styles.optionBox, highlight[2 * i] ? styles.activeOptionBox : {}]}
          onPress={() => {
            type param = {
              item: boolean;
              index: number;
            }
            const array: string[] = [];
            for (let j = 0; j < numOptions; j++) {
              if (j === 2 * i) {
                if (!highlight[j])
                  array.push(options[j]);
              } else {
                if (highlight[j])
                  array.push(options[j]);
              }
            }
            if (array.length)
              selectOption(id, array.join('|'));
            else
              selectOption(id, null);
            setSelected(false);
            changeHighlight(highlight.map((item: boolean, index: number) => {
              if (index === 2 * i)
                return !item;
              else
                return item;
            }));
          }}
        >
          <Text style={styles.text}>{options[2 * i]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBox, highlight[2 * i + 1] ? styles.activeOptionBox : {}]}
          onPress={() => {
            type param = {
              item: boolean;
              index: number;
            }
            const array: string[] = [];
            for (let j = 0; j < numOptions; j++) {
              if (j === 2 * i + 1) {
                if (!highlight[j])
                  array.push(options[j]);
              } else {
                if (highlight[j])
                  array.push(options[j]);
              }
            }
            if (array.length)
              selectOption(id, array.join('|'));
            else
              selectOption(id, null);
            setSelected(false);
            changeHighlight(highlight.map((item: boolean, index: number) => {
              if (index === 2 * i + 1)
                return !item;
              else
                return item;
            }));
          }}
        >
          <Text style={styles.text}>{options[2 * i + 1]}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isOddLength) {
    rowElements.push(
      <View
        key={id + ':' + options[numOptions - 1]}
        style={styles.columnWrapper}
      >
        <TouchableOpacity
          style={[styles.optionBox, highlight[numOptions - 1] ? styles.activeOptionBox : {}]}
          onPress={() => {
            type param = {
              item: boolean;
              index: number;
            }
            const array: string[] = [];
            for (let j = 0; j < numOptions; j++) {
              if (j === numOptions - 1) {
                if (!highlight[j])
                  array.push(options[j]);
              } else {
                if (highlight[j])
                  array.push(options[j]);
              }
            }
            if (array.length)
              selectOption(id, array.join('|'));
            else
              selectOption(id, null);
            setSelected(false);
            changeHighlight(highlight.map((item: boolean, index: number) => {
              if (index === numOptions - 1)
                return !item;
              else
                return item;
            }));
          }}
        >
          <Text style={styles.text}>{options[numOptions - 1]}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listWrapper}>
      {rowElements.map((Item) => (Item))}
      <View style={styles.orContainer}>
        <View style={styles.line}></View>
        <Text style={styles.or}>or</Text>
        <View style={styles.line}></View>
      </View>
      <TouchableOpacity
        style={[styles.optionBox, selected ? styles.activeOptionBox : {}]}
        onPress={() => {
          changeHighlight(highlight.map(() => (false)));
          selectOption(id, options[numOptions]);
          setSelected(true);
        }}
      >
        <View style={[styles.button, selected ? styles.activeButton : {}]}>
          <View style={selected ? styles.active : styles.inactive}></View>
        </View>
        <Text style={styles.text}>{options[numOptions]}</Text>
      </TouchableOpacity>
    </View>
  );
}