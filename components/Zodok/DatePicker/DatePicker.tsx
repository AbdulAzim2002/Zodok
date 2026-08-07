import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Modal, FlatList, ScrollView, Platform, TextInput } from 'react-native';
import { useTheme, getColor, getSpacing, getBorderRadius, useThemedStyles, getFontFamily } from '../../../shared/';
import { Button } from '../Button/'
import { Ionicons } from '@expo/vector-icons';

type Parameters = {
  selectOption: (id: string, option: string) => void;
  id: string;
  initialState: (string | null);
  outerViewRef?: any;
}

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
let selectedDate: (null | number)[] = [currentYear - 20, currentMonth, null];
const DatePickerBoxWidth = 270;
const yearWidth = DatePickerBoxWidth / 3 - 8;

export const DatePicker = ({ selectOption, id, initialState, outerViewRef }: Parameters) => {
  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [calenderState, setCalenderState] = useState(false);
  const [month, setMonth] = useState<number | null>(currentMonth);
  const [year, setYear] = useState<number | null>(currentYear - 20);
  const [iosYear, setIosYear] = useState<string>(String(currentYear - 20));
  const [monthYearButton, setMonthYearButton] = useState(false);
  const [date, setDate] = useState([null, month, year]);
  const yearListRef = useRef<FlatList | null>(null);
  const years = Array.from({ length: 100 }, (_, i) => ((currentYear - 113) + i));
  const monthSelctorView = [];

  useEffect(() => {
    if (initialState) {
      selectedDate = initialState.split('-').map((e) => (Number(e)));
      setMonth(selectedDate[1]);
      setYear(selectedDate[0]);
      setDate([selectedDate[2], selectedDate[1], selectedDate[0]]);
    }
  }, []);
  const months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysInMonth = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const styles = useThemedStyles((tokens) => ({
    inputBox: {
      height: 48,
      paddingLeft: getSpacing(tokens, "padding.input"),
      paddingRight: getSpacing(tokens, "padding.card"),
      borderRadius: getBorderRadius(tokens, "input"),
      borderWidth: 1,
      borderColor: getColor(tokens, "border.input"),
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 0,
      flexDirection: 'row',
      backgroundColor: getColor(tokens, "bg.input"),
    },
    inputBoxDate: {
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.main'),
    },
    inputBoxDatePlaceHolder: {
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, "text.input_placeholder")
    },
    icon: {
      color: getColor(tokens, "text.main"),
      width: 18,
    },
    iconBox: {
      backgroundColor: getColor(tokens, "bg.option_hover"),
      padding: getSpacing(tokens, "padding.tagvertical"),
      borderRadius: getBorderRadius(tokens, "checkbox"),
    },
    DatePickerModal: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    DatePickerBoxContainer: {
      backgroundColor: getColor(tokens, "bg.screen"),
      position: 'absolute',
      padding: 10, //getSpacing(tokens, "padding.container")
      borderRadius: getBorderRadius(tokens, "card"),
      borderColor: getColor(tokens, "border.input"),
      borderWidth: 1,
      elevation: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
    },
    DatePickerBox: {
      width: DatePickerBoxWidth,
      gap: getSpacing(tokens, "gap.grid"),
    },
    DateBox: {
      height: 30,
      width: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    DateRowContainer: {
      width: '100%',
      justifyContent: 'space-around',
    },
    DateBoxSelected: {
      backgroundColor: getColor(tokens, "brand.primary"),
      borderRadius: getBorderRadius(tokens, "cardimage"),
      color: "white",
    },
    DateText: {
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.main'),
    },
    DateDisabled: {
      color: 'grey',
    },
    DayBox: {
      width: 38,
      // backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center'
    },
    DayRowContainer: {

    },
    DayText: {
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.main'),
      fontSize: 13,
      // width:100,

    },
    DatePickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    DatePickerHeaderText: {
      fontFamily: getFontFamily('regular'),
      color: getColor(tokens, 'text.help'),
      fontSize: 16,
    },
    DatePickerContentContainer: {
      gap: 16,
      width: DatePickerBoxWidth,
      height: 210,
    },
    DatePickerCloseButton: {
      backgroundColor: getColor(tokens, "bg.button.neutralsecondary"),
      borderRadius: getBorderRadius(tokens, "cardimage"),
      color: getColor(tokens, "text.main"),
      height: 26,
      width: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    MonthBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: getSpacing(tokens, "padding.card"),
      paddingVertical: getSpacing(tokens, "padding.card"),
      borderRadius: getBorderRadius(tokens, "cardimage"),
      borderColor: getColor(tokens, "border.input"),
      borderWidth: 1,
    },
    MonthBoxSelected: {
      backgroundColor: getColor(tokens, "brand.primary"),
      color: getColor(tokens, "text.bg.anydark"),
      fontFamily: getFontFamily('medium'),
    },
    MonthText: {
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.main'),
    },
    MonthContainer: {
      gap: getSpacing(tokens, "gap.minigrid")
    },
    MonthRowContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      gap: getSpacing(tokens, "gap.minigrid")
    },
    YearSelectorContainer: {
      alignItems: 'center',
    },
    YearListContainer: {
      width: 3 * yearWidth,
    },
    YearBox: {
      height: 30,
      width: yearWidth,
      justifyContent: 'center',
    },
    YearText: {
      textAlign: 'center',
      fontFamily: getFontFamily('medium'),
      color: getColor(tokens, 'text.main'),
      fontSize: 24,
    },
    YearSelectorOverlayContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      opacity: 0.5,
    },
    YearOverlay: {
      height: '100%',
      flexGrow: 1,
      backgroundColor: getColor(tokens, "bg.screen"),
    },
    YearSelectorSelectionBox: {
      height: '110%',
      width: 80,
      borderWidth: 1,
      borderRadius: getBorderRadius(tokens, "cardimage"),
      borderColor: getColor(tokens, "border.input"),
    },
    YearMonthSelectorBox: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: getColor(tokens, "bg.button.dropdown"),
      width: 160,
      borderRadius: getBorderRadius(tokens, "cardimage"),
      height: 26,
    },
    YearMonthSelectorText: {
      color: getColor(tokens, "text.dropdown"),
      fontFamily: getFontFamily('regular'),
    },
    YearMonthSelectorDropDown: {
      position: 'absolute',
      right: 0,
      alignSelf: 'center',
      paddingHorizontal: 4,
    },
    YearControlIcon: {
      fontSize: 22,
      color: 'white',
    },
    YearControlIconContainer: {
      height: 28,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: getColor(tokens, 'neutral.500'),
      borderRadius: 100,
      ...Platform.select({
        android: {
          backgroundColor: 'transparent',
        },
        ios: {
          backgroundColor: getColor(tokens, 'primary.500'),
        }
      }
      )
    },
    yearInput: {
      color: getColor(tokens, "text.dropdown"),
      fontFamily: getFontFamily('medium'),
      fontSize: 20,
      textAlign: 'center',
      width: 270,
      height: 40,
      borderRadius: getBorderRadius(tokens, "cardimage"),
      borderColor: getColor(tokens, "border.input"),
      borderWidth: 1,
    },
    tint: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: '#303036',
      opacity: 0.9,
    }
  }));
  const openDatePicker = () => {
    setDatePickerVisibility(true);
    console.log('Date picker opened');
  };
  const closeDatePicker = () => {
    setDatePickerVisibility(false);
    setCalenderState(false)
    setMonth(selectedDate[1]);
    setYear(selectedDate[0]);
    setDate([selectedDate[2], selectedDate[1], selectedDate[0]]);
    console.log('Selected date:', selectedDate);
    console.log('Date picker closed');
  };
  const numberOfDays = (month: number, year: number) => {
    const days = daysInMonth[month - 1];
    if (year % 4 == 0 && month == 2)
      return days + 1;
    else
      return days;

  };
  const firstDayofMonth = (month: number, year: number) => {
    let day = 6;
    const yearDifference = year - 2000;
    if (yearDifference >= 0)
      day = (day + yearDifference + Math.ceil(yearDifference / 4)) % 7;
    else
      day = (day + 7 - (-yearDifference + Math.floor(-yearDifference / 4)) % 7) % 7;
    for (let i = 0; i < month - 1; i++) {
      day = day + daysInMonth[i];
      if (i === 1) {
        if (year % 4 === 0)
          day++;
      }
    }
    day = day % 7;
    return day;
  };
  type calenderParam = {
    date: (number | null)[];
    month: number;
    year: number;
  };
  const Calender = ({ date, month, year }: calenderParam) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLength = numberOfDays(month, year);
    const monthRows: any = [];
    const monthRowsWithGap: any = [];
    let day = -firstDayofMonth(month, year);
    let previousMonthDate = numberOfDays((month + 10) % 12 + 1, year) + day;
    let nextMonthDate = 0;
    for (let i = 0; i < 6; i++) {
      const row: any = [];
      for (let j = 0; j < 7; j++) {
        day++;
        const thisDate = day;
        const thisMonth = month;
        const thisYear = year;
        if (day < 1) {
          previousMonthDate++;
          row.push(
            <View key={`${thisYear}-${(thisMonth + 10) % 12 + 1}-${previousMonthDate}`} style={styles.DateBox}>
              <Text style={[styles.DateText, styles.DateDisabled]}>{previousMonthDate}</Text>
            </View>
          )
        } else if (day > monthLength) {
          nextMonthDate++;
          row.push(
            <View key={`${thisYear}-${thisMonth % 12 + 1}-${nextMonthDate}`} style={styles.DateBox}>
              <Text style={[styles.DateText, styles.DateDisabled]}>{nextMonthDate}</Text>
            </View>
          )
        } else {
          row.push(
            <View key={`${thisYear}-${thisMonth}-${thisDate}`}>
              <TouchableWithoutFeedback onPress={() => { setDate([thisDate, month, year]) }}>
                {
                  day === date[0] && month === date[1] && year === date[2] ?
                    <View style={[styles.DateBox, styles.DateBoxSelected]}>
                      <Text style={[styles.DateText, styles.DateBoxSelected]}>{day}</Text>
                    </View> :
                    <View style={[styles.DateBox]}>
                      <Text style={[styles.DateText]}>{day}</Text>
                    </View>
                }
              </TouchableWithoutFeedback>
            </View>
          )
        }
      }
      monthRows.push(row);
    }
    monthRowsWithGap.push(
      <View key={'Days column'} style={[{ flexDirection: 'row' }, styles.DateRowContainer, styles.DayRowContainer]}>
        {weekDays.map((day: string) => (
          <View key={day} style={[styles.DateBox, styles.DayBox]}>
            <Text style={styles.DayText}>{day}</Text>
          </View>
        ))}
      </View>
    );

    for (let index in monthRows) {
      monthRowsWithGap.push(
        <View key={`month-days-row-${index + 1}`} style={[{ flexDirection: 'row' }, styles.DateRowContainer]}>
          {monthRows[index].map((e: any) => (e))}
        </View>
      )
    }
    return (
      <View>
        {monthRowsWithGap.map((items: any) => (items))}
      </View>
    )
  };
  for (let i = 0; i < 3; i++) {
    const temp = [];
    for (let j = 0; j < 4; j++) {
      temp.push(
        <TouchableWithoutFeedback
          key={months[i * 4 + j]}
          onPress={() => { setMonth(i * 4 + j + 1) }}
        >
          {
            month === i * 4 + j + 1 ?
              <View key={months[i * 4 + j]} style={[styles.MonthBox, styles.MonthBoxSelected]}>
                <Text style={[styles.MonthText, styles.MonthBoxSelected]}>{months[i * 4 + j].slice(0, 3)}</Text>
              </View> :
              <View key={months[i * 4 + j]} style={styles.MonthBox}>
                <Text style={styles.MonthText}>{months[i * 4 + j].slice(0, 3)}</Text>
              </View>
          }
        </TouchableWithoutFeedback>
      );
    }
    monthSelctorView.push(temp);
  }
  const handelInputChange = (otp: string) => {
    if (otp === '') {
      setIosYear(otp);
      return;
    }
    switch (otp[otp.length - 1]) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        break;
      default:
        return;

    }
    setIosYear(otp);
    if (otp.length === 4) {
      const selectedYear = Number(otp);
      if (selectedYear < currentYear - 13 && selectedYear > currentYear - 112) {
        setYear(selectedYear);
        setMonthYearButton(false);
      }
    } else
      setMonthYearButton(true);
  }

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={openDatePicker}
      >
        <View style={styles.inputBox}>
          {
            selectedDate[2] ?
              <Text style={styles.inputBoxDate}>{String(selectedDate[2]).padStart(2, "0")}/{String(selectedDate[1]).padStart(2, "0")}/{selectedDate[0]}</Text> :
              <Text style={styles.inputBoxDatePlaceHolder}>DD/MM/YYYY</Text>
          }
          <View style={styles.iconBox}>
            <Ionicons name="calendar-clear-outline" size={styles.icon.width} color={styles.icon.color} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={datePickerVisible}
        transparent={true}
      >
        <View style={styles.tint}></View>
        <View style={styles.DatePickerModal}>
          <View style={styles.DatePickerBoxContainer}>
            <View style={styles.DatePickerBox}>
              <View style={styles.DatePickerHeader}>
                <Text style={styles.DatePickerHeaderText}>Select your birth month</Text>
                <TouchableWithoutFeedback onPress={closeDatePicker}>
                  <View style={styles.DatePickerCloseButton}>
                    <Ionicons name="close-outline" size={20} color={styles.DatePickerCloseButton.color} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.DatePickerContentContainer}>
                <View style={styles.MonthContainer}>
                  {monthSelctorView.map((item, key) => (
                    <View
                      key={`monthRow:${key}`}
                      style={styles.MonthRowContainer}
                    >
                      {item.map((e) => (e))}
                    </View>
                  ))}
                </View>
                <View style={styles.DatePickerHeader}>
                  <Text style={styles.DatePickerHeaderText}>Select your birth year</Text>
                </View>
                {
                  Platform.OS === "ios" ?
                    <View style={styles.YearSelectorContainer}>
                      <TextInput
                        style={styles.yearInput}
                        value={iosYear}
                        maxLength={4}
                        inputMode='numeric'
                        onChangeText={handelInputChange}
                      />
                    </View> :
                    <View style={styles.YearSelectorContainer}>
                      <View style={styles.YearListContainer}>
                        <FlatList
                          ref={yearListRef}
                          data={years}
                          horizontal={true}
                          pagingEnabled={true}
                          snapToAlignment={'center'}
                          renderItem={({ item }: { item: number }) =>
                            <View style={styles.YearBox}>
                              <Text style={styles.YearText}>{item}</Text>
                            </View>
                          }
                          decelerationRate={0.95}
                          keyExtractor={(item: number) => String(item)}
                          ListHeaderComponent={<View style={[styles.YearBox, { width: yearWidth }]}></View>}
                          ListFooterComponent={<View style={[styles.YearBox, { width: yearWidth }]}></View>}
                          getItemLayout={(data: ArrayLike<number> | null | undefined, index: number) => ({ length: yearWidth, offset: yearWidth * (index + 1), index })}
                          showsHorizontalScrollIndicator={false}
                          scrollEventThrottle={50}
                          onScroll={(e: any) => {
                            const scrollpos = e.nativeEvent.contentOffset.x;
                            const index = Math.floor(scrollpos / yearWidth) + (scrollpos % yearWidth > yearWidth / 2 ? 1 : 0);
                            setYear(currentYear - 113 + index);
                          }}
                        />
                      </View>
                      <View style={styles.YearSelectorOverlayContainer} pointerEvents={"none"}>
                        <View style={styles.YearOverlay}></View>
                        <View style={styles.YearSelectorSelectionBox}></View>
                        <View style={styles.YearOverlay}></View>
                      </View>
                      <View style={styles.YearSelectorOverlayContainer} pointerEvents="box-none">
                        <TouchableWithoutFeedback
                          onPress={() => {
                            if (year) {
                              if (year > currentYear - 112)
                                yearListRef.current?.scrollToIndex({ index: year - currentYear + 111, animated: true });
                              else
                                yearListRef.current?.scrollToOffset({ offset: 0, animated: true });
                            }
                          }}
                        >
                          <View style={styles.YearControlIconContainer}>
                            <Ionicons name="chevron-back-outline" style={[styles.YearControlIcon, { textAlign: 'right', marginRight: 0 }]} />
                          </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            if (year)
                              yearListRef.current?.scrollToIndex({ index: year - currentYear + 113, animated: true });
                          }}
                        >
                          <View style={styles.YearControlIconContainer}>
                            <Ionicons name="chevron-forward-outline" style={[styles.YearControlIcon, { paddingLeft: 0 }]} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                }
              </View>
              <Button
                label={'Next'}
                variant="neutral"
                disabled={monthYearButton}
                onPress={
                  () => {
                    setCalenderState(false);
                    setDate([null, month, year]);
                  }
                }
              />
            </View>
          </View>
          {
            calenderState ?
              <View></View> :
              <View style={styles.DatePickerBoxContainer}>
                <View style={styles.DatePickerBox}>
                  <View style={styles.DatePickerHeader}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (year) {
                          if (year <= currentYear - 112)
                            yearListRef.current?.scrollToOffset({ offset: 0, animated: true });
                          else
                            yearListRef.current?.scrollToIndex({ index: year - currentYear + 112, animated: false });
                        }
                        setCalenderState(!calenderState)
                      }}
                    >
                      <View style={styles.YearMonthSelectorBox}>
                        <Text style={styles.YearMonthSelectorText}>{`${months[month ? month - 1 : 0]}, ${year}`}</Text>
                        <View style={styles.YearMonthSelectorDropDown}>
                          <Ionicons name="chevron-down-outline" size={16} color={styles.DatePickerCloseButton.color} />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={closeDatePicker}>
                      <View style={styles.DatePickerCloseButton}>
                        <Ionicons name="close-outline" size={20} color={styles.DatePickerCloseButton.color} />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.DatePickerContentContainer}>
                    {month !== null && year !== null &&
                      <Calender date={date} month={month} year={year} />
                    }
                  </View>
                  <Button
                    label={'Continue'}
                    variant="neutral"
                    disabled={!date[0]}
                    onPress={
                      () => {
                        selectedDate = [date[2], date[1], date[0]];
                        selectOption(id, selectedDate.join('-'));
                        console.log('Selected date:', selectedDate);
                        closeDatePicker();
                      }
                    }
                  />
                </View>
              </View>
          }
        </View>
      </Modal>

    </View>
  );
}