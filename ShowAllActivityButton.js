import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

const ShowAllActivityButton = ({ onPress, showAll }) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.showAllButton,
          { backgroundColor: pressed ? "#87CEFA" : "#1E90FF" },
        ]}
      >
        <Text style={styles.showAllText}>
          {showAll ? "Show All Activities":"Today's Activities" }
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "flex-start",
  },
  showAllButton: {
    marginBottom: 0,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 10,
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

export default ShowAllActivityButton;
