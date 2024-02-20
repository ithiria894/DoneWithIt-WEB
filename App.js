import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityProvider } from "./ActivityContext";
import ActivityList from "./ActivityList";
import AddActivity from "./AddActivity";
import Calendar from "./Calendar";
import AddWithChatgpt from "./AddWithChatgpt";
import ShowAllActivityButton from "./ShowAllActivityButton"; // Import the new component

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [showAllActivities, setShowAllActivities] = useState(false); 
  const handleCalendarLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setCalendarHeight(height);
  };

  const handleShowAllActivities = () => {
    setShowAllActivities((prevShowAllActivities) => !prevShowAllActivities);
    setSelectedDate((prevSelectedDate) => {
      // If selectedDate is currently null, set it to today's date
      if (prevSelectedDate === null) {
        const today = new Date();
        return today.toISOString(); // Set selectedDate to today's date in ISO format
      }
      // If selectedDate is not null, set it to null
      return null;
    });
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
            <ShowAllActivityButton onPress={handleShowAllActivities} showAll={showAllActivities}/>
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
