import React, { useState } from 'react'
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
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ScrollView } from 'react-native-gesture-handler'

const Tasks = () => {
  const [ToDo, setToDo] = useState('')
  const [todoList, setTodoList] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)
  const [editedTask, setEditedTask] = useState('')

  const addTask = () => {
    if (ToDo && ((/[a-zA-Z]/.test(ToDo)) || (/\d/.test(ToDo)))) {
      const newTask = {
        id: Date.now().toString(),
        title: ToDo,
        completed: false
      }

      const updatedTodoList = [...todoList, newTask]

      AsyncStorage.getItem('pendingTasks')
        .then((storedTasks) => {
          const parsedTasks = JSON.parse(storedTasks) || []
          const FullList = [...parsedTasks, newTask]

          AsyncStorage.setItem('pendingTasks', JSON.stringify(FullList))
            .then(() => {
              setTodoList(updatedTodoList)
              setToDo('')
            })
            .catch((error) => {
              console.error('Error saving task: ', error)
            })
        })
        .catch((error) => {
          console.error('Error loading tasks: ', error)
        })
    }
  }

  const HandleDeleteToDo = (id) => {
    AsyncStorage.getItem('pendingTasks')
      .then((storedTasks) => {
        const parsedTasks = JSON.parse(storedTasks) || []

        const updateToDoList = todoList.filter((todo) => todo.id !== id)
        const PendingTasks = parsedTasks.filter((task) => task.id !== id)

        AsyncStorage.setItem('pendingTasks', JSON.stringify(PendingTasks))
          .then(() => {
            setTodoList(updateToDoList)


          })
          .catch((error) => {
            console.error('Error deleting task: ', error)
          })
      })
      .catch((error) => {
        console.error('Error loading tasks: ', error)
      })
  }

  const startEditing = (id, title) => {
    setEditMode(true)
    setEditTaskId(id)
    setEditedTask(title)
  }

  const cancelEditing = () => {
    setEditMode(false)
    setEditTaskId(null)
    setEditedTask('')
  }

  const saveEditedTask = () => {
    if (editedTask) {
      const updatedList = todoList.map((task) => {
        if (task.id === editTaskId) {
          return { ...task, title: editedTask }
        }
        return task
      })

      setTodoList(updatedList)
      cancelEditing()
    }
  }

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
      )
    }

    return (
      <View style={styles.tasksDesign}>
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
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }} scrollEnabled={true}>
            <View style={styles.ListofTasks}>
              {todoList.length === 0 ? (
                <Image
                  source={require('../assets/NewToDo.png')}
                  style={styles.emptyListImage}
                />
              ) : (
                <FlatList
                  data={todoList}
                  renderItem={tasksToDo}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.TaskInput}>
            <TextInput
              style={styles.searchBar}
              placeholder="Enter a task"
              multiline={false}
              clearButtonMode="always"
              onChangeText={(userText) => setToDo(userText)}
              value={ToDo}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Tasks

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
    shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 2, paddingTop: 20,
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
    shadowColor: 'black', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.8, shadowRadius: 3, paddingTop: 20,
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
})
