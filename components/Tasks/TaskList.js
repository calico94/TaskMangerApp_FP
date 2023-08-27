import React, { useState, useContext, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { TasksContext, TasksDispatchContext } from '../../contexts/TasksContext.js';
import Task from './Task.js';
import { Swipeable } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';

const windowWidth = Dimensions.get('window').width;
function TaskList({ tasks }) {
  const dispatch = useContext(TasksDispatchContext)
  const handleDelete = useCallback(async (taskId) => {
    try {
      const calendarId = await AsyncStorage
      .getItem('appCalendarId');
  
      if (!calendarId) {
        console.warn('No Calendar ID found');
        return;
      }
      // Find the task in order to access its calendarEventId
      const taskToDelete = tasks.find(task => task.id === taskId);
      
      if(taskToDelete && taskToDelete.calendarEventId) {
        // If calendarEventId is found, 
        //delete the corresponding calendar event
        await Calendar.deleteEventAsync(taskToDelete.calendarEventId);
      }
      // delete task
      dispatch({ type: 'deleted', id: taskId });
  
      // Show toast message after successful delete
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Task deleted',
        text2: 'Calendar event deleted',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    } catch (error) {
      console.error('Failed to delete task and calendar event:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Failed to delete task and calendar event',
        text2: `Error: ${error}`,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    }
  }, [dispatch, tasks]);

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
      style={{zIndex:-1}}
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
  deleteButton: {
    backgroundColor: '#eb2323',
    borderRadius: 5,
    justifyContent: 'center',
    width: windowWidth *.15,
    text: {
      color: 'white',
      alignSelf: 'center',
    }
  },
});
export default TaskList;