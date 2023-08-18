import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/Home';
import PomodoroTimer from './screens/PomodoroTimer';
import Settings from './screens/Settings';
import { TasksProvider, TasksContext } from './contexts/TasksContext.js';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext.js';
import { LightTheme, DarkTheme } from './styles/theme.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import * as Calendar from 'expo-calendar';
const Tab = createBottomTabNavigator();
import { Menu, MenuProvider, MenuOptions, MenuOption, 
MenuTrigger } from 'react-native-popup-menu';
import { useTheme }from '@react-navigation/native';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { BottomSheetProvider } from './contexts/BottomSheetContext.js';

export default function App() {
  // Get (or create if calender !exist yet) the app calendar
  const getAppCalendar = async () => {
    const calendarName = "Task Manager FP Calendar";
    let calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    let appCalendar = calendars.find(c => c.title === calendarName);

    if (!appCalendar) {
      let calendarId = await Calendar.createCalendarAsync({
        title: calendarName,
        color: '#2196F3',
        entityType: Calendar.EntityTypes.EVENT,
        source: { isLocalAccount: true, name: calendarName, type: 'default' },
        name: calendarName,
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      await AsyncStorage.setItem('appCalendarId', calendarId);
      return calendarId;
    } else {
      await AsyncStorage.setItem('appCalendarId', appCalendar.id);
      return appCalendar.id;
    }
  };

  //Reference: (Usage snippet From expo documention) 
  //https://docs.expo.dev/versions/latest/sdk/calendar/
  //Reauest calendar permission once when app starts
  useEffect(() => {
    (async () => {
      const { status, canAskAgain } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        // Fetch or create the app-specific calendar and store its ID
        const calendarId = await getAppCalendar();
        Platform.OS === 'ios' ? 
        console.log(`IOS_calendarId: ${calendarId}`) : 
        console.log(`Android_calendarId: ${calendarId}`);

        // // log calendars
        // const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        // console.log('Here are all your calendars:');
        // console.log({ calendars });

      } else if (status === null) {
        console.log(`status is null`);
      } else if (status === 'denied' && canAskAgain) {
        console.log(`status is denied`);
        // If status is denied and canAskAgain is true, 
        //prompt the user to grant permission by opening the
        //permission settings page for adding calendar events
        Alert.alert(
        'Calendar Permission Denied',
        `To access your calendar, we need your permission. \
  Please enable it in settings for auto syncing calendar events \
  with your tasks. \n Note: if you don't allow it, your added \
  tasks will not be synced with your calendar even if you \
  reanable it later.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ],
        );
      } else {
        console.log(`Calendar Pemission status: ${status}`);
        console.log(`canAskAgain?: ${canAskAgain}`);
      }
    })();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
    <ThemeProvider>
    <TasksProvider>
      <BottomSheetProvider>
        <MenuProvider>
          <Navigation />
        </MenuProvider>
      </BottomSheetProvider>

    </TasksProvider>
    </ThemeProvider>
    <Toast/>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Navigation() {
  const { darkMode } = useContext(ThemeContext);
  const { colors } = useTheme();
  const { showCompleted, toggleShowCompleted } = useContext(TasksContext);
  return (
    <NavigationContainer theme={darkMode ? 
      DarkTheme : LightTheme}>
      <StatusBar hidden={false} barStyle="dark-content" />

      <Tab.Navigator
      initialRouteName='Home' screenOptions={({ route }) => ({
        tabBarActiveTintColor:'#34eb83',
        tabBarInactiveTintColor:'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'PomodoroTimer') {
            iconName = focused ? 'timer' : 'timer-outline'; 
          } else if(route.name === 'Settings'){
            iconName = focused ? 'settings' : 'settings-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      >
          <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{ 
              title: 'My home',
              headerRight: () => (
                <Menu>
                  <MenuTrigger>
                    <Ionicons 
                      name="ellipsis-horizontal" 
                      size={24}
                      padding={10}
                    />
                  </MenuTrigger>
                  <MenuOptions
                  customStyles={{
                    optionsContainer:{
                      borderRadius: 10,
                      padding:10,
                    }
                  }}>
                    <MenuOption onSelect={toggleShowCompleted}
                    text={showCompleted ? "Hide Completed" : 
                    "Show Completed"} 
                    customStyles={{
                      optionWrapper: {
                        // padding: 20,
                      },
                      optionText: {
                        color: colors.text,
                        fontSize: 15,
                      },
                    }}/>
                  </MenuOptions>
                </Menu>
              )
            }}
          />
        <Tab.Screen name="PomodoroTimer" component={PomodoroTimer} />
        <Tab.Screen name="Settings" component={Settings} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
