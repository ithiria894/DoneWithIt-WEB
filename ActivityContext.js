import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { Notifications } from 'expo';

const ActivityContext = createContext();

const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  // Load activities from AsyncStorage on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const savedActivities = await AsyncStorage.getItem('activities');
        if (savedActivities !== null) {
          setActivities(JSON.parse(savedActivities));
        }
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    };

    loadActivities();
  }, []);

  const addActivity = async (activity) => {
    activity.id = Date.now();
    activity.createdTime = new Date().toLocaleString();
    const updatedActivities = [...activities, activity];
    updatedActivities.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    setActivities(updatedActivities);
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
      
      // Schedule reminder/notification
      scheduleReminder(activity);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const removeActivity = async (id) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
      
      // Cancel reminder/notification if exists
      cancelReminder(id);
    } catch (error) {
      console.error('Error removing activity:', error);
    }
  };

  const editActivity = async (id, updatedActivity) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === id) {
        return {
          ...activity,
          ...updatedActivity,
        };
      }
      return activity;
    });
    setActivities(updatedActivities);
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
      
      // Cancel existing reminder/notification and reschedule with updated time
      cancelReminder(id);
      scheduleReminder(updatedActivity);
    } catch (error) {
      console.error('Error editing activity:', error);
    }
  };

  // Function to schedule reminder/notification
  const scheduleReminder = (activity) => {
    const alarmTime = new Date(activity.startTime);
    alarmTime.setMinutes(alarmTime.getMinutes() - parseInt(activity.alarm));
    
    // Check if the alarm time is in the past
    if (alarmTime <= new Date()) {
      console.warn('The alarm time is in the past.');
      return;
    }
    //ALERT TO TELL USER THAT THE REMINDER HAS BEEN SET TO WHAT TIME
    Alert.alert(
      'Reminder Set',
      `A reminder has been set for ${activity.title} at ${alarmTime.toLocaleString()}`,
    );
    



    // Schedule the notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: activity.title,
      },
      trigger: {
        date: alarmTime,
      },
    });
  };

  // Function to cancel reminder/notification
  const cancelReminder = async (id) => {
    // Cancel the notification with the given id
    await Notifications.cancelScheduledNotificationAsync(id.toString());
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, removeActivity, editActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export { ActivityContext, ActivityProvider };
