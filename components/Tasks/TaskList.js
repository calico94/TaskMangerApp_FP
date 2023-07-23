import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Task from './Task.js';

function TaskList({ tasks }) {

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => 
      <Task task={item}/>}
    />
  );
}

const styles = StyleSheet.create({
  taskWrapper: {
    margin: 10,
    padding: 5,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },  
});
export default TaskList;