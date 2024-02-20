import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityProvider } from "./ActivityContext";
import ActivityList from "./ActivityList";
import AddActivity from "./AddActivity";
import Calendar from "./Calendar";
import AddWithChatgpt from "./AddWithChatgpt";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  const handleCalendarLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setCalendarHeight(height);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityProvider>
          <View style={styles.content}>
            <View onLayout={handleCalendarLayout} style={styles.calendarContainer}>
              <Calendar setSelectedDate={setSelectedDate} style={styles.calendar} />
            </View>
            <View style={[styles.buttonsContainer, { marginTop: calendarHeight }]}>
              <AddActivity />
              <AddWithChatgpt />
            </View>
            <View style={styles.activityListContainer}>
              <ActivityList selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </View>
          </View>
        </ActivityProvider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop: 10,
  },
});

export default App;
