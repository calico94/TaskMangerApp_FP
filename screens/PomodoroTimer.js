import React, { useRef, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Keyboard } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomSheet,{ BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import CustomBackground from '../components/StyleComponents/BottomSheetCustomBackground.js';
import { useTheme } from '@react-navigation/native';
import { TasksContext, TasksDispatchContext } from '../contexts/TasksContext.js';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PomodoroTimer() {
  const theme = useTheme();
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const [isMinutes, setIsMinutes] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [autoRun, setAutoRun] = useState(false);
  const [sessionCount, setSessionCount] = useState(4); 
  const [currentSession, setCurrentSession] = useState(1);
  const timerDuration = isFocusMode ? 
  focusTime * 60 : breakTime * 60; // Convert to seconds
  const timerColor = isFocusMode ? '#7d34eb' : '#34eb83';
  const timerText = isFocusMode ? 'Focus' : 'Break';

  const bottomsheetRef = useRef(null);
  const snapPoints = useMemo(() => ['69%', '50%'], []);
  const dispatch = useContext(TasksDispatchContext);
  const { tasks } = useContext(TasksContext);
  const [selectedTask, setSelectedTask] = useState(null);
  // For open state of dropdown search box
  const [taskSearchOpen, setTaskSearchOpen] = useState(false);
  const taskItems = tasks ? tasks.map(task => ({
    label: task.name,
    value: task.id, 
  })) : [];
  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    console.log(selectedTask);
  }, [selectedTask]);
  // This will be called when the component goes out of focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsSaved(false);
        // reset sliders to default value
        setFocusTime(25);
        setBreakTime(5);
        setIsEditable(true);
        setCurrentSession(1); // Reset to the first session
        setIsFocusMode(true); // Reset to focus mode
        setIsMinutes(true);
        handleCloseSheet();
      };
    }, [])
  );

  const playTimer = () => {
    // Save the current time when the timer starts
    setStartTime(Date.now());
    setIsPlaying(true);
    setIsStarted(true);
    // Disable Editing when Timer is Playing (sliders, dropdown)
    setIsEditable(false);
    // setTaskSearchOpen(false);
  };
  const pauseTimer = () => {
    setIsPlaying(false);
  }
  const restartTimer = () => {
    setKey(prevKey => prevKey + 1);
    // Reset to initial state when stopped.
    setIsFocusMode(true);
    setIsStarted(false); 
    setIsSaved(false);
    setIsEditable(true);
    setCurrentSession(1); // Reset to the first session
    // setTaskSearchOpen(true);
    // Check if they are null and when is focus mode onnly 
    //*because at onComplete I had toggled the focus mode already
    //before pressing restart, so it is !isFocusMode when
    //I actually only want to add time during focus mode
    if (!isFocusMode && selectedTask !== null && startTime !== null) {
      const task = tasks.find(t => t.id === selectedTask);
      if (task) {
        // Current time when the stop button is pressed
        const endTime = Date.now(); 
        // Calculate Time spent in seconds
        const timeSpent = Math.round((endTime - 
          startTime) / 1000);
    
        // Dispatch saveTime action when the stop button is pressed
        dispatch({ type: 'saveTime', task: task, 
        timeSpent: timeSpent });
        console.log(`selectedTask: ${selectedTask}`)
        console.log("hi"+ selectedTask.timeSpent);
        setSelectedTask(null);
        setStartTime(null);
      }
    }
  };
  // const onTaskSearchOpen = useCallback(() => {
  //   setPriorityOpen(false);
  //   setAlarmOpen(false);
  // }, []);
  const handleExpandSheet = () => {
    bottomsheetRef.current?.expand();
  };
  const handleCloseSheet = () => {
    bottomsheetRef.current?.close();
  };
  // console.log(`isSaved ${isSaved}`);
  console.log(`isEditable ${isEditable}`)
  console.log(`isFocusMode${isFocusMode}`);
  console.log(`autoRun ${autoRun}`)
  console.log(`currentSession ${currentSession}`)
  console.log(`isPlaying: ${isPlaying}`)
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
  
  const handleSheetChanges = useCallback((index) => {
    if (index === -1 && !isSaved) {
      // reset sliders to default value
      setFocusTime(25);
      setBreakTime(5);
    }
  }, [isSaved]);
  useEffect(() => {
    const requestPermission = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Notification permission is required for notifications to work!');
            }
        } catch (error) {
            console.error('Error requesting notifications permissions', error);
        }
    };
    requestPermission();
}, []);

  const scheduleNotification = async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: "default",
        },
        trigger: {
          seconds: 1,
        },
      });
    } catch (error) {
        console.error('Failed to schedule notification', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[{color: colors.text,fontWeight:'bold',
      fontSize: 30, padding: 20}]}>
        {timerText} Mode
      </Text>
      <DropDownPicker
        searchable={true}
        disabled={!isEditable} // Disable when timer is playing
        open={taskSearchOpen}
        value={selectedTask}
        items={taskItems}
        setOpen={setTaskSearchOpen}
        setValue={setSelectedTask}
        placeholder="Select your task to focus!"
        containerStyle={styles.dropDownContainer}
        theme={theme.dark ? 'DARK' : 'LIGHT'}
      />
      <TouchableOpacity style={{padding: 20}} 
        onPress={handleExpandSheet}>
        <FontAwesome name="sliders" size={windowWidth/12} 
        color={colors.text} />
      </TouchableOpacity>
      {/* Count down timer */}
      <CountdownCircleTimer
        size={windowHeight*0.33}
        strokeWidth={20}
        trailStrokeWidth={16}
        key={key}
        isPlaying={isPlaying}
        duration={timerDuration}
        colors={[timerColor]}
        onComplete={() => {
          const nextIsFocusMode = !isFocusMode;
          if (!isFocusMode && autoRun) setCurrentSession(prev => prev + 1); // Increment after every break mode
          
          if (currentSession >= sessionCount) {
              setIsPlaying(false);
              setIsFocusMode(true); // Reset to focus mode
              setCurrentSession(1); // Reset to the first session
              // Notify the user when the timer is complete.
              scheduleNotification('Pomodoro Timer Completed all sessions',
              'It\'s time for a Rest!');
              return false; // Prevent the timer from auto-restarting
          } else {
              setIsFocusMode(nextIsFocusMode);
              setIsPlaying(autoRun);
               // Notify the user when the timer is complete.
              scheduleNotification('Pomodoro Timer Completed', 
    `It's time for a ${isFocusMode ? 'Break' : 'Focus'}!`);
          }
          
          setKey(prevKey => prevKey + 1);
          return [autoRun && currentSession < sessionCount, 0];
        }}
      
      >
        {/* [Formatting time] Documentation 
        Reference: https://github.com/vydimitrov/react-countdown-circle-timer/tree/master/packages/web#time-formatting-functions */}
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          return (
            <View style={styles.time}>
              <Text style={[{ fontSize: 36 },{color:colors.text}]}>
                {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
              </Text>
            </View>
          );
        }}
      </CountdownCircleTimer>
      {/* Timer play control buttons */}
{/*Note:only play button appear before start playing. 
If started playing, only pause button present. And if pause 
button pressed, play button is present at the left and stop 
button at the right. */}
      <View style={styles.buttons}>
        {!isPlaying && !isStarted && (
          <TouchableOpacity onPress={playTimer}>
            <AntDesign name="play" size={windowWidth / 7} 
            color={colors.text} />
          </TouchableOpacity>
        )}

        {isPlaying && (
          <TouchableOpacity onPress={pauseTimer}>
            <AntDesign name="pausecircle" size={windowWidth / 7} 
            color={colors.text} />
          </TouchableOpacity>
        )}

        {!isPlaying && isStarted && (
          <View style={styles.playStopContainer}>
            <TouchableOpacity onPress={playTimer}>
              <AntDesign name="play" size={windowWidth / 7} 
              color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={restartTimer}>
              <FontAwesome name="stop-circle" size={windowWidth / 7} 
              color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <BottomSheet
// Fixed bottom sheet slider gesture bug: cannot sliede
//horizontally on android. fix by setting 
//enableContentPanningGesture to false
//Reference 1: https://github.com/callstack/react-native-slider/issues/503#issuecomment-1546718240
//Reference 2: https://github.com/gorhom/react-native-bottom-sheet/issues/1300#issuecomment-1483080021
        enableContentPanningGesture={false}
        ref={bottomsheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        style={styles.BottomSheet}
        backgroundComponent={props => 
        <CustomBackground {...props} />}
      >
        <View  style={{alignItems:'flex-end', marginTop:-15}}>
          <Button title='save'
            onPress={() => { setIsSaved(true);
              handleCloseSheet();
            }}/>
        </View>
        <Button
          title={isMinutes ? "Switch to Seconds" : 
          "Switch to Minutes"}
          onPress={() => setIsMinutes(!isMinutes)}
        />
        <View style={styles.rowContainer}>
          <Text style={[styles.label,{color:colors.text}]}>
            Focus Duration</Text>
            <Text style={styles.valueText}>
              {isMinutes ? `${focusTime} min` : 
              `${focusTime * 60} sec`}
            </Text>
        </View>
        <Slider
          disabled={!isEditable} // Disable when timer is playing
          style={styles.slider}
          minimumValue={isMinutes ? 5 : 2} 
          maximumValue={isMinutes ? 60 : 30} 
          step={isMinutes ? 5 : 2} 
          value={isMinutes ? focusTime : focusTime * 60}
          onValueChange={(value) => 
            setFocusTime(isMinutes ? value : value / 60)
          }
          minimumTrackTintColor="#7d34eb"
          maximumTrackTintColor="#000000"
        />
        <View style={styles.rowContainer}>
          <Text style={[styles.label, {color:colors.text}]}>
            Break Time</Text>
            <Text style={styles.valueText}>
              {isMinutes ? `${breakTime} min` : 
              `${breakTime * 60} sec`}
            </Text>
        </View>
        <Slider
          disabled={!isEditable} // Disable when timer is playing
          style={styles.slider}
          minimumValue={isMinutes ? 2 : 2} //minimun 2 min.
          maximumValue={isMinutes ? 20 : 30} //max 50 min.
          step={isMinutes ? 2 : 2}
          value={isMinutes ? breakTime : breakTime * 60}
          onValueChange={(value) => 
            setBreakTime(isMinutes ? value : value / 60)}
          minimumTrackTintColor="#34eb83"
          maximumTrackTintColor="#000000"
        />
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Auto-Run</Text>
          <Switch 
              onValueChange={setAutoRun} 
              value={autoRun} 
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Sessions</Text>
          <View style={styles.sessionContainer}>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={2}
                maximumValue={8}
                step={1}
                value={sessionCount}
                disabled={!autoRun}
                onValueChange={(value) => 
                  setSessionCount(value)}
                minimumTrackTintColor="#34eb83"
                maximumTrackTintColor="#000000"
              />
            </View>
            <Text style={styles.value}>{sessionCount}</Text>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  time: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  buttons: {
    marginTop: 20,
  },
  playStopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth / 2.5,
  },
  dropDownContainer: {
    height: 40,
    width: '70%',
  },
  BottomSheet: {
    padding: 20,
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  sliderContainer: {
      width: '95%',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  slider: {
    width: '100%',
    // height: 40,
    height: windowHeight*0.04,
  },
  valueText: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
  },
});
