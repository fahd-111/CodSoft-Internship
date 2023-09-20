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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

const CompletedTask = () => {
  const [CompletedTask, setcompletedTask] = useState([]); 

  useEffect(() => {    
    loadcompletedTask();
  }, []);



  const loadcompletedTask = async () => {
    try {
      
      
      const storedTasks = await AsyncStorage.getItem('completedTasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setcompletedTask(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading Completed tasks: ', error);
    }
  };

  const HandleDeleteToDo = (id) => {
    
    const updatedTasks = CompletedTask.filter((task) => task.id !== id);

    
    AsyncStorage.setItem('completedTasks', JSON.stringify(updatedTasks))
      .then(() => {
        
        setcompletedTask(updatedTasks);
      })
      .catch((error) => {
        console.error('Error deleting task: ', error);
      });
  };


  const tasksToDo = ({ item }) => {
    return (
      <View style={styles.tasksDesign}>
        <Text style={styles.descriptionText}>{item.title}</Text>
        <View style={styles.icons}>

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
              {CompletedTask.length === 0 ? (
                
                <Image
                  source={require('../assets/NoTasks.png')}
                  style={styles.emptyListImage}
                />
              ) : (
                
                <FlatList
                  data={CompletedTask}
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
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 2, 
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
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: -1 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 3, 
    paddingTop: 20,
  },
  icons: {
    flex: 0.1,
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

export default CompletedTask;
