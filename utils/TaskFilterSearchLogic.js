import { useState, useContext } from 'react';
import { TasksContext } from '../contexts/TasksContext';

export const useTaskFilterSearchLogic = () => {
  const { tasks, setIsSearching } = useContext(TasksContext);

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterByPriority = (priority) => {
    if (priority === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.priority === priority);
  };

  const searchTasks = (query) => {
    if (query === '') {
      setIsSearching(false);
      return [];
    } else {
      setIsSearching(true);
      return tasks.filter(task => 
      task.name.toLowerCase().includes(query.toLowerCase()));
    }
  };

  const handleSearchFocus = () => setIsSearching(true);

  const handleOnCancel = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  return {
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery,
    filterByPriority,
    searchTasks,
    handleSearchFocus,
    handleOnCancel,
  };
};
