import React, { useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback} from 'react-native';
import TaskList from '../components/Tasks/TaskList';

import { TasksContext } from '../contexts/TasksContext';

const Home = () => {
  const { tasks } = useContext(TasksContext);
  
  return (
      <TouchableWithoutFeedback
        style={{backgroundColor:'red'}} onPress={() => {
        Keyboard.dismiss();
        }}>
      <View style={styles.container}>

        {/* Task List Component */}
        <TaskList tasks={tasks}/>

      </View>
      
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
  
export default Home;