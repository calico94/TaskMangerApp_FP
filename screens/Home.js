import React, { useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback,
TouchableOpacity, Text } from 'react-native';
import TaskList from '../components/Tasks/TaskList';

import { TasksContext } from '../contexts/TasksContext';
import TaskFilterSearch from '../components/Tasks/TaskFilterSearch';
import TaskForm from '../components/Tasks/TaskForm';
import { useBottomSheet } from '../contexts/BottomSheetContext';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const isAndroid = Platform.OS === 'android';
const buttonSize = windowWidth * 0.15;
const Home = () => {
  const { tasks, showCompleted } = useContext(TasksContext);
  const [displayedTasks, setDisplayedTasks] = useState(tasks);
  const { expand } = useBottomSheet();
  useEffect(() => {
    setDisplayedTasks(showCompleted ? tasks : 
      tasks.filter(task => !task.done));
  }, [tasks, showCompleted]);

  return (
      <TouchableWithoutFeedback
        onPress={() => {
        Keyboard.dismiss();
        }}>
      <View style={styles.container}>
        {/* Filter and Search Component */}
        <TaskFilterSearch 
        updateDisplayedTasks={setDisplayedTasks} />
        {/* Task List Component */}
        <TaskList tasks={displayedTasks}/>
        <TaskForm />
        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton.button}
          onPress={() => {
            try {  
              expand();
            } catch(error) {
              console.log('Error occurred on pressing:', error)
            }
          }}
        >
        <Text style={styles.addButton.text}>+</Text>
      </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  addButton: {
    text: {
      color: 'white',
      fontSize: 32,
    },
    button: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: '#34eb83',
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: -1,
    }, 
  },
});

export default Home;