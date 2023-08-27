import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TasksContext, TasksDispatchContext } from '../../contexts/TasksContext.js';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomBackground from '../StyleComponents/BottomSheetCustomBackground.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import AndroidDateTimePicker from '../../utils/AndroidDateTimePicker.js';
import { useBottomSheet } from '../../contexts/BottomSheetContext.js';
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const TaskForm = () => {
    const {
      ref,
      close,
      selectedTask,
      isEditing,
      setSelectedTask,
      setIsEditing,
    } = useBottomSheet();

    const initializeDate = () => {
      const date = new Date();
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    };
    const { categoriesData, priorityData } = useContext(TasksContext);
    const dispatch = useContext(TasksDispatchContext);
    const isAndroid = Platform.OS === 'android';
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(initializeDate);
    const [eventStartTime, setEventStartTime] = useState(initializeDate);
    const [eventEndTime, setEventEndTime] = useState(initializeDate);
    //"Number of minutes from the startDate of the calendar 
    //item that the alarm should occur." Reference: https://docs.expo.dev/versions/latest/sdk/calendar/#alarm
    const [alarmRelativeOffset, setAlarmRelativeOffset] = useState(null);
    const [taskCategory, setTaskCategory] = useState(null);
    const [taskPriority, setTaskPriority] = useState(null);

    const { tasks } = useContext(TasksContext);

    // For open state of dropdown box
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [alarmOpen, setAlarmOpen] = useState(false);
    const categoryItems = categoriesData.map(category => ({ label: category, value: category }));
    const priorityItems = priorityData.map(priority => ({ label: priority, value: priority }));
    const alarmOffsets = [0, -5, -10, -15, -30, -120];
    const alarmItems = alarmOffsets.map(offset => {
      let label;
      if (offset === 0) label = 'At the time of event';
      else if (Math.abs(offset) < 60) label = `${Math.abs(offset)} min. before`;
      else label = `${Math.abs(offset) / 60} hours before`;

      return { label, value: offset };
    });
    
    const onCategoryOpen = useCallback(() => {
      setPriorityOpen(false);
    }, []);
  
    const onPriorityOpen = useCallback(() => {
      setCategoryOpen(false);
    }, []);

    const onAlarmOpen = useCallback(() => {
      setPriorityOpen(false);
      setCategoryOpen(false);
    }, []);

    const computeNextId = (tasks) => {
      if (tasks.length === 0) return 0;
      highestId = tasks.reduce((maxId, task) => 
      Math.max(task.id, maxId), -1);
      return highestId + 1;
    }

    useEffect(() => {
      if (selectedTask) {
        // populate the modal fields with selected task's details
          setTaskName(selectedTask.name);
          setTaskDescription(selectedTask.description);
          setTaskDueDate(selectedTask.dueDate || initializeDate);
          setEventStartTime(selectedTask.eventStartTime ||initializeDate);
          setEventEndTime(selectedTask.eventEndTime ||initializeDate);
          setTaskPriority(selectedTask.priority);
          setTaskCategory(selectedTask.category);
          setAlarmRelativeOffset(selectedTask.alarmRelativeOffset);
      } else {
          setTaskName('');
          setTaskDescription('');
          setTaskPriority(null);
          setTaskCategory(null);
          setTaskDueDate(initializeDate);
          setEventStartTime(initializeDate);
          setEventEndTime(initializeDate);
      }
    }, [selectedTask]);

    const theme = useTheme();
    const { colors } = useTheme();

    const snapPoints = useMemo(() => ['50%','85%'], []);
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
      if (index === -1) {
        Keyboard.dismiss();
        resetForm();
      }
    }, [close]);
  
    const resetForm = () => {
      setTaskName('');
      setTaskDescription('');
      setTaskDueDate(initializeDate);
      setTaskCategory(null);
      setTaskPriority(null);
      setAlarmRelativeOffset(null);
      setCategoryOpen(false);
      setPriorityOpen(false);
      setAlarmOpen(false);
      setIsEditing(false);
      setSelectedTask(null);
      setEventStartTime(initializeDate);
      setEventEndTime(initializeDate);
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
    // This will be called when the component goes out of focus
    useFocusEffect(
      useCallback(() => {
        return () => {
          close();
        };
      }, [])
    );

    const handleAddTask = async () => {
      if (eventStartTime.getTime() > eventEndTime.getTime()) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Reminder start time should be before the end time.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
        return;
      }      
      // Only add the task if it's not empty
      if (taskName.trim() !== '') {
        // Fetch the stored calendarId from AsyncStorage.
        const calendarId = await AsyncStorage.getItem('appCalendarId');

        if (!calendarId) {
          console.warn('No Calendar ID found');
          return;
        }
        // Check if start time and end time are the same
        const allDay = eventStartTime.getTime() === 
          eventEndTime.getTime();
        const nextId = computeNextId(tasks);
        // Create Calendar Event and Add task
        try {
          const eventId = await Calendar
          .createEventAsync(calendarId, {
            title: taskName,
            startDate: allDay ? taskDueDate : 
            eventStartTime,
            endDate: allDay ? new Date(taskDueDate) : 
            eventEndTime,
            allDay: allDay,
            alarms:[{relativeOffset: alarmRelativeOffset}]
          });
          console.log('Event created with ID:', eventId);
          dispatch({
            type: 'added',
            id: nextId,
            name: taskName,
            description: taskDescription,
            done: false,
            dueDate: taskDueDate,
            priority: taskPriority,
            category: taskCategory,
            eventStartTime: eventStartTime,
            eventEndTime: eventEndTime,
            alarmRelativeOffset: alarmRelativeOffset,
            calendarEventId: eventId
            });
          } catch (error) {
            console.warn('Error creating calendar event:', error);
          }
          Keyboard.dismiss();
          // Close Bottom Sheet
          close();
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Task Added',
            text2: 'Task Event added to calendar',
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

    const handleEditTask = async () => {
      if (eventStartTime.getTime() > eventEndTime.getTime()) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Reminder start time should be before the end time.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
        return;
      } 
      // Only edit task if it's not empty
      if (taskName.trim() !== '') {
        const allDay = eventStartTime.getTime() === 
        eventEndTime.getTime();
        const calendarId = await AsyncStorage
        .getItem('appCalendarId');
    
        if (!calendarId) {
          console.warn('No Calendar ID found');
          return;
        }
        // Update the calendar event
        if (selectedTask.calendarEventId) {
          console.log('hi');
          try {
            await Calendar
            .updateEventAsync(selectedTask.calendarEventId, {
              title: taskName,
              startDate: allDay ? taskDueDate : eventStartTime,
              endDate: allDay ? new Date(taskDueDate) : 
              eventEndTime,
              allDay: allDay,
              alarms:[{relativeOffset: alarmRelativeOffset}]
            });
            console.log('Calendar event updated:', 
            selectedTask.calendarEventId);
          } catch (error) {
            console.warn('Error updating calendar event:', error);
          }
        }
        dispatch({
          type: 'changed',
          task: {
            ...selectedTask,
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
            priority: taskPriority,
            category: taskCategory,
            eventStartTime: eventStartTime,
            eventEndTime: eventEndTime,
            alarmRelativeOffset: alarmRelativeOffset,
          }
        });
        Keyboard.dismiss();
        close();
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Task Edited',
          text2: 'Calendar Event Edited',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        // Handling form reset after BottomSheet is completely closed
        console.log('Task is empty');
      }
    };

    const handleCancelEdit = () => {
      resetForm();
      close();
      setIsEditing(false);
    };

    const handleDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || taskDueDate;
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      // Update the date parts of eventStartTime and eventEndTime
      eventStartTime.setFullYear(currentDate.getFullYear());
      eventStartTime.setMonth(currentDate.getMonth());
      eventStartTime.setDate(currentDate.getDate());
      eventStartTime.setSeconds(0);
      eventStartTime.setMilliseconds(0);

      eventEndTime.setFullYear(currentDate.getFullYear());
      eventEndTime.setMonth(currentDate.getMonth());
      eventEndTime.setDate(currentDate.getDate());
      eventEndTime.setSeconds(0);
      eventEndTime.setMilliseconds(0);

      setShowDatePicker(false);
      setTaskDueDate(currentDate);
      setEventStartTime(new Date(eventStartTime));
      setEventEndTime(new Date(eventEndTime));
    };
    const handleReminderTimeChange = (which, 
      event, selectedTime) => {
      const currentTime = selectedTime || (which === "start" ? 
      eventStartTime : eventEndTime);
      currentTime.setSeconds(0);
      currentTime.setMilliseconds(0);
      if (which === "start") {
          setEventStartTime(currentTime);
      } else {
          setEventEndTime(currentTime);
      }
    };

    return (
      <BottomSheet
        android_keyboardInputMode="adjustResize"
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        style={styles.BottomSheet}
        backgroundComponent={props => 
          <CustomBackground {...props} />}>
        <View style={styles.buttonRow}>
          {isEditing ? (
            <TouchableOpacity
            onPress={handleCancelEdit}
                  style={styles.cancelButton}
                  >
                  <Text style={{ color: 'red', textAlign: 'center' }}>
                      Cancel
                  </Text>
              </TouchableOpacity>
          ) : (
              <View style={{ flex: 1 }}></View>
          )}
                
          <TouchableOpacity
              onPress={isEditing ? handleEditTask : handleAddTask}
              style={styles.editButton}
          >
              <Text style={{ color: 'rgb(10, 132, 255)', textAlign: 'center' }}>
                  {isEditing ? 'Save Edit' : 'Add Task'}
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

        {/* Date Picker */}
        <View style={styles.dateTimeRow}>
          <View style={styles.datePickerContainer}>
            <Text style={{color:colors.text}}>Set Due Date</Text>
            {
              isAndroid ? 
                // Android Date Picker    
                <AndroidDateTimePicker 
                  mode="date" 
                  currentValue={taskDueDate}
                  onDateTimePicked={(selectedDate) => 
                  handleDateChange(null, selectedDate)}
                /> : 
                // IOS Date Picker
                <DateTimePicker
                  value={taskDueDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                  />
                }
          </View>
          {/* Start Time Picker */}
          <View style={styles.datePickerContainer}>
            <Text style={{color:colors.text}}>
              Set Event Start Time</Text>
            {
              isAndroid ? 
              //Android Time picker
              <AndroidDateTimePicker 
              mode="time" 
              currentValue={eventStartTime}
              onDateTimePicked={(selectedTime) => 
              handleReminderTimeChange("start", 
              null,
              selectedTime)}
              /> :
              //IOS Time picker
              eventStartTime && (
                <DateTimePicker
                  value={eventStartTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => 
                    handleReminderTimeChange("start", event, 
                    date)}/>
              )
            }
          </View>
          {/* End Time Picker */}
          <View style={styles.datePickerContainer}>
            <Text style={{color:colors.text}}>Set Event End Time</Text>
            {
              isAndroid ? 
              //Android Time picker
              <AndroidDateTimePicker 
              mode="time" 
              currentValue={eventEndTime}
              onDateTimePicked={(selectedTime) => 
              handleReminderTimeChange("end", null, 
              selectedTime)}
              /> :
              //IOS Time picker
              eventEndTime && (
                <DateTimePicker
                  value={eventEndTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => 
                    handleReminderTimeChange("end", 
                    event, date)}
                />
              )
            }
          </View>
        </View>

        {/* Solving overlapping problem of drop down pickers between
        Components (zIndex problem of the library) */}
        {/*Reference: https://github.com/hossein-zare/react-native-dropdown-picker/issues/596 */}
        {/*Reference (method used): https://github.com/hossein-zare/react-native-dropdown-picker/issues/596#issuecomment-1643903107 */}
        <View style={[styles.dropdownRow,{zIndex: 100}]}>
          {/* Category Dropdown Picker */}
          <DropDownPicker
            zIndex={3000}
            zIndexInverse={1000}
            open={categoryOpen}
            onOpen={onCategoryOpen}
            value={taskCategory}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setTaskCategory}
            placeholder="Select a category"
            containerStyle={styles.dropDownContainer}
            theme={theme.dark ? 'DARK' : 'LIGHT'}
          />
          {/* Priority Dropdown picker */}
          <DropDownPicker
            zIndex={2000}
            zIndexInverse={2000}
            open={priorityOpen}
            onOpen={onPriorityOpen}
            value={taskPriority}
            items={priorityItems}
            setOpen={setPriorityOpen}
            setValue={setTaskPriority}
            placeholder="Select a priority"
            containerStyle={styles.dropDownContainer}
            theme={theme.dark ? 'DARK' : 'LIGHT'}
          />
        </View>
        
        <Text style={{color:colors.text, 
          marginHorizontal:20,
          fontWeight: 'bold', fontSize: 16, marginBottom: 5}}>
          Set Reminder Notification offset time</Text>
          {/* Alarm Offset Dropdown Picker*/}
          <DropDownPicker
            zIndex={0}
            zIndexInverse={0}
            open={alarmOpen}
            onOpen={onAlarmOpen}
            value={alarmRelativeOffset}
            items={alarmItems}
            setOpen={setAlarmOpen}
            setValue={setAlarmRelativeOffset}
            placeholder="Reminder Offset"
            containerStyle={[styles.dropDownContainer,
              {marginHorizontal: 20, paddingBottom: 20}]}
            theme={theme.dark ? 'DARK' : 'LIGHT'}
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
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom: 20,
  },
  dropDownContainer: {
    height: 40,
    width: '45%',
  },
  dropDown: {
    backgroundColor: '#d61b1b',
    borderColor: "#ddd"
  },
  dropDownItem: {
    justifyContent: 'flex-start',
  },
  dropDownList: {
    backgroundColor: '#fafafa',
    borderColor: "#ddd"
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cancelButton: {
    padding: 8,
  },
  dateTimeRow: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default React.memo(TaskForm);