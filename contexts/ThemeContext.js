import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const defaultContextValue = {
  darkMode: false,
  setDarkMode: () => {},
};
const ThemeContext = React.createContext(defaultContextValue);

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const deviceTheme = useColorScheme(); // 'light' or 'dark'

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeProvider, ThemeContext };
