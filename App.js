import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/Home';
import PomodoroTimer from './screens/PomodoroTimer';
import settings from './screens/Settings';
import { TasksProvider, TasksContext } from './contexts/TasksContext.js';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
      <StatusBar />

        <Tab.Navigator
        initialRouteName='Home' screenOptions={({ route }) => ({
          tabBarActiveTintColor:'#34eb83',
          tabBarInactiveTintColor:'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Timer') {
              iconName = focused ? 'timer' : 'timer-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Timer" component={PomodoroTimer} />
          <Tab.Screen name="Settings" component={settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </TasksProvider>
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
