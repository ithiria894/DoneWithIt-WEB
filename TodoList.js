import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TodoListContext } from './TodoListContext';
import TodoItem from './TodoItem'; // Assuming you have a TodoItem component
import { StyleSheet } from 'react-native';

const TodoList = () => {
  const { TodoList } = useContext(TodoListContext);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderItem = ({ item }) => (
    <View key={item.id}>
      {/* Render date title if it's the first todo of the day
      {index === 0 || formatDate(TodoList[index - 1].createdTime) !== formatDate(item.createdTime) ? (
        <Text>{formatDate(item.createdTime)}</Text>
      ) : null} */}
      <TodoItem todo={item} />
    </View>
  );

  return (
    <FlatList
      data={TodoList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<Text style={styles.todolistTitle}>Todo List</Text>}
    />
  );
};

const styles = StyleSheet.create({
  todolistTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default TodoList;
