//TodoListContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoListContext = createContext();

const TodoListProvider = ({ children }) => {
  const [TodoList, setTodoList] = useState([]);

  // Load TodoList from AsyncStorage on component mount
  useEffect(() => {
    const loadTodoList = async () => {
      try {
        const savedTodoList = await AsyncStorage.getItem('TodoList');
        if (savedTodoList !== null) {
          setTodoList(JSON.parse(savedTodoList));
        }
      } catch (error) {
        console.error('Error loading TodoList:', error);
      }
    };

    loadTodoList();
  }, []);

  const addTodoList = async (newTodo) => {
    newTodo.id = Date.now();
    newTodo.createdTime = new Date().toLocaleString();
    const updatedTodoList = [...TodoList, newTodo]; // Changed variable name to newTodo
    setTodoList(updatedTodoList);
    try {
      await AsyncStorage.setItem('TodoList', JSON.stringify(updatedTodoList));
      
      // Schedule reminder/notification
    //   scheduleReminder(TodoList);
    } catch (error) {
      console.error('Error saving TodoList:', error);
    }
  };

  const removeTodoList = async (id) => {
    const updatedTodoList = TodoList.filter(todo => todo.id !== id); // Changed variable name to todo
    setTodoList(updatedTodoList);
    try {
      await AsyncStorage.setItem('TodoList', JSON.stringify(updatedTodoList));
      
      // Cancel reminder/notification if exists
    //   cancelReminder(id);
    } catch (error) {
      console.error('Error removing TodoList:', error);
    }
  };

  const editTodoList = async (id, updatedTodoData) => {
    const updatedTodoList = TodoList.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          ...updatedTodoData,
        };
      }
      return todo;
    });
    setTodoList(updatedTodoList);
    try {
      await AsyncStorage.setItem('TodoList', JSON.stringify(updatedTodoList));
      
      // Cancel existing reminder/notification and reschedule with updated time
    //   cancelReminder(id);
    //   scheduleReminder(updatedTodoList);
    } catch (error) {
      console.error('Error editing TodoList:', error);
    }
  };

  return (
    <TodoListContext.Provider value={{ TodoList, addTodoList, removeTodoList, editTodoList }}>
      {children}
    </TodoListContext.Provider>
  );
};

export { TodoListContext, TodoListProvider };
