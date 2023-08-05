import React, { useContext, useState } from 'react';
import { View, Switch, Text, StyleSheet, Appearance, Button } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { useTheme } from '@react-navigation/native';
function SettingsPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
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
        }}
        />
      </View>
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
