import React, { useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback,
TouchableOpacity, Text } from 'react-native';
import TaskList from '../components/Tasks/TaskList';

import { TasksContext } from '../contexts/TasksContext';

const Home = () => {
  const { tasks } = useContext(TasksContext);
  
  return (
      <TouchableWithoutFeedback
        onPress={() => {
        Keyboard.dismiss();
        }}>
      <View style={styles.container}>

        {/* Task List Component */}
        <TaskList tasks={tasks}/>

        {/* Add Button */}
        <View style={styles.addButton.container}>
          <TouchableOpacity
            style={
              styles.addButton.button
            }
          >
            <Text style={styles.addButton.text}>+</Text>
          </TouchableOpacity>
        </View>

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
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    button:{
      marginBottom: 20,
      backgroundColor: '#34eb83',
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }, 
  }, 
});
  
export default Home;