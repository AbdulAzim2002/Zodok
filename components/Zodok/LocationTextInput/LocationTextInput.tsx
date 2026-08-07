import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Modal, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
// Adjust the import path if your shared package's exports are structured differently
import { getAllStates, getDistrictsByState } from '../../data/indian-locations';


const windowHeight = Dimensions.get('screen').height;

interface LocationTextInputProps {
  onLocationChange?: (location: { state: string; district: string | undefined }) => void;
  initialState?: string;
  initialDistrict?: string;
  stateLabel?: string;
  districtLabel?: string;
}

export const LocationTextInput: React.FC<LocationTextInputProps> = ({
  onLocationChange,
  initialState,
  initialDistrict,
  stateLabel = "State",
  districtLabel = "District",
}: LocationTextInputProps) => {

  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | undefined>(initialState);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [stateListVisible, setStateListVisible] = useState<boolean>(false);
  const [districtListVisible, setDistrictListVisible] = useState<boolean>(false);

  useEffect(() => {
    setStates(getAllStates());
  }, []);

  useEffect(() => {
    if (selectedState) {
      const newDistricts = getDistrictsByState(selectedState);
      setDistricts(newDistricts);
      // If an initialDistrict was provided and it's valid for the new state, set it.
      // Otherwise, reset or set to the first available district.
      if (initialDistrict && newDistricts.includes(initialDistrict) && selectedState === initialState) {
        setSelectedDistrict(initialDistrict);
      } else {
        setSelectedDistrict(undefined); // Or newDistricts[0] if you want to auto-select the first
      }
    } else {
      setDistricts([]);
      setSelectedDistrict(undefined);
    }
  }, [selectedState]);

  useEffect(() => {
    if (onLocationChange && selectedState) {
      onLocationChange({ state: selectedState, district: selectedDistrict });
    }
  }, [selectedState, selectedDistrict]);

  const handleStateChange = (itemValue: string | undefined) => {
    if (itemValue !== selectedState) {
      setSelectedState(itemValue);
      // District will be reset via the useEffect watching selectedState
    }
  };

  const handleDistrictChange = (itemValue: string | undefined) => {
    setSelectedDistrict(itemValue);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    pickerContainer: {
      borderColor: "#6b6b6b",
      borderRadius: 8,
      marginBottom: 16,
    },
    picker: {
      height: 50,
      width: '100%',
      // color: colors.textInput // if you want to style the text color inside picker
    },
    listText: {
      height: 20,
      marginVertical: 10,
      color: '#7b7b7b',
      fontFamily: 'CreatoDisplay',
      fontSize: 16,
    },
    listContainer: {
      backgroundColor: 'rgba(24, 24, 27, 0.8)', //'rgba(24, 24, 27, 0.8)',
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#6b6b6b",

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
    tint: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: '#303036',
      opacity: 0.9,
    },
    pickerBox: {
      backgroundColor: '#303036',
      borderColor: "#6b6b6b",
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 8,
      width: '100%',
      color: '#a3a3a3',
      fontFamily: 'CreatoDisplay',
      fontSize: 16,
      height: 48,
      alignItems: 'center',
      // justifyContent: 'center',
    },
    pickerBoxText: {
      color: "#7678ff",
      fontFamily: 'CreatoDisplay',
      fontSize: 16,
    },
    listWrapper: {

    },
    listHeader: {

    },
    listHeaderText: {
      color: "white",
      fontFamily: 'Creatoisplay',
      fontSize: 24,
      height: 30,
    },
    pickerBoxTextDisabled: {
      borderColor: "#6b6b6b",
      borderRadius: 8,
      width: '100%',
      color: '#a3a3a3',
      fontFamily: 'Creatoisplay',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>

      <View style={styles.pickerContainer}>
        <TouchableWithoutFeedback
          onPress={() => { setStateListVisible(true) }}
        >
          <View
            style={[{ borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', }, styles.pickerBox]}
          >
            <Text style={styles.pickerBoxText}>{selectedState ? selectedState : `Select ${stateLabel}...`}</Text>
            <Ionicons name="chevron-down-outline" style={styles.pickerBoxText} />
          </View>
        </TouchableWithoutFeedback>

        <Modal
          visible={stateListVisible}
          transparent={true}
          onRequestClose={() => { setStateListVisible(false) }}
        >
          <View
            style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <TouchableWithoutFeedback
              onPress={() => { setStateListVisible(false) }}
            >
              <View style={styles.tint} />
            </TouchableWithoutFeedback>
            <View style={[{ height: '80%', width: '80%' }, styles.listWrapper]}>
              <Text style={[styles.listText, styles.listHeaderText]}>Select {stateLabel}</Text>
              <FlatList
                style={styles.listContainer}
                data={states}
                nestedScrollEnabled={true}
                renderItem={({ item }: { item: string }) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      console.log(item);
                      handleStateChange(item);
                      setStateListVisible(false);
                    }}
                  >
                    <Text style={styles.listText}>{item}</Text>
                  </TouchableWithoutFeedback>
                )}
                getItemLayout={(data: ArrayLike<string> | null | undefined, index: number) => ({
                  length: styles.listText.height + 2 * styles.listText.marginVertical,
                  offset: (styles.listText.height + 2 * styles.listText.marginVertical) * (index),
                  index
                })}
              />
            </View>
          </View>
        </Modal>
      </View>

      {
        selectedState ?
          <View style={styles.pickerContainer}>
            <TouchableWithoutFeedback
              onPress={() => { setDistrictListVisible(true) }}
            >
              <View
                style={[{
                  borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', }, styles.pickerBox]}
              >
                <Text style={styles.pickerBoxText}>{selectedDistrict ? selectedDistrict : `Select ${districtLabel}...`}</Text>
                <Ionicons name="chevron-down-outline" style={styles.pickerBoxText} />
              </View>
            </TouchableWithoutFeedback>

            <Modal
              visible={districtListVisible}
              transparent={true}
              onRequestClose={() => { setDistrictListVisible(false) }}
            >
              <View
                style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}
              >
                <TouchableWithoutFeedback
                  onPress={() => { setDistrictListVisible(false) }}
                >
                  <View style={styles.tint} />
                </TouchableWithoutFeedback>
                <View style={[{ height: '80%', width: '80%' }, styles.listWrapper]}>
                  <Text style={[styles.listText, styles.listHeaderText]}>Select {districtLabel}</Text>
                  <FlatList
                    style={styles.listContainer}
                    data={districts}
                    nestedScrollEnabled={true}
                    renderItem={({ item }: { item: string }) => (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          console.log(item);
                          handleDistrictChange(item);
                          setDistrictListVisible(false);
                        }}
                      >
                        <Text style={styles.listText}>{item}</Text>
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
                      offset: 40 + (styles.listText.height + 2 * styles.listText.marginVertical) * (index),
                      index
                    })}
                  />
                </View>
              </View>
            </Modal>
          </View> :
          <View style={[styles.pickerContainer, styles.pickerBox, {justifyContent: 'center',} ]}>
            <Text style={[styles.pickerBoxText, styles.pickerBoxTextDisabled]}>{`Select ${districtLabel}...`}</Text>
          </View>
      }

    </View>
  );
};



export default LocationTextInput;
