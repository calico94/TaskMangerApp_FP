import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

export default function Task({ task }) {
  const { colors } = useTheme();
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null;
  };
  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString('en-US', 
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    ) : null;
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'grey';
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.taskContainer} 
      >
        <CheckBox
          containerStyle={{backgroundColor: 'transparent',
          borderWidth: 0, padding: 0}}
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#34eb83'
          uncheckedColor='grey'
          checked={task.done}
          onPress={() => {
          }}
        />
        <View style={styles.textContainer}>
          {/* Task Name */}
          <Text style={[styles.text, {color: colors.text},
            task.done && styles.strikeThrough]}>
              {task.name}
          </Text>
          {/* Task Description */}
          <Text style={styles.taskDescription} 
          numberOfLines={1}>
            {task.description}
          </Text>
          {/* Task Event Date and Time */}
          <View style={styles.eventDateTime}>
            {task.dueDate && (
                <Text style={[styles.dueDateLabel,
                {backgroundColor:colors.background},
                {borderColor:colors.text},{color:colors.text}]}>
                    {"Due: " + formatDate(task.dueDate)}
                </Text>
            )}
              <View style={[styles.eventTime, 
                {borderColor:colors.text, 
                  borderWidth: 1, borderRadius: 5}]}>
                {task.eventStartTime && (
                  <Text style={[styles.timeLabel, 
                    {backgroundColor:colors.background}, 
                    {color:colors.text}]}>
                      {"[Event Time] Start: " + 
                      formatTime(task.eventStartTime)}
                  </Text>
                )}
                {task.eventEndTime && (
                  <Text style={[styles.timeLabel, 
                    {backgroundColor:colors.background}, 
                    {color:colors.text}]}>
                      {" End: " + 
                      formatTime(task.eventEndTime)}
                  </Text>
                )}
              </View>
          </View>
          <View style={styles.timeSpentContainer}>
            <Text style={styles.timeSpentLabel}>
              {task.timeSpent ? `Time Spent: ${task.timeSpent}s` 
              : null}
            </Text>
          </View>
          <View style={styles.labelsContainer}>
            {/* Category */}
            <Text style={[styles.categoryLabel, 
              {color: colors.text}]}>
                {"C: " + task.category}
            </Text>
            {/* Priority */}
            <Text style={[styles.priorityLabel, 
              { color: getPriorityColor(task.priority) }]}>
                {" P: " + task.priority}
            </Text>
          </View>
          {/* Reminder Offset time from the due date 
          (only show if existed) */}
          {task.alarmRelativeOffset !== null && 
          (<Text style={[styles.reminderLabel, {color: 
            '#70bdd6', fontStyle: 'italic'}
          ]}>
            {task.alarmRelativeOffset === 0
              ? 'Scheduled Reminder: At the time of due event' :
              `Scheduled Reminder: ${
              task.alarmRelativeOffset >= 0
                ? task.alarmRelativeOffset + 
                " min. after due date"
                : -task.alarmRelativeOffset + 
                " min. before due date"
            }`}
          </Text>)}
        </View>


      </TouchableOpacity>
    </View>
  );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskContainer: {
        paddingLeft: 5,
        paddingRight: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'lightgrey'
    },
    text: {
        flexWrap: 'wrap',
        fontSize: 14,
    },
    strikeThrough: {
        textDecorationLine: 'line-through',
        color: 'grey',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    taskDescription: {
        color: 'darkgrey',
        fontSize: 12,
        marginVertical: 3,
        overflow: 'hidden',
    },
    eventDateTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dueDateLabel: {
        marginTop: 5,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: -12,
    }, 
    eventTime: {
        marginTop: 5,
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
    },
    timeLabel: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },
    labelsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        top: 0,
        justifyContent: 'space-between',
    },
    timeSpentContainer: {
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        top: 0,
        justifyContent: 'space-between',
        marginTop: -15,
    },
    timeSpentLabel: {
        fontSize: 12,
        textAlign: 'left',
        fontStyle: 'italic',
        color: 'grey',
    },
    categoryLabel: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: -12,
    },
    priorityLabel: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: -12,
    },
    reminderLabel: {
        position: 'absolute',
        left: 0,
        bottom: -15,
        fontSize: 12,
        textAlign: 'left',
    }
});



