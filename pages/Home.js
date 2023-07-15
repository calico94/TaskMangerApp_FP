import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard, Pressable, Platform } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    date.setSeconds(0);
    date.setMilliseconds(0);
    hideDatePicker();
    setReminderTime(date);
  };

  const scheduleNotification = async (date, text) => {
    // Only schedule the notification if the date is in the future
    if (date.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: text,
          data: { data: 'goes here' },
          sound: "default",  // Uses the default sound
        },
        trigger: date,
      });
    } else {
      console.log('Selected date/time is in the past. Not scheduling notification.');
    }
  }
  

  const handleAddTask = () => {
    if (newTask.trim().length > 0) {
      const task = { key: Math.random().toString(), value: newTask, checked: false, reminderTime: reminderTime };
      setTasks([...tasks, task]);
      setNewTask('');
      if (reminderTime) {
        scheduleNotification(reminderTime, newTask);
      }
      setReminderTime(null);
    }
    setIsAddMode(false);
    Keyboard.dismiss();
  };
  

  const handleDeleteTask = (taskKey, isCompleted) => {
    if(isCompleted) {
      setCompletedTasks(completedTasks.filter(task => task.key !== taskKey));
    } else {
      setTasks(tasks.filter(task => task.key !== taskKey));
    }
  };

  const handleCompleteTask = (taskKey) => {
    let taskIndex = tasks.findIndex(task => task.key === taskKey);
    if(taskIndex !== -1) {
      let task = tasks[taskIndex];
      task.checked = true;
      setCompletedTasks([...completedTasks, task]);
      setTasks(tasks.filter(task => task.key !== taskKey));
    }
  };

  const handleUncheckTask = (taskKey) => {
    let taskIndex = completedTasks.findIndex(task => task.key === taskKey);
    if(taskIndex !== -1) {
      let task = completedTasks[taskIndex];
      task.checked = false;
      setTasks([...tasks, task]);
      setCompletedTasks(completedTasks.filter(task => task.key !== taskKey));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Tasks</Text>
        <FlatList
          data={tasks}
          renderItem={itemData => (
            <Swipeable
              renderRightActions={() => (
                <Button title="Delete" onPress={() => handleDeleteTask(itemData.item.key, false)} />
              )}
            >
              <View style={styles.listItem}>
                <CheckBox
                  title={itemData.item.value + "\n" + new Date(itemData.item.reminderTime).toLocaleDateString() + " " + new Date(itemData.item.reminderTime).toLocaleTimeString()}
                  checked={itemData.item.checked}
                  onPress={() => handleCompleteTask(itemData.item.key)}
                  containerStyle={styles.checkbox}
                  textStyle={styles.taskText}
                />
              </View>
            </Swipeable>
          )}
          
        />
        {isAddMode && 
          <View style={styles.inputContainer}>
            <CheckBox
              checked={false}
              checkedColor='black'
              uncheckedColor='black'
              onPress={handleAddTask}
              containerStyle={styles.checkbox}
            />
            <TextInput
              placeholder="Add new task"
              style={styles.input}
              onChangeText={setNewTask}
              value={newTask}
            />
            <Pressable onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {reminderTime
                  ? `${reminderTime.getHours()}:${reminderTime.getMinutes()}`
                  : 'Set Reminder'}
              </Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              textColor="black"
            />
            <Text onPress={handleAddTask} style={styles.doneButton}>Done</Text>
          </View>
        }
        <Text style={styles.heading}>Done</Text>
        <FlatList
          data={completedTasks}
          renderItem={itemData => (
            <Swipeable
              renderRightActions={() => (
                <Button title="Delete" onPress={() => handleDeleteTask(itemData.item.key, true)} />
              )}
            >
              <View style={styles.listItemDone}>
                <CheckBox
                  title={itemData.item.value}
                  checked={itemData.item.checked}
                  checkedColor='grey'
                  onPress={() => handleUncheckTask(itemData.item.key)}
                  containerStyle={styles.checkbox}
                />
              </View>
            </Swipeable>
          )}
        />
        
        <Button
          title={isAddMode ? 'Cancel' : 'Add New Task'}
          onPress={() => setIsAddMode(!isAddMode)}
          containerStyle={styles.addTaskButton}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  dateText: {
    color: '#000000',
    marginRight: 10,
  },
  doneButton: {
    color: '#0000ff',
  },
  addTaskButton: {
    marginTop: 20,
  },
  listItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemDone: {
    backgroundColor: '#d3d3d3',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: '#f0f0f0',
    borderWidth: 0,
  },
});

export default Home;
