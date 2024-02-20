import React, { useState, useContext } from "react";
import { View, Button, Modal, StyleSheet } from "react-native";
import { ActivityContext } from "./ActivityContext";
import ActivityForm from "./ActivityForm";
import { Keyboard } from "react-native";
import { Pressable, Text } from "react-native";

const AddActivity = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { addActivity } = useContext(ActivityContext);

  const handleSubmit = (activity) => {
    // Handle submission logic here
    addActivity(activity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#87CEFA" : "#1E90FF" }, // Blue when not pressed, lighter blue when pressed
          ]}
        >
          <Text style={styles.buttonText}>Add Activity</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ActivityForm
            onSubmit={handleSubmit}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    marginBottom: 0,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#1E90FF", // Blue border color
  },
  buttonText: {
    fontSize: 12,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
});

export default AddActivity;
