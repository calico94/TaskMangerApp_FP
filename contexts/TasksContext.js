//Reference: learned reducer & context from: https://react.dev/learn/scaling-up-with-reducer-and-context
//Dispatching actions like it
import { createContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
export const TasksContext = createContext();

export const TasksDispatchContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    sampleTasks
  );

  const [showCompleted, setShowCompleted] = useState(true);

  const toggleShowCompleted = () => {
    setShowCompleted(prev => !prev);
  };

  // Load tasks from AsyncStorage when the component mounts (App starts) once
  useEffect(() => {
    const loadTasksFromStorage  = async () => {
      try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        dispatch({ type: 'restored', 
        tasks: JSON.parse(storedTasks) });
        // console.log('tasks restored from async storage');
      }
      } catch (error) {
        console.error("Failed to fetch tasks from async storage:",
        error);
      }
    }
    loadTasksFromStorage();
  }, []);
  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    const saveTasksToStorage = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        // console.log('tasks saved to async storage')
      } catch (error) {
        console.error('Failed to save tasks to storage:', error);
      }
    };
    saveTasksToStorage();
  }, [tasks]);

  const [isSearching, setIsSearching] = useState(false);
  const categoriesData  = ["leisure", "sport", "study", "work"]
  const priorityData = ["high", "medium", "low"]

  const importSampleData = async (dispatch) => {
    try {
    // Save sample data to AsyncStorage
    await AsyncStorage.setItem('tasks', JSON.stringify(sampleTasks));
    dispatch({ type: 'restored', tasks: sampleTasks });
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Sample tasks imported',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
    } catch (error) {
      console.error('Failed to import sample data:', error);
    } 
  }
  const removeSampleData = async (dispatch) => {
    try {
      // Set an empty array to 'tasks' key in AsyncStorage to clear out the data
      await AsyncStorage.setItem('tasks', JSON.stringify([]));
      // Clear the tasks from the state
      dispatch({ type: 'cleared' });
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Sample tasks cleared',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    } catch (error) {
      console.error('Failed to remove sample data:', error);
    }
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      isSearching, setIsSearching,
      categoriesData, priorityData,
      importSampleData, removeSampleData,
      showCompleted, toggleShowCompleted
      }}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    //*Note:restore doesn't restore calendars event though
    case 'restored': { // Restored tasks from storage
      return action.tasks.map(task => ({
        ...task,
        // Convert strings back to Date objects
        dueDate: new Date(task.dueDate),
        eventStartTime: new Date(task.eventStartTime),
        eventEndTime: new Date(task.eventEndTime),
      }));
    }
    case 'added': { // Added a new task
      return [...tasks, {
        id: action.id,
        name: action.name,
        description: action.description,
        done: false,
        dueDate: action.dueDate,
        priority: action.priority,
        category: action.category,
        eventStartTime: action.eventStartTime,
        eventEndTime: action.eventEndTime,
        alarmRelativeOffset: action.alarmRelativeOffset,
        calendarEventId: action.calendarEventId,
      }];
    }
    case 'changed': { // Edited a task
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': { // Deleted a task
      return tasks.filter(t => t.id !== action.id);
    }
    case 'cleared': { // Cleared All data
      return [];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const sampleTasks = [
  {
    id: 0,
    name: `Eat an apple`,
    description: "This is a sample long task description meant to illustrate what happens when the text is too long to fit into one line.",
    done: true,
    category: `leisure`,
    priority: `low`,
    dueDate: new Date('2023-09-25T00:00:00Z'),
    eventStartTime: new Date('2023-09-25T10:30:00Z'),
    eventEndTime: new Date('2023-09-25T11:00:00Z'),
  },
  {
    id: 1,
    name: `Go jogging in the park`,
    description: "This is a sample long task description meant to illustrate what happens when the text is too long to fit into one line.",
    done: false,
    category: `sport`,
    priority: `medium`,
    dueDate: new Date('2023-09-22T00:00:00Z'),
    eventStartTime: new Date('2023-09-22T10:30:00Z'),
    eventEndTime: new Date('2023-09-22T13:30:00Z'),
  },
  {
    id: 2,
    name: `Study for the upcoming test`,
    done: false,
    category: `study`,
    priority: `high`,
    dueDate: new Date('2023-09-20T00:00:00Z'),
    eventStartTime: new Date('2023-09-20T14:00:00Z'),
    eventEndTime: new Date('2023-09-20T16:00:00Z'),
  },
  {
    id: 3,
    name: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    done: false,
    category: `leisure`,
    priority: `high`,
    dueDate: new Date('2023-09-18T00:00:00Z'),
    eventStartTime: new Date('2023-09-18T18:00:00Z'),
    eventEndTime: new Date('2023-09-18T19:00:00Z'),
  }
];


