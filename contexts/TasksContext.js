//Reference: learned reducer & context from: https://react.dev/learn/scaling-up-with-reducer-and-context
//Dispatching actions like it
import { createContext, useEffect, useReducer, useState } from 'react';
export const TasksContext = createContext();

export const TasksDispatchContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    sampleTasks
  );

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const categoriesData  = ["leisure", "sport", "study", "work"]
  const priorityData = ["high", "medium", "low"]


  return (
    <TasksContext.Provider value={{
      tasks, isEditing, setIsEditing,
      selectedTask, setSelectedTask,
      isSearching, setIsSearching,
      categoriesData, priorityData,
      }}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
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


