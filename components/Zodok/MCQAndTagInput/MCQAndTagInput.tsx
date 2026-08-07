import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback, Keyboard, Platform, Dimensions, Pressable } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';
import brands from './brands'
import { Ionicons } from '@expo/vector-icons';

type Parameters = {
  selectOption: (id: string, option: (string | null)) => void;
  options: string[];
  id: string;
  initialState: (string | null);
  setOuterScrollEnabled: (scrolEnabled: boolean) => void;
}

type Parameters1 = {
  selectOption: (array: string[], flag: boolean) => void;
  options: string[];
  id: string;
  initialState: string[];
}

type Parameters2 = {
  selectOption: (array: string[], flag: boolean) => void;
  id: string;
  initialState: string[];
}

const MSQ = ({ id, selectOption, options, initialState }: Parameters1) => {
  const numOptions = options.length;
  const [highlight, changeHighlight] = useState(() => {
    const array: boolean[] = [];
    if (initialState) {
      const initalArray = initialState;
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
  const rowElements: any[] = [];
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
      // paddingVertical: getSpacing(tokens, 'padding.button'),
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
      borderRadius: getBorderRadius(tokens, 'button'),
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.option_selected'),
      backgroundColor: getColor(tokens, 'bg.option_selected'),
    },
    inactive: {
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.option'),
      backgroundColor: getColor(tokens, 'bg.button.neutralsecondary'),
    },
    text: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16,
    },
    OptionText: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 12.5,
    }
  }));

  for (let i = 0; i < numOptions; i = i + 3) {
    const tempRow: any[] = [];
    for (let j = 0; j < 3; j++) {
      if (numOptions > i + j)
        tempRow.push(
          <TouchableOpacity
            key={i + j + ',' + options[i + j]}
            style={[styles.optionBox, highlight[i + j] ? styles.active : styles.inactive]}
            onPress={() => {
              const array: string[] = [];
              for (let k = 0; k < numOptions; k++) {
                if (k === i + j) {
                  if (!highlight[k])
                    array.push(options[k]);
                } else {
                  if (highlight[k])
                    array.push(options[k]);
                }
              }
              selectOption(array, true);
              changeHighlight(highlight.map((item: boolean, index: number) => {
                if (index === i + j)
                  return !item;
                else
                  return item;
              }));
            }}
          >
            <Text style={styles.OptionText}>{options[i + j]}</Text>
          </TouchableOpacity>
        );
      else
        tempRow.push(<View key={'padding-element'} style={{ flex: 1, padding: 16 }}></View>);
    }
    rowElements.push(
      <View
        key={id + ':' + options[i]}
        style={styles.columnWrapper}
      >
        {tempRow.map((Item) => (Item))}
      </View>
    );
  }

  return (
    <View style={styles.listWrapper}>
      {rowElements.map((Items) => (Items))}
    </View>
  );
}

const TagInput = ({ selectOption, id, initialState }: Parameters2) => {
  const array = ['Zodok', 'Nike', 'Adidas', 'Snitch'];                   //Brand name for place holder
  const [tags, changeTags] = useState(initialState);
  const [result, setResult] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [listOffset, setListOffset] = useState(Dimensions.get('window').height / 2);
  const [listHeight, setListHeight] = useState(Dimensions.get('window').height / 2);
  const tagElements: any[] = [];
  const list = React.useRef<View | null>(null);
  const [placeHolderText, setPlaceHolderText] = useState(`Type "${array[0]}"`);
  let placeHolderIndex = 0;
  const typeSpeed = 50;

  useEffect(() => {
    const keyboardApperHndler = Keyboard.addListener('keyboardDidShow', () => {
      const height = Keyboard ? Keyboard.metrics()?.height : 0;
      setListHeight((Dimensions.get('window').height - (height ? height : 0)) / 2);
    });
  }, []);

  const placeHolderHandler = () => {
    const prevLen = array[placeHolderIndex].length;
    for (let i = prevLen; i >= 0; i--) {
      setTimeout(() => { setPlaceHolderText(`Type "${array[placeHolderIndex].slice(0, i)}"`) }, (prevLen - i) * 100);
    }
    setTimeout(() => { placeHolderIndex = (placeHolderIndex + 1) % array.length }, prevLen * 100 + 10);
    const nextLen = array[(placeHolderIndex + 1) % array.length].length;
    for (let i = 0; i <= nextLen; i++) {
      setTimeout(() => { setPlaceHolderText(`Type "${array[placeHolderIndex].slice(0, i)}"`) }, (prevLen + i) * 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      placeHolderHandler()
    }, 5000);
    return (() => {
      clearInterval(interval);
    });
  }, []);

  useLayoutEffect(() => {
    list.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setListOffset(height);
    });
  }, [text]);

  const findMatch = (text: string) => {
    let count = 0;
    const result: string[] = [];
    const filter = text.toUpperCase();
    for (let item in brands) {
      if (brands[item].toUpperCase().indexOf(filter) > -1) {
        result.push(brands[item]);
        count++;
      }
    }
    setResult(
      result.filter((item) => {
        for (let index in tags) {
          if (tags[index] === item)
            return false;
        }
        return true;
      }
      ));
  }

  const styles = useThemedStyles((tokens: any) => ({
    container: {
      gap: getSpacing(tokens, 'gap.inputsystem'),
    },
    input: {
      height: 48,
      // paddingVertical: 5,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: getSpacing(tokens, 'padding.input'),
      borderRadius: getBorderRadius(tokens, 'input'),
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.input'),
      backgroundColor: getColor(tokens, 'bg.input'),
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: getSpacing(tokens, 'gap.grid'),
    },
    tag: {
      paddingLeft: getSpacing(tokens, 'padding.button'),
      paddingRight: getSpacing(tokens, 'padding.card'),
      paddingVertical: getSpacing(tokens, 'padding.card'),
      // paddingBottom: getSpacing(tokens, 'padding.card'),
      flexDirection: 'row',
      backgroundColor: getColor(tokens, 'brand.secondary'),
      borderRadius: getBorderRadius(tokens, 'button'),
      gap: getSpacing(tokens, 'gap.heading_to_heading'),
      justifyContent: 'center',
      alignItems: 'center'
    },
    listContainer: {
      backgroundColor: getColor(tokens, 'bg.input'), //'rgba(24, 24, 27, 0.8)',
      paddingHorizontal: getSpacing(tokens, 'padding.container'),
      borderRadius: getBorderRadius(tokens, 'button'),
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.input'),
      width: '100%',
      // height: listHeight,

      ...Platform.select({
        web: {

          scrollbarWidth: 'auto',
          scrollbarColor: 'transparent',

          // Hide scrollbar arrows/buttons
          '::-webkit-scrollbar-button': {
            display: 'none',
          },
          '::-webkit-scrollbar-button:start:decrement': {
            display: 'none',
          },
          '::-webkit-scrollbar-button:end:increment': {
            display: 'none',
          },

          // Keep the scrollbar track and thumb visible
          '::-webkit-scrollbar': {
            width: '12px',
          },
          '::-webkit-scrollbar-track': {
            background: '#ffc200',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#ffc200',
            borderRadius: '6px',
          },
        },
      }
      ),
    },
    text: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 15
    },
    listText: {
      height: 19.5,
      marginVertical: 8,
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16,
    },
    tagText: {
      color: getColor(tokens, 'text.bg.tertiarylight'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16
    },
    placeholdertext: {
      color: getColor(tokens, 'text.input_placeholder'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16,
    }

  }));

  for (let i = 0; i < tags.length; i++) {
    tagElements.push(
      <View key={id + i + tags[i] + 'tagInput'} style={styles.tag}>
        <Text style={styles.tagText}>{tags[i]}</Text>
        <TouchableWithoutFeedback
          style={{ borderRadius: '50%' }}
          onPress={() => {
            selectOption(tags.filter((item: string, index: number) => (index !== i)), false);
            changeTags(tags.filter((item: string, index: number) => (index !== i)));
          }}
        >
          <Ionicons name="close-outline" size={20} color={"#2A3300"} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Don't see you favourite brands? Add them here</Text>
      <TextInput
        style={styles.input}
        value={text}
        placeholder={placeHolderText}
        placeholderTextColor={styles.placeholdertext.color}
        onChangeText={(str: string) => {
          setText(str);
          findMatch(str);
        }}
        onSubmitEditing={() => {
          if (result.length > 0) {
            selectOption([...tags, result[0]], false);
            changeTags([...tags, result[0]]);
            setText('');
            setResult([]);
          }
        }}
      />
      <View style={styles.tagContainer}>
        {tagElements.map(item => item)}
      </View>
      <View
        ref={list}
        style={{
          width: '100%',
          position: 'absolute',
          top: -(listOffset + 12),
        }}
      >
        {
          result.length !== 0 &&
          (
            <FlatList
              style={[styles.listContainer, { maxHeight: listHeight }]}
              data={result}
              nestedScrollEnabled={true}
              renderItem={({ item }: { item: string }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    let flag = true;
                    for (let index in tags) {
                      if (tags[index] === item) {
                        flag = false;
                        break;
                      }
                    }
                    if (flag) {
                      selectOption([...tags, item], false);
                      changeTags([...tags, item]);
                    }
                    setText('');
                    setResult([]);
                  }}
                >
                  <Text style={[styles.listText]}>{item}</Text>
                </TouchableWithoutFeedback>
              )}
              ListHeaderComponent={<View style={{
                height: 4,
              }}></View>}
              ListFooterComponent={<View style={{
                height: 4,
              }}></View>}
              getItemLayout={(data: ArrayLike<string> | null | undefined, index: number) => ({
                length: styles.listText.height + 2 * styles.listText.marginVertical,
                offset: (styles.listText.height + 2 * styles.listText.marginVertical) * index + 4,
                index
              })}
            />
          )
        }

      </View>
    </View>
  );
}

export const MCQAndTagInput = ({ selectOption, options, id, initialState, setOuterScrollEnabled }: Parameters) => {

  const initialArray: string[] = initialState ? initialState.split('|') : [];
  const tags1: string[] = [];
  const tags2: string[] = [];
  let string1: string = '';
  let string2: string = '';

  let flag: boolean = true;
  for (const itemIndex in initialArray) {
    if (flag) {
      for (const optionIndex in options) {
        flag = false;
        if (initialArray[itemIndex] === options[optionIndex]) {
          flag = true;
          tags1.push(initialArray[itemIndex]);
          break;
        }
      }
      if (!flag)
        tags2.push(initialArray[itemIndex]);
    } else {
      tags2.push(initialArray[itemIndex]);
    }
  }

  if (initialState) {
    string1 = tags1.join('|');
    string2 = tags2.join('|');
  }

  const submit = (array: string[], flag: boolean) => {
    if (flag) {
      string1 = array.join('|');
    } else {
      string2 = array.join('|');
    }

    if (string1.length > 0) {
      if (string2.length > 0)
        selectOption(id, [string1, string2].join('|'));
      else
        selectOption(id, string1.length > 0 ? string1 : null);
    } else
      selectOption(id, string2.length > 0 ? string2 : null);
  }
  const styles = useThemedStyles((tokens) => ({
    container: {
      gap: getSpacing(tokens, 'gap.subsection'),
    },
    text: {
      color: getColor(tokens, 'text.help'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16
    },
    orContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    line: {
      height: 0.5,
      borderRadius: 1,
      borderColor: getColor(tokens, 'text.help'),
      backgroundColor: getColor(tokens, 'text.help'),
      flex: 1,
    }
  }));

  return (
    <View style={styles.container}>
      <MSQ
        id={id}
        options={options}
        initialState={tags1}
        selectOption={submit}
      />
      <View style={styles.orContainer}>
        <View style={styles.line}></View>
        <Text style={styles.text}>or</Text>
        <View style={styles.line}></View>
      </View>
      <TagInput
        id={id}
        initialState={tags2}
        selectOption={submit}
      />
    </View>
  );
}