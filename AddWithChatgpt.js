import React, { useState, useContext } from "react";
import { View, Modal, Text, Button, StyleSheet, TouchableWithoutFeedback, ActivityIndicator ,TextInput} from "react-native";

import { ActivityContext } from "./ActivityContext";
import ActivityForm from "./ActivityForm";
import { Keyboard } from "react-native";
import { Pressable } from "react-native";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAM6FeJ732q8B4D0b25nbcWbO1zwRsOmUw");
import { useEffect } from "react";
import { addQuarters, set } from "date-fns";

const AddWithChatgpt = () => {
  const { addActivity } = useContext(ActivityContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [generatedActivity, setGeneratedActivity] = useState(null);
  const [error, setError] = useState(null);
  const [ActivityFormVisible, setActivityFormVisible] = useState(false);
  const [longPrompt, setLongPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const longPrompt = `
    Helps schedule events from natural language to JSON.
    For phone-based events like calls or Zoom meetings, 
    it defaults to a 5-minute advance reminder unless specified otherwise. 
    For out-of-house events, such as football games, swimming, class not specified online,  or dentist appointments, or interviews not specified online, so on so forth,
    it defaults to reminders at 1 hour in advance, 
    unless a different time is specified by the user.
    All events will have endTime 1 hour after the startTime be default unless specified otherwise.
    Auto input the description if there is supplied information or address in the user input.
    ADDRESS, LOCATION, PLACE, VENUE, or DESTINATION OR SIMILAR WORDINGS will be used to identify the location.
    ADDRESS HAS HIGHER PRIORITY THAN OTHER DESCRIPTIONS. YOU SHOULD PUT ADDRESS TO THE description FIELD FIRST.

    EXAMPLE PROMPT:
    NOW THE TIME IS 2024-02-18T11:00 SUNDAY
    TODAY 3PM I HAVE TO GO TO FOOTBALL, REMIND BE 30MIN AGO, I HAVE TO BRING THE BALL.
    THE PLACE IS AT THE FOOTBALL FIELD NEAR THE PARK.

    return as a JSON object in this format:
    {"title":"Go to football","description":"Bring the ball","address":"FOOTBALL FIELD NEAR THE PARK","startTime":"2024-02-18T15:00","endTime":"2024-02-18T16:00","repeating":"None","alarm":"30"}

    ONLY REPLY THE JSON OBJECT WITH THE DEFINED FORMAT WITH ALL 6 PROPERTIES(title,description,startTime,endTime,repeating,alarm) , NO NEED TO PRINT ANYTHING ELSE.
    startTime AND endTime are in the format of "yyyy-MM-ddThh:mm"
    alarm is in minutes and THE ALARM MUST BE SET NO MATTER WHAT and THE VALUE IS by your common sense(IF ONLINE EVENT, SET IT TO 5 MINUTES, IF OUTDOOR EVENT, SET IT TO 60 MINUTES)
    THE REPLY SHOULD BE USING EXCECTLT THE SAME LANGURAGE AS THE PROMPT BELOW.

    THE PROMPT FROM USER:
    NOW THE TIME IS ${new Date().toLocaleString()}
    ${userInput}
    
  `;
    setLongPrompt(longPrompt);
  }, [userInput]);

  const callGeminiAPI = async () => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(longPrompt);
      const response = await result.response.text();
      console.log("response from GPT-3");
      console.log(response);
      const converted = convertToJson(response);
      console.log("debug message1");

      const newActivity = {
        title: converted.title,
        description: converted.description,
        address: converted.address,
        startTime: converted.startTime,
        endTime: converted.endTime,
        repeating: converted.repeating,
        alarm: converted.alarm,
      };
      console.log("converted JSON object and newActivity:");
      //   console.log("debug message2");
      console.log(newActivity);

      setGeneratedActivity(newActivity);
      console.log("debug message3");
      setModalVisible(false);
      setActivityFormVisible(true);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const convertToJson = (text) => {
    try {
      // Find the index of the first '{' character
      const startIndex = text.indexOf("{");
      if (startIndex === -1) {
        throw new Error("JSON object not found in the text.");
      }

      // Find the index of the last '}' character
      const endIndex = text.lastIndexOf("}");
      if (endIndex === -1) {
        throw new Error("Invalid JSON format: missing closing '}' character.");
      }

      // Extract the JSON string from the text
      const jsonString = text.substring(startIndex, endIndex + 1);

      // remove /n
      // jsonString = jsonString.replace(/\n/g, '');

      // Parse the JSON string
      const jsonData = JSON.parse(jsonString);
      //   console.log(jsonData);

      // Check if the required properties are present

      // Return the JSON object with all properties
      return {
        title: jsonData.title,
        description: jsonData.description,
        address: jsonData.address,
        startTime: jsonData.startTime,
        endTime: jsonData.endTime,
        repeating: jsonData.repeating,
        alarm: jsonData.alarm,
      };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const handleSubmit = (newActivity) => {
    addActivity(newActivity);
    setActivityFormVisible(false);
    setUserInput("");
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUserInput("");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>ADD WITH CHATGPT</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Request</Text>
            <TextInput
              style={styles.input}
              multiline={true}
              placeholder="Enter your request..."
              value={userInput || ""}
              onChangeText={setUserInput}
              editable={true}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Submit" onPress={callGeminiAPI} />
            </View>
            {isLoading && <ActivityIndicator style={styles.activityIndicator} />}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={ActivityFormVisible}
        onRequestClose={() => setActivityFormVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Input</Text>
            <View>
              <Text>{userInput}</Text>
            </View>
            <Text style={styles.modalTitle}>Generated Activity</Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ActivityForm
                onPress={Keyboard.dismiss}
                initialActivity={generatedActivity}
                onSubmit={handleSubmit}
                onCancel={() => setActivityFormVisible(false)}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    justifyContent: "flex-start", // Align at the upper center
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginTop: 120,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 350,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#1E90FF", // Blue border color
  },
  buttonText: {
    fontSize: 12,
    textAlign: "center",
    color: "#1E90FF", // Blue text color
  },
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
  },
  
});

export default AddWithChatgpt;
