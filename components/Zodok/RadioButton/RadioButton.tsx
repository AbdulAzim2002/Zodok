import React, { useState} from 'react';
import { View, Text, TouchableOpacity, FlatList} from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';

type Parameters = {
  selectOption: (id: string, option: string) => void;
  options: string[];
  id: string;
  initialState: (string|null);
  columns?: number;
}

export const RadioButton = ({selectOption, options, id, initialState, columns=2}: Parameters) => {

  const index = initialState ? options.findIndex((item)=>(item === initialState)) : -1;
  const [highlight, changeHighlight] = useState(index);
  const numOptions = options.length;
  const numRow = Math.floor(numOptions/columns);
  const remainder = numOptions%columns;
  const rowElements : any[] = [];
  const isOddLength = numOptions%2 == 1; 
  const { tokens, theme } = useTheme();

  const styles = useThemedStyles((tokens) => ({
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
    text: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 15,
    },
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
      borderColor:getColor(tokens, 'border.option'),
    },
    activeOptionBox: {
      backgroundColor: getColor(tokens, 'bg.option_selected'),
      borderColor:getColor(tokens, 'border.option_selected'),
    }
  }));

  for(let i=0; i<numRow; i++) {
    const cells: any[] = [];
      for(let j=0; j<columns; j++) {
        cells.push(
          <TouchableOpacity
            style={[styles.optionBox, highlight === i*columns+j ? styles.activeOptionBox : {}]}
            onPress={() => {changeHighlight(i*columns+j); selectOption(id, options[i*columns+j])}}
            key={j}
          >
            <View style={[styles.button,  highlight === i*columns+j ? styles.activeButton : {}]}>
              <View style={highlight === i*columns+j ? styles.active : styles.inactive}></View>
            </View>
            <Text style={styles.text}>{options[i*columns+j]}</Text>
          </TouchableOpacity>
        )
      }
    rowElements.push(
      <View 
        key={i}
        style={styles.columnWrapper}
      >
        {cells.map((item)=>item)}
      </View>
    );
  }

  if(remainder) {
    const cells: any[] = [];
    for(let i=0; i<remainder; i++) {
      cells.push(
        <TouchableOpacity
          style={[styles.optionBox, highlight === numRow*columns+i ? styles.activeOptionBox : {}]}
          onPress={() => {changeHighlight(numRow*columns+i); selectOption(id, options[numRow*columns+i])}}
          key={i}
        >
          <View style={[styles.button,  highlight === numRow*columns+i ? styles.activeButton : {}]}>
            <View style={highlight === numRow*columns+i ? styles.active : styles.inactive}></View>
          </View>
          <Text style={styles.text}>{options[numRow*columns+i]}</Text>
        </TouchableOpacity>
      )
    }
    rowElements.push(
      <View 
        key={numRow}
        style={styles.columnWrapper}
      >
        <TouchableOpacity
          style={[styles.optionBox, highlight === numOptions-1 ? styles.activeOptionBox : {}]}
          onPress={() => {changeHighlight(numOptions-1); selectOption(id, options[numOptions-1])}}
        >
            <View style={[styles.button,  highlight === numOptions-1 ? styles.activeButton : {}]}>
              <View style={highlight === numOptions-1 ? styles.active : styles.inactive}></View>
            </View>
            <Text style={styles.text}>{options[numOptions-1]}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listWrapper}>
      {rowElements.map((Item)=>(Item))}
    </View>
  );
}