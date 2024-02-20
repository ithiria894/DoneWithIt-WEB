import React, { useEffect } from "react";
import { View, Text, Modal, Button, StyleSheet } from "react-native";
import ActivityForm from "./ActivityForm";
import { ActivityContext } from "./ActivityContext";
import { useContext } from "react";

const SingleActivity = ({ activity, modalVisible, setModalVisible }) => {
  const { removeActivity, editActivity } = useContext(ActivityContext);

  useEffect(() => {
    // This effect will be triggered whenever modalVisible changes
    console.log("modalVisible changed:", modalVisible);
  }, [modalVisible]); // Only re-run the effect if modalVisible changes

  const handleSubmit = (newActivity) => {
    editActivity(activity.id, newActivity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>{activity.title}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ActivityForm
            initialActivity={activity}
            onSubmit={handleSubmit}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    marginTop: 2,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 9,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default SingleActivity;
