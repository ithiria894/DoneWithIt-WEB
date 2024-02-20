import React, { useContext } from "react";
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import { ActivityContext } from "./ActivityContext";
import ActivityItem from "./ActivityItem";

const ActivityList = ({ selectedDate, setSelectedDate }) => {
  const { activities } = useContext(ActivityContext);

  const handleShowAllActivities = () => {
    setSelectedDate(null);
  };

  const filteredActivities = selectedDate
    ? activities.filter((activity) => {
        const activityDate = new Date(activity.startTime);
        const selectedDateStart = new Date(selectedDate);
        selectedDateStart.setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(selectedDate);
        selectedDateEnd.setHours(23, 59, 59, 999);
        return (
          activityDate >= selectedDateStart && activityDate <= selectedDateEnd
        );
      })
    : activities;

  return (
    <View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleShowAllActivities}
          style={({ pressed }) => [
            styles.showAllButton,
            { backgroundColor: pressed ? "#87CEFA" : "#1E90FF" }, // Blue when not pressed, lighter blue when pressed
          ]}
        >
          <Text style={styles.showAllText}>Show All Activities</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredActivities}
        renderItem={({ item }) => <ActivityItem activity={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "flex-start", // Ensure the container's width adjusts to the text content
    // marginBottom: 10,
  },
  showAllButton: {
    // paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#1E90FF", // Blue border color
  },
  showAllText: {
    fontSize: 12,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
});

export default ActivityList;
