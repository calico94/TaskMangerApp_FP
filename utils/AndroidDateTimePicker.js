import React, { useState, useEffect } from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const AndroidDateTimePicker = ({ mode, onDateTimePicked, currentValue }) => {
  const onChange = (event, selectedDateOrTime) => {
    const currentSelected = selectedDateOrTime || currentValue;
    onDateTimePicked(currentSelected);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: currentValue,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const getButtonTitle = () => {
    if (mode === 'date') {
      return `${currentValue.toLocaleDateString()}`;
    } else if (mode === 'time') {
      return `${currentValue.toLocaleTimeString()}`;
    }
    return 'Set DateTime';
  };

  return (
    <SafeAreaView>
      <Button onPress={mode === 'date' ? showMode.bind(this, 'date') : showMode.bind(this, 'time')} title={getButtonTitle()} />
    </SafeAreaView>
  );
};

export default AndroidDateTimePicker;
