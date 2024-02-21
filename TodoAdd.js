//TodoAdd.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { TodoListContext } from './TodoListContext';

const TodoAdd = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [todoTitle, setTodoTitle] = useState(''); // Changed state variable name to todoTitle
  const { addTodoList } = useContext(TodoListContext);

  const handleSaveTodo = () => {
    if (todoTitle.trim() !== '') {
      addTodoList({ title: todoTitle }); // Adjusted to pass title as an object property
      setTodoTitle(''); // Reset todoTitle after adding todo
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Todo</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setTodoTitle(text)} // Updated to set todoTitle
            value={todoTitle}
            placeholder="Enter your todo..."
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonClear]} onPress={() => setTodoTitle('')}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSaveTodo}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginBottom: 0,
    paddingVertical: 5,
    // paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#1E90FF", // Blue border color
    backgroundColor: "#1E90FF", // Blue background color
  },
  buttonText: {
    fontSize: 12,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '30%',
  },
  buttonCancel: {
    backgroundColor: '#FF6347', // Tomato color
  },
  buttonClear: {
    backgroundColor: '#FFD700', // Gold color
  },
  buttonSave: {
    backgroundColor: '#32CD32', // LimeGreen color
  },
});

export default TodoAdd;
