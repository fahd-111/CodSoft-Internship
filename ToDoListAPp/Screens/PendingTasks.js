import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

const PendingTasks = () => {
  
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [pendingTasks, setPendingTasks] = useState([]); // Use pendingTasks state for rendering
  const [isChecked , setChecked] = useState(false)

  useEffect(() => {
    // Load the pending tasks from AsyncStorage when the component mounts
    
    loadPendingTasks();
  }, []);

  const [isUpdating, setIsUpdating] = useState(false); // State to track whether an update is in progress

  // Define a function to handle the checkbox change
  const handleCheckboxChange = (id, isChecked) => {
    setIsUpdating(true); // Set the update state to true
  
    // Add a 1-second delay before proceeding
    setTimeout(() => {
      // Find the task by id in the pendingTasks array
      const taskIndex = pendingTasks.findIndex((task) => task.id === id);
  
      if (taskIndex !== -1) {
        // Remove the task from the pendingTasks array
        const updatedPendingTasks = [...pendingTasks];
        updatedPendingTasks.splice(taskIndex, 1);
  
        // Update the pendingTasks list in AsyncStorage
        AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks))
          .then(() => {
            // Update the state with the updated pending tasks list
            setPendingTasks(updatedPendingTasks);
  
            if (isChecked) {
              // Load the existing completedTasks from AsyncStorage
              AsyncStorage.getItem('completedTasks')
                .then((storedTasks) => {
                  const parsedTasks = JSON.parse(storedTasks) || [];
  
                  // Create a new completed task object
                  const completedTask = {
                    id: Date.now().toString(),
                    title: pendingTasks[taskIndex].title,
                  };
  
                  // Add the completed task to the completedTasks array
                  parsedTasks.push(completedTask);
  
                  // Update the completedTasks list in AsyncStorage
                  AsyncStorage.setItem('completedTasks', JSON.stringify(parsedTasks))
                    .then(() => {
                      // Do any additional updates or state changes you need
                      setIsUpdating(false); // Set the update state back to false
                    })
                    .catch((error) => {
                      console.error('Error adding task to completed tasks: ', error);
                      setIsUpdating(false); // Set the update state back to false in case of an error
                    });
                })
                .catch((error) => {
                  console.error('Error loading completed tasks: ', error);
                  setIsUpdating(false); // Set the update state back to false in case of an error
                });
            } else {
              setIsUpdating(false); // Set the update state back to false if the checkbox is not checked
            }
          })
          .catch((error) => {
            console.error('Error updating pending tasks: ', error);
            setIsUpdating(false); // Set the update state back to false in case of an error
          });
      }
    }, 1000); // Wait for 1 second before proceeding
  };

  const loadPendingTasks = async () => {
    try {
      // Load the "pendingTasks" from AsyncStorage
      const storedTasks = await AsyncStorage.getItem('pendingTasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setPendingTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading pending tasks: ', error);
    }
  };

  const HandleDeleteToDo = (id) => {
    // Filter out the task with the matching id
    const updatedTasks = pendingTasks.filter((task) => task.id !== id);

    // Update the pendingTasks list in AsyncStorage
    AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedTasks))
      .then(() => {
        // Update the state with the updated task list
        setPendingTasks(updatedTasks);
      })
      .catch((error) => {
        console.error('Error deleting task: ', error);
      });
  };

  const startEditing = (id, title) => {
    Keyboard.isVisible(true)
    setEditMode(true);
    setEditTaskId(id);
    setEditedTask(title);
  };

  const cancelEditing = () => {
    setEditMode(false);
    setEditTaskId(null);
    setEditedTask('');
  };

  const saveEditedTask = () => {
    if (editedTask) {
      // Find the task by id in the pendingTasks array
      const taskIndex = pendingTasks.findIndex((task) => task.id === editTaskId);
  
      if (taskIndex !== -1) {
        // Create a copy of the pendingTasks array
        const updatedList = [...pendingTasks];
        
        // Update the task's title in the copy
        updatedList[taskIndex].title = editedTask;
  
        // Update the pendingTasks list in AsyncStorage
        AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedList))
          .then(() => {
            // Update the state with the updated pending tasks list
            setPendingTasks(updatedList);
            cancelEditing();
          })
          .catch((error) => {
            console.error('Error updating pending tasks: ', error);
          });
      }
    }
  };

  const tasksToDo = ({ item }) => {
    if (editMode && editTaskId === item.id) {
      return (
        <View style={styles.tasksDesign}>
          <TextInput
            style={styles.editingTaskInput}
            multiline={true}
            onChangeText={(text) => setEditedTask(text)}
            value={editedTask}

          />
          <View style={styles.icons}>
            <TouchableOpacity onPress={saveEditedTask}>
              <Icon name="check" size={25} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEditing}>
              <Icon name="times" size={25} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tasksDesign}>

<BouncyCheckbox
          size={25}
          fillColor="red"
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "red" }}
          innerIconStyle={{ borderWidth: 1 }}
          isChecked={isChecked} // Pass the checkbox state here
          onPress={() => handleCheckboxChange(item.id, !isChecked)} // Call handleCheckboxChange on press
        />

        <Text style={styles.descriptionText}>{item.title}</Text>
        <View style={styles.icons}>

          <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
            <Icon name="pencil" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => HandleDeleteToDo(item.id)}>
            <Icon name="trash" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }} scrollEnabled={true}>
            <View style={styles.ListofTasks}>
              {pendingTasks.length === 0 ? (
                // Display an image when there are no pending tasks
                <Image
                  source={require('../assets/TasksCompleted.png')}
                  style={styles.emptyListImage}
                />
              ) : (
                // Display the FlatList when there are tasks
                <FlatList
                  data={pendingTasks}
                  renderItem={tasksToDo}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tasksDesign: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 2,
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    backgroundColor: '#320069',
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 0 }, // Shadow offset (x, y)
    shadowOpacity: 0.8, // Shadow opacity (0 to 1)
    shadowRadius: 2, // Shadow radius
    paddingTop: 20,
  },
  emptyListImage: {
    width: 200,
    height: 500,
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  editingTaskDesign: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 2,
    padding: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    backgroundColor: '#320069',
  },
  TaskInput: {
    flex: 0.14,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    backgroundColor: '#320069',
    height: 50,
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: -1 }, // Shadow offset (x, y)
    shadowOpacity: 0.8, // Shadow opacity (0 to 1)
    shadowRadius: 3, // Shadow radius
    paddingTop: 20,
  },
  icons: {
    flex: 0.2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  searchBar: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 18,
    height: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editingTaskInput: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 30,
    fontSize: 20,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListofTasks: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 25,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  descriptionText: {
    flex: 0.8,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#7836ff',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    justifyContent: 'center',
  },
});

export default PendingTasks;
