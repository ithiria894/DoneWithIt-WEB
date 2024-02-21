// TodoItem.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button, Alert } from 'react-native';
import { TodoListContext } from './TodoListContext';
// import TodoForm from './TodoForm'; // Assuming you have a TodoForm component

const TodoItem = ({ todo }) => {
  const { removeTodoList, editTodoList } = useContext(TodoListContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRemove = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this todo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            removeTodoList(todo.id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSubmit = (updatedTodo) => {
    editTodoList(todo.id, updatedTodo);
    setModalVisible(false);
  };

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{todo.title}</Text>
          <Text>{todo.description}</Text>
        </View>
        <View>
          <Button title="Delete" color="red" onPress={handleRemove} />
        </View>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TodoForm initialTodo={todo} onSubmit={handleSubmit} onCancel={() => setModalVisible(false)} />
          </View>
        </Modal> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default TodoItem;
