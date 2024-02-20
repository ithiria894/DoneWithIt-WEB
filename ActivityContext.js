// ActivityContext.js
import React, { createContext, useState } from 'react';
import Activity from './activity';

const ActivityContext = createContext();

const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  const addActivity = (activity) => {
    activity.id = Date.now();
    activity.createdTime = new Date().toLocaleString();
    setActivities([...activities, activity]);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const editActivity = (id, updatedActivity) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return {
          ...activity,
          ...updatedActivity,
        };
      }
      return activity;
    }));
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, removeActivity, editActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export { ActivityContext, ActivityProvider };
