import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { TodoListContext } from './TodoListContext';
import TodoItem from './TodoItem'; // Assuming you have a TodoItem component

const TodoList = () => {
  const { TodoList } = useContext(TodoListContext);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View>
        <Text>Todo List</Text>
      {TodoList.map((todo, index) => (
        <View key={todo.id}>
          {/* Render date title if it's the first todo of the day
          {index === 0 || formatDate(TodoList[index - 1].createdTime) !== formatDate(todo.createdTime) ? (
            <Text>{formatDate(todo.createdTime)}</Text>
          ) : null} */}
          <TodoItem todo={todo} />
        </View>
      ))}
    </View>
  );
};

export default TodoList;
