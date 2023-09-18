import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToDoList } from '../assets';

const TasksCount = () => {
  const navigation = useNavigation();
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const loadTasksCount = () => {
    AsyncStorage.getItem('pendingTasks')
      .then((storedPendingTasks) => {
        if (storedPendingTasks) {
          const parsedPendingTasks = JSON.parse(storedPendingTasks);
          const pendingCount = parsedPendingTasks.length;
          setPendingCount(pendingCount);
        } else {
          setPendingCount(0);
        }
      })
      .catch((error) => {
        console.error('Error loading pending tasks: ', error);
      });
  
    AsyncStorage.getItem('completedTasks')
      .then((storedCompletedTasks) => {
        if (storedCompletedTasks) {
          const parsedCompletedTasks = JSON.parse(storedCompletedTasks);
          const completedCount = parsedCompletedTasks.length;
          setCompletedCount(completedCount);
        } else {
          setCompletedCount(0);
        }
      })
      .catch((error) => {
        console.error('Error loading completed tasks: ', error);
      });
  };
  
  // Use useFocusEffect to load tasks count when the screen is focused
  useFocusEffect(() => {
    loadTasksCount();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pending Tasks: {pendingCount}</Text>
      <Text style={styles.text}>Completed Tasks: {completedCount}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Text>Add Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PendingTasks')}
      >
        <Text>View Pending Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CompletedTasks')}
      >
        <Text>View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7836ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default TasksCount;