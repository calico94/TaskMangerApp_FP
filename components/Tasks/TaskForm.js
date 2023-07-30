import React, { useState, useContext, useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TasksContext, TasksDispatchContext } from '../../contexts/TasksContext.js';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useBottomSheet } from '../../contexts/BottomSheetContext.js';
export default function TaskForm(){
    const {
      ref,
      close,
    } = useBottomSheet();
    const dispatch = useContext(TasksDispatchContext);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    
    const { tasks } = useContext(TasksContext);
    
    const computeNextId = (tasks) => {
      if (tasks.length === 0) return 0;
      highestId = tasks.reduce((maxId, task) => 
      Math.max(task.id, maxId), -1);
      return highestId + 1;
    }

    const theme = useTheme();
    const { colors } = useTheme();

    const snapPoints = useMemo(() => ['50%','85%'], []);
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
      if (index === -1          ) {
        Keyboard.dismiss();
        resetForm();
      }
    }, [close]);
  
    const resetForm = () => {
      setTaskName('');
      setTaskDescription('');
      console.log('form resetted');
    };
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={'close'}
        />
      ),
      []
    );
    const handleAddTask = () => {
      const nextId = computeNextId(tasks);
      // Only add the task if it's not empty
      if (taskName.trim() !== '') {
        dispatch({
        type: 'added',
        id: nextId,
        name: taskName,
        description: taskDescription,
        done: false,
        });
        resetForm();
        close();
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Task Added',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Task is empty',
          visibilityTime: 1200,
          autoHide: true,
          topOffset: 50,
        });
    }};

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        style={styles.BottomSheet}
      >
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleAddTask}
            >
              <Text style={{ color: 'rgb(10, 132, 255)', textAlign: 'center' }}>
                {'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Task Name */}
          <BottomSheetTextInput
            placeholder="Enter Task Name"
            placeholderTextColor='grey'
            value={ taskName }
            onChangeText={setTaskName}
            style={[{backgroundColor: colors.background},
              {color: colors.text},
              styles.inputName]}
            // autoFocus={true}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
          />

          {/* Task Description */}
          <BottomSheetTextInput
            placeholder="Enter Task Description"
            placeholderTextColor='grey'
            multiline={true}
            value={ taskDescription }
            onChangeText={setTaskDescription}
            style={[{backgroundColor: colors.background},
              {color: colors.text},
              styles.inputDescription]}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
          />
      </BottomSheet>
    );
    
};

const styles = StyleSheet.create({
  BottomSheet: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  inputName: {
    padding: 12,
    textAlign: "center",
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  inputDescription : {
    paddingHorizontal: 10,
    paddingVertical: 50,
    textAlign: "left",
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
