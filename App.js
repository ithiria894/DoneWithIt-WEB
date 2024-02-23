import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { ActivityProvider } from "./ActivityContext";
import ActivityList from "./ActivityList";
import AddActivity from "./AddActivity";
import Calendar from "./Calendar";
import AddWithChatgpt from "./AddWithChatgpt";
import ShowAllActivityButton from "./ShowAllActivityButton";
import TodoList from "./TodoList";
import { TodoListProvider } from "./TodoListContext";
import TodoAdd from "./TodoAdd";
import { set } from "date-fns";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [todoListVisible, setTodoListVisible] = useState(false);
  const [TodoAddVisible, setTodoAddVisible] = useState(false);
  const todoListWidth = 300; // Adjust the width of the TodoList here
  const [todoListAnimation, setTodoListAnimation] = useState(
    new Animated.Value(todoListWidth)
  );

  const handleCalendarLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setCalendarHeight(height);
  };

  const handleShowAllActivities = () => {
    setShowAllActivities((prevShowAllActivities) => !prevShowAllActivities);
    setSelectedDate((prevSelectedDate) => {
      if (prevSelectedDate === null) {
        const today = new Date();
        return today.toISOString();
      }
      return null;
    });
  };

  const toggleTodoList = () => {
    setTodoListVisible(!todoListVisible);
    setTodoAddVisible(!TodoAddVisible);

    Animated.timing(todoListAnimation, {
      toValue: todoListVisible ? todoListWidth : 0, // Toggle between 0 and the width
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <ActivityProvider>
            <TodoListProvider>
              <View style={styles.content}>
                <View
                  onLayout={handleCalendarLayout}
                  style={styles.calendarContainer}
                >
                  <Calendar
                    setSelectedDate={setSelectedDate}
                    style={styles.calendar}
                  />
                </View>
                <View
                  style={[
                    styles.buttonsContainer,
                    { marginTop: calendarHeight },
                  ]}
                >
                  <ShowAllActivityButton
                    onPress={handleShowAllActivities}
                    showAll={showAllActivities}
                  />
                  <AddActivity />

                  <AddWithChatgpt />
                </View>
                <View style={styles.activityListContainer}>
                  <ActivityList
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </View>
                <Animated.View
                  style={[
                    styles.todoListContainer,
                    { transform: [{ translateX: todoListAnimation }] }, // Use the animated value here
                  ]}
                >
                  <TodoList />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.tag,
                    {
                      transform: [
                        // TranslateX for the tag should be the negative of the todoList's translateX plus the width of the todoList to stick to its left side
                        {
                          translateX: todoListAnimation.interpolate({
                            inputRange: [0, todoListWidth],
                            outputRange: [-todoListWidth, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity onPress={toggleTodoList}>
                    <Text style={styles.tagText}>Todos</Text>
                    {TodoAddVisible && <TodoAdd />}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TodoListProvider>
          </ActivityProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  activityListContainer: {
    flex: 1,
    marginTop: 0,
  },
  todoListContainer: {
    position: "absolute",
    right: 0,
    top: 100,
    bottom: 0,
    width: 300, // Set the width of the TodoList
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  tag: {
    position: "absolute",
    right: 0,
    top: 500, // Adjust the position of the tag as needed
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  tagText: {
    color: "#FFF",
  },
});

export default App;
