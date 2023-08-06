import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useTaskFilterSearchLogic } from '../../utils/TaskFilterSearchLogic';
import { Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';

const TaskFilterSearch = ({ updateDisplayedTasks }) => {
  const { colors } = useTheme();
  const {
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery,
    filterByPriority,
    searchTasks,
    handleSearchFocus,
    handleOnCancel,
  } = useTaskFilterSearchLogic();

  const handleSearch = (query) => {
    setSearchQuery(query);
    const result = query ? searchTasks(query) : filterByPriority(selectedPriority);
    updateDisplayedTasks(result);
  };

  const handlePriorityPress = (priority) => {
    setSelectedPriority(priority);
    const result = filterByPriority(priority);
    updateDisplayedTasks(result);
  };

  return (
    <View>
      {/* Search bar */}
      <SearchBar
        placeholder="Search for a task..."
        onChangeText={handleSearch}
        onFocus={handleSearchFocus}
        value={searchQuery}
        onCancel={handleOnCancel}
        onClear={handleOnCancel}
        platform='ios'
        round={true} lightTheme={true}
        containerStyle={[{backgroundColor:colors.background}, 
          styles.searchBar.container]}
        inputContainerStyle={[styles.searchBar.inputContainerStyle,
        {backgroundColor:colors.card}]}

        style={{height:5}}
      />

      {/* Priority buttons */}
      <View style={styles.priorityButtonContainer}>
        <Text style={[styles.priorityLabel,
        {color:colors.text}]}>Priority:</Text>
        <TouchableOpacity
            style={[{backgroundColor:colors.priorityAll},
                styles.priorityButton,
                (selectedPriority === 'all') ? 
                {
                  ...styles.priorityButton.selected, 
                  ...styles.priorityButton.allButton,
                  shadowColor: colors.shadowColor} : 
                  styles.priorityButton.allButtonInactive
            ]}
            onPress={() => handlePriorityPress('all')}
        >
            <Text style={styles.priorityButton.text}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.priorityButton,
                (selectedPriority === 'high') ? 
                {...styles.priorityButton.selected, 
                  ...styles.priorityButton.highButton,
                  shadowColor: colors.shadowColor} : 
                  styles.priorityButton.highButtonInactive
            ]}
            onPress={() => handlePriorityPress('high')}
        >
            <Text style={styles.priorityButton.text}>High</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.priorityButton,
                (selectedPriority === 'medium') ? 
                {...styles.priorityButton.selected, 
                  ...styles.priorityButton.mediumButton,
                  shadowColor: colors.shadowColor} : 
                  styles.priorityButton.mediumButtonInactive
            ]}
            onPress={() => handlePriorityPress('medium')}
        >
            <Text style={styles.priorityButton.text}>Medium</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.priorityButton,
                (selectedPriority === 'low') ? 
                {...styles.priorityButton.selected, 
                  ...styles.priorityButton.lowButton,
                  shadowColor: colors.shadowColor} : 
                  styles.priorityButton.lowButtonInactive
            ]}
            onPress={() => handlePriorityPress('low')}
        >
            <Text style={styles.priorityButton.text}>Low</Text>
        </TouchableOpacity>

      </View>


    </View>
  );
};

export default TaskFilterSearch;

const styles = StyleSheet.create({
  searchBar: {
      container: {
          padding: 5,
          borderWidth: 0, 
          borderRadius: 5, 
      },
      inputContainerStyle: {
          height:30
      },
  },
    priorityButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    priorityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    },
    priorityButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        text: {
          color: 'white',
        },
        selected : {
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          
          elevation: 10,
        }, 
      allButtonInactive: {
          backgroundColor: '#B0B0B0',
      },
      highButton: {
          backgroundColor: 'red',
      },
      highButtonInactive: {
          backgroundColor: '#FFC1C1',
      },
      mediumButton: {
          backgroundColor: 'orange',
      },
      mediumButtonInactive: {
          backgroundColor: '#FFDAB9',
      },
      lowButton: {
          backgroundColor: 'green',
      },
      lowButtonInactive: {
          backgroundColor: '#98FB98',
      },
    },
});