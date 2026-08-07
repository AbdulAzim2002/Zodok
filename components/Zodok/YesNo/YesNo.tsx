import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, Modal, ImageSourcePropType } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';
import { Video } from '../Video'
import { Ionicons } from '@expo/vector-icons';

type Parameters = {
  options?: ({text?: (string[] | null), textBox?: boolean, video?: { option: string, url: string, thumbnail?: ImageSourcePropType  }} | null);
  selectOption: (id: string, option: string | string[]) => void;
  id: string;
  initialState: (string | string[] | null);
}

// const videoSource = {useCaching: true, assetId: require('./Recording.mp4')};

export const YesNo = ({ selectOption, id, initialState, options }: Parameters) => {
  const option = ['Yes', 'Maybe', 'No'];
  let renderMaybe = true;
  let displayText = ['Yes', 'Maybe', 'No'];
  let textBox = false;
  const videoSource = {useCaching: false, uri: options ? (options.video ? options.video.url: 'http://') : 'http://'};
  if (options) {
    displayText = options.text ? options.text : ['Yes', 'Maybe', 'No'];
    textBox = options.textBox ? options.textBox : false;
    if (options.text) {
      if (options.text.length < 3)
        renderMaybe = false;
    }
  }
  const initialFeedback = initialState ? 
    Array.isArray(initialState) ? initialState[1] : null : 
    null;
  const index = initialState ? 
    Array.isArray(initialState) ? 
      option.findIndex((item) => (item === initialState[0])) : 
      option.findIndex((item) => (item === initialState)) : 
    -1;
  const { tokens, theme } = useTheme();
  const [feedback, setfeedback] = useState<string | null>(initialFeedback);
  const [highlight, changeHighlight] = useState(index);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);

  const displayVideo = (option: string) => {
    if(options) {
      if(options.video) {
        if(options.video.option === option) {
          setVideoVisible(true);
        } 
      }
    }
  };
  const closeVideo = () => {
    setVideoVisible(false);
  };

  const styles = useThemedStyles((tokens) => ({
    container: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: getSpacing(tokens, 'gap.grid'),
    },
    optionBox: {
      flex: 1,
      flexDirection: 'row',
      gap: getSpacing(tokens, 'gap.grid'),
      padding: getSpacing(tokens, 'padding.button'),
      borderRadius: getBorderRadius(tokens, 'button'),
      borderWidth: 1,
    },
    yes: {
      backgroundColor: getColor(tokens, 'bg.button.success'),
      borderColor: getColor(tokens, 'border.success'),
    },
    maybe: {
      backgroundColor: getColor(tokens, 'bg.button.warning'),
      borderColor: getColor(tokens, 'border.warning'),
    },
    no: {
      backgroundColor: getColor(tokens, 'bg.button.error'),
      borderColor: getColor(tokens, 'border.error'),
    },
    yesActive: {
      backgroundColor: getColor(tokens, 'bg.button.success_active'),
      borderColor: getColor(tokens, 'border.success_active'),
    },
    maybeActive: {
      backgroundColor: getColor(tokens, 'bg.button.warning_active'),
      borderColor: getColor(tokens, 'border.warning_active'),
    },
    noActive: {
      backgroundColor: getColor(tokens, 'bg.button.error_active'),
      borderColor: getColor(tokens, 'border.error_active'),
    },
    text: {
      color: getColor(tokens, 'text.main'),
      fontFamily: getFontFamily('regular'),
      fontSize: 16,
    },
    yesText: {
      color: getColor(tokens, 'text.success'),
    },
    maybeText: {
      color: getColor(tokens, 'text.warning'),
    },
    noText: {
      color: getColor(tokens, 'text.error'),
    },
    input: {
      borderWidth: 1,
      borderColor: getColor(tokens, 'border.input'),
      borderRadius: getBorderRadius(tokens, 'input'),
      padding: getSpacing(tokens, 'padding.input'),
      fontSize: 16,
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.input_main'),
      backgroundColor: getColor(tokens, 'bg.input'),
    },
    feedbackBox: {
      marginTop: 16,
      gap: 16,
    },
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={highlight === 0 ? [styles.optionBox, styles.yesActive] : [styles.optionBox, styles.yes]}
        onPress={() => {
          if (feedback?.length)
            selectOption(id, ['Yes', feedback]);
          else
            selectOption(id, 'Yes');
          displayVideo('Yes');
          changeHighlight(0);
        }}
      >
        <Ionicons name="checkmark-outline" size={20} style={styles.yesText} />
        <Text style={[styles.text, styles.yesText]}>{displayText[0]}</Text>
      </TouchableOpacity>

      {
        renderMaybe &&
        (<TouchableOpacity
          style={highlight === 1 ? [styles.optionBox, styles.maybeActive] : [styles.optionBox, styles.maybe]}
          onPress={() => {
            if (feedback?.length)
              selectOption(id, ['Maybe', feedback]);
            else
              selectOption(id, 'Maybe');
            displayVideo('Maybe');
            changeHighlight(1);
          }}
        >
          <Ionicons name="alert-circle-outline" size={20} style={styles.maybeText} />
          <Text style={[styles.text, styles.maybeText]}>{displayText[1]}</Text>
        </TouchableOpacity>)
      }

      <TouchableOpacity
        style={highlight === 2 ? [styles.optionBox, styles.noActive] : [styles.optionBox, styles.no]}
        onPress={() => {
          if (feedback?.length)
            selectOption(id, ['No', feedback]);
          else
            selectOption(id, 'No');
          displayVideo('No');
          changeHighlight(2);
        }}
      >
        <Ionicons name="ban-outline" size={20} style={styles.noText} />
        <Text style={[styles.text, styles.noText]}>{renderMaybe ? displayText[2] : displayText[1]}</Text>
      </TouchableOpacity>
      {
        textBox && (
          <View style={styles.feedbackBox}>
            <Text style={styles.text}>We need your opinion?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Feedback"
              value={feedback ? feedback : ''}
              placeholderTextColor={getColor(tokens, 'text.input_placeholder')}
              keyboardType="default"
              autoCapitalize="none"
              multiline={true}
              numberOfLines={5}
              maxLength={250}
              onChangeText={(text: string) => {
                if (highlight != -1)
                  selectOption(id, [option[highlight], text]);
                console.log(text, highlight != -1 && highlight);
                setfeedback(text);
              }}
            />
          </View>
        )
      }
      {
        (options ? (options.video ? true : false) : false) &&
        (<Modal
          visible={videoVisible}
          onRequestClose={closeVideo}
          transparent={true}
        >
          <Video videoSource={videoSource} closeVideo={closeVideo} thumbnail={options?.video?.thumbnail} />
        </Modal>)
      }
    </View>
  );
}