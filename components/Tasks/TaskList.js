import React, { useState, useContext, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { TasksContext, TasksDispatchContext } from '../../contexts/TasksContext.js';
import Task from './Task.js';
import { Swipeable } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Dimensions } from 'react-native';

const windoWidth = Dimensions.get('window').width;
function TaskList({ tasks }) {
  const dispatch = useContext(TasksDispatchContext)
  const handleDelete = useCallback((id) => {
    dispatch({ type: 'deleted', id });

    // Show toast message after successful delete
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Task deleted',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
      // bottomOffset: 40
    });
  }, [dispatch]);

  // Swipe Left to delete, render delete button at the right end
  const renderRightAction = useCallback((id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(id)}>
        <Text style={styles.deleteButton.text}>Delete</Text>
      </TouchableOpacity>
    );
  }, [handleDelete]);

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Swipeable renderRightActions={() => 
        renderRightAction(item.id)}>
            <Task task={item} />
        </Swipeable>
      )}
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
  deleteButton: {
    backgroundColor: '#eb2323',
    borderRadius: 5,
    justifyContent: 'center',
    width: windoWidth *.15,
    text: {
      color: 'white',
      alignSelf: 'center',
    }
  },
});
export default TaskList;