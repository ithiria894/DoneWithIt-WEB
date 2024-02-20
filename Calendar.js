import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { ActivityContext } from "./ActivityContext";
import { StyleSheet } from "react-native";
import SingleActivity from "./SingleActivity";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Calendar = ({ setSelectedDate }) => {
  const { activities } = useContext(ActivityContext);
  const [monthGrid, setMonthGrid] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { width: containerWidth } = useWindowDimensions();

  useLayoutEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    setYear(currentYear);
    setMonth(currentMonth);
    const generatedMonthGrid = generateMonthGrid(currentYear, currentMonth);
    setMonthGrid(generatedMonthGrid);
  }, []);

  // Rest of your component code...



  const generateMonthGrid = (year, month) => {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    const startWeek = startOfWeek(startDate);
    const endWeek = endOfWeek(endDate);

    const days = eachDayOfInterval({ start: startWeek, end: endWeek });
    const monthGrid = [];
    let week = [];

    days.forEach((day, index) => {
      week.push(day);

      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        monthGrid.push(week);
        week = [];
      }
    });

    return monthGrid;
  };

  const getRowHeight = (week) => {
    let maxHeight = 100; // Default height
    week.forEach((day) => {
      const dayEvents = activities.filter((activity) => {
        const activityDate = new Date(activity.startTime);
        return (
          activityDate.getFullYear() === year &&
          activityDate.getMonth() + 1 === month &&
          activityDate.getDate() === day.getDate()
        );
      });
      const cellHeight =
        Math.max(
          100,
          30 + dayEvents.length * 20 + (dayEvents.length - 1) * 5
        ); // Add gap between events
      maxHeight = Math.max(maxHeight, cellHeight);
    });
    return maxHeight;
  };

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const generatedMonthGrid = generateMonthGrid(year, newMonth);
    setMonthGrid(generatedMonthGrid);
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    const generatedMonthGrid = generateMonthGrid(newYear, month);
    setMonthGrid(generatedMonthGrid);
  };

  const handleCellClick = (day) => {
    setSelectedDate(day);
  };

  const handleActivityClick = () => {
    setModalVisible(true);
  };

  const cellWidth = containerWidth / 7;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Text style={styles.monthYear}>
        {format(new Date(year, month - 1), "MMMM                                                      yyyy")}
      </Text>
      <View style={[styles.weekdayContainer, { width: containerWidth }]}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
          <Text key={weekday} style={[styles.weekday, { width: cellWidth }]}>
            {weekday}
          </Text>
        ))}
      </View>
      {monthGrid.map((week, index) => (
        <View
          key={index}
          style={[
            styles.weekContainer,
            { width: containerWidth, height: getRowHeight(week) },
          ]}
        >
          {week.map((day, dayIndex) => (
            <TouchableOpacity
              key={day.toISOString()} // Use a unique identifier for each day
              style={[styles.dayOpacityContainer, { width: cellWidth }]}
              onPress={() => handleCellClick(day)}
            >
              <View
                style={[
                  styles.dayContainer,
                  { width: cellWidth, height: getRowHeight(week) },
                ]}
              >
                <Text style={styles.dayNumber}>{day.getDate().toString()}</Text>
                {activities.map((activity, activityIndex) => {
                  const activityDate = new Date(activity.startTime);
                  if (
                    activityDate.getFullYear() === year &&
                    activityDate.getMonth() + 1 === month &&
                    activityDate.getDate() === day.getDate()
                  ) {
                    return (
                      <TouchableOpacity
                        key={activity.id}
                        onPress={() => handleActivityClick(activity)}
                      >
                        <SingleActivity
                          activity={activity}
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                        />
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={() => handleMonthChange(month - 1)}
        >
          <Text>Prev</Text>
        </TouchableOpacity>
        {/* <Text>                                                                                         </Text> */}
        {/* //make a Now button */}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleMonthChange(new Date().getMonth() + 1)}
        >
          <Text>Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleMonthChange(month + 1)}
        >
          <Text>Next</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.prevButton}
          onPress={() => handleYearChange(year - 1)}
        >
          <Text>Prev Year</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleYearChange(year + 1)}
        >
          <Text>Next Year</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
    color: "red",
  },
  weekdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  weekday: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "grey", // Make weekdays grey
  },
  weekContainer: {
    flexDirection: "row",
  },
  dayOpacityContainer: {
    flex: 1,
  },
  dayContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey", // Make cell borders grey
  },
  dayNumber: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 10,
    padding: 5,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'blue', // Make the day number blue
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  prevButton: {
    marginHorizontal: 5,
  },
  nextButton: {
    marginHorizontal: 5,
  },
});

export default Calendar;
