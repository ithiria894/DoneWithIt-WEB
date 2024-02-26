import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { ActivityContext } from "./ActivityContext";
import ActivityItem from "./ActivityItem";
import ShowAllActivityButton from "./ShowAllActivityButton"; // Import the new component

const ActivityList = ({ selectedDate, setSelectedDate }) => {
  const { activities } = useContext(ActivityContext);

  // Filter activities based on selectedDate
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

  // Function to format date in desired format (dd-mm-yyyy)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View>
      <FlatList
        data={filteredActivities}
        renderItem={({ item, index }) => (
          <>
            {/* Render date title if it's the first activity of the day */}
            {index === 0 || formatDate(filteredActivities[index - 1].startTime) !== formatDate(item.startTime) ? (
              <Text>{formatDate(item.startTime)}</Text>
            ) : null}
            <ActivityItem activity={item} />
          </>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ActivityList;
