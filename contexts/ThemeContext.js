import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultContextValue = {
  darkMode: false,
  setDarkMode: () => {},
  useDeviceAppearance: false,
  setUseDeviceAppearance: () => {}
};
const ThemeContext = React.createContext(defaultContextValue);

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [useDeviceAppearance, setUseDeviceAppearance] = useState(false);
  const deviceTheme = useColorScheme(); // 'light' or 'dark'

  // Load the theme mode from AsyncStorage when the app starts
  useEffect(() => {
    const loadThemeFromStorage = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        const savedUseDeviceAppearance = await AsyncStorage.getItem('useDeviceAppearance');
        
        if (savedDarkMode !== null) {
          setDarkMode(JSON.parse(savedDarkMode));
        }
        if (savedUseDeviceAppearance !== null) {
          setUseDeviceAppearance(JSON.parse(savedUseDeviceAppearance));
        }
        console.log('loaded theme mode from async storage')
      } catch (error) {
        console.error("Failed to load theme mode from storage", error);
      }
    };

    loadThemeFromStorage();
  }, []);

  // Save the theme mode to AsyncStorage whenever it changes
  useEffect(() => {
    const saveThemeToStorage = async () => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
        await AsyncStorage.setItem('useDeviceAppearance', JSON.stringify(useDeviceAppearance));
        console.log('saved theme mode to async storage');
      } catch (error) {
        console.error("Failed to save theme mode to storage", error);
      }
    };

    saveThemeToStorage();
  }, [darkMode, useDeviceAppearance]);

  useEffect(() => {
    if (useDeviceAppearance) {
      setDarkMode(deviceTheme === 'dark');
    }
  }, [useDeviceAppearance, deviceTheme]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, 
    useDeviceAppearance, setUseDeviceAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeProvider, ThemeContext };
