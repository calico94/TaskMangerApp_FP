import React, { useContext, useState } from 'react';
import { View, Switch, Text, StyleSheet, Appearance, Button } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { useTheme } from '@react-navigation/native';
import { TasksContext, TasksDispatchContext } from '../contexts/TasksContext';
function SettingsPage() {
  const { darkMode, setDarkMode, useDeviceAppearance, 
    setUseDeviceAppearance } = useContext(ThemeContext);
  const { importSampleData, removeSampleData } = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={[{color: colors.text},
          styles.text]}>Dark Mode</Text>
        <Switch 
          value={darkMode}
          onValueChange={(value) => {
          setDarkMode(value);
          if (value) {
            setUseDeviceAppearance(false); // turn off useDeviceAppearance when darkMode is turned on
          }
        }}
        disabled={useDeviceAppearance}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={[{color: colors.text},
          styles.text]}>Use Device Appearance</Text>
        <Switch 
          value={useDeviceAppearance}
          onValueChange={(value) => {
            console.log(Appearance.getColorScheme());
            setUseDeviceAppearance(value);
            if (value) {
              // Get device appearance and setDarkMode
              setDarkMode(Appearance.getColorScheme() === 'dark');
              // turn off darkMode when useDeviceAppearance is turned on
              setDarkMode(false);  
            }
          }}
        />
      </View>
      <Button onPress={() => importSampleData(dispatch)}
      title='Import Sample Data for testing'/>
      <Button onPress={() => removeSampleData(dispatch)}
      title='Remove Sample Data for testing' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default SettingsPage;
