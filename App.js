import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/Home';
import PomodoroTimer from './screens/PomodoroTimer';
import Settings from './screens/Settings';
import { TasksProvider, TasksContext } from './contexts/TasksContext.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
const Tab = createBottomTabNavigator();
import { Menu, MenuProvider, MenuOptions, MenuOption, 
MenuTrigger } from 'react-native-popup-menu';
import { useTheme }from '@react-navigation/native';
import { BottomSheetProvider } from './contexts/BottomSheetContext.js';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
    <TasksProvider>
      <BottomSheetProvider>
        <MenuProvider>
          <Navigation />
        </MenuProvider>
      </BottomSheetProvider>

    </TasksProvider>
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
  const { colors } = useTheme();
  const { showCompleted, toggleShowCompleted } = useContext(TasksContext);
  return (
    <NavigationContainer>
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
