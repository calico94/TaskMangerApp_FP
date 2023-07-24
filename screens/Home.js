import React, { useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback,
TouchableOpacity, Text } from 'react-native';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import { TasksContext } from '../contexts/TasksContext';
import { useBottomSheet } from '../contexts/BottomSheetContext';

const Home = () => {
  const { tasks } = useContext(TasksContext);
  const { expand } = useBottomSheet();
  return (
      <TouchableWithoutFeedback
        onPress={() => {
        Keyboard.dismiss();
        }}>
      <View style={styles.container}>

        {/* Task List Component */}
        <TaskList tasks={tasks}/>
        <TaskForm />
        {/* Add Button */}
        <View style={styles.addButton.container}>
          <TouchableOpacity
            style={
              styles.addButton.button
            }
            onPress={()=> {
              try{  
                expand();
              }catch(error){
                console.log('Error occurred on pressing:', error)
            }}}
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
      zIndex: -1,
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