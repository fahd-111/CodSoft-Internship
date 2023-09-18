// Import necessary dependencies
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const TaskAddScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId, taskTitle } = route.params || {};

  const [editedTask, setEditedTask] = useState(taskTitle);

  const saveEditedTask = () => {
    if (editedTask) {
      // Pass the edited task back to the Tasks screen
      console.log(editedTask)
      navigation.goBack({
        
        editedTask: { id: taskId, title: editedTask },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Edit the task"
        value={editedTask}
        onChangeText={(text) => setEditedTask(text)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveEditedTask}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default TaskAddScreen;
