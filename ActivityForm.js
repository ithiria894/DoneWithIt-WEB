import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

const ActivityForm = ({ initialActivity, onSubmit, onCancel }) => {
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    address: "",
    startTime: "",
    endTime: "",
    repeating: false,
    alarm: "0",
  });

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (initialActivity) {
      console.log("initialActivity:", initialActivity);
      setActivity(initialActivity);
    }
  }, [initialActivity]);

  const handleChange = (name, value) => {
    setActivity({
      ...activity,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Submitting activity:", activity);
    onSubmit(activity);
  };

  const alarmOptions = [
    { label: "None", value: "0" },
    { label: "5 minutes", value: "5" },
    { label: "15 minutes", value: "15" },
    { label: "30 minutes", value: "30" },
    { label: "1 hour", value: "60" },
    { label: "2 hours", value: "120" },
  ];

  const renderAlarmOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        handleChange("alarm", item.value);
        setShowDropdown(false);
      }}
    >
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={activity.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={activity.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Address"
        value={activity.address}
        onChangeText={(text) => handleChange("address", text)}
      />
      <Text style={styles.label}>Start Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter start time"
        value={activity.startTime}
        onChangeText={(text) => handleChange("startTime", text)}
      />
      <Text style={styles.label}>End Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter end time"
        value={activity.endTime}
        onChangeText={(text) => handleChange("endTime", text)}
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Repeating:</Text>
        <Switch
          value={activity.repeating}
          onValueChange={(value) => handleChange("repeating", value)}
        />
      </View>
      <Text style={styles.label}>Alarm:</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(true)}
      >
        <Text>{alarmOptions.find((opt) => opt.value === activity.alarm)?.label || "Select Alarm"}</Text>
      </TouchableOpacity>
      <Modal
        visible={showDropdown}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={alarmOptions}
            renderItem={renderAlarmOption}
            keyExtractor={(item) => item.value}
          />
          <Button title="Close" onPress={() => setShowDropdown(false)} />
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        
        <Button title="Cancel" onPress={onCancel} />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ActivityForm;
