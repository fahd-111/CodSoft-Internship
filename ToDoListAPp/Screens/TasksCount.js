import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {backgroundImage} from "../assets/index"

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
  
  useFocusEffect(() => {
    loadTasksCount();
  });

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.TasksButton}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Text style={styles.buttonText}>Add a new Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.TasksButton}
        onPress={() => navigation.navigate('PendingTasks')}
      >
        <Text style={styles.buttonText}>Pending Tasks: {pendingCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.TasksButton}
        onPress={() => navigation.navigate('CompletedTasks')}
      >
        <Text style={styles.buttonText}>Completed Tasks Today: {completedCount}</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
 
  background: {
    flex: 1,
    resizeMode:'contain',
    justifyContent:'flex-end',
  },
  container:{
flex:0.4,
 margin:20,
 alignContent:'center',
 paddingBottom:30
  },
  TasksButton:{
    backgroundColor: '#320069',
    borderRadius: 20,
    padding:20,
    margin:20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    paddingTop: 20,
  },
  PendingTasks:{
    backgroundColor: '#320069',
    borderRadius: 5,
    padding:20,
    margin:20
  },
  completedTasks:{
    backgroundColor: '#320069',
    borderRadius: 20,
    padding:20,
    margin:20
  },
  buttonText: {
    fontSize: 20,
    marginBottom: 10,
    color:'white',
    textAlign:'center'
  },
  button: {
    backgroundColor: '#7836ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default TasksCount;