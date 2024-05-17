import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

const BASE_URL = "http://192.168.0.119:8000/api/"

// app
const GENERATE_GEUST_TOKEN = BASE_URL + "app/guest-access"

// student
const ADD_STUDENT = BASE_URL + "student/add-student"
const ADD_PARENT = BASE_URL + "student/add-parent"
const STUDENT_LOGIN = BASE_URL + "student/login/"

// events
const GET_EVENTS = BASE_URL +  "event/get-events/"


export const ENDPOINTS = {
  ADD_STUDENT: ADD_STUDENT,
  ADD_PARENT: ADD_PARENT,
  GENERATE_GEUST_TOKEN: GENERATE_GEUST_TOKEN,
  STUDENT_LOGIN:STUDENT_LOGIN,
  GET_EVENTS:GET_EVENTS
}

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      console.log('No data found for the key:', key);
      return null;
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
    return null;
  }
};

const getToken = () => {
  console.log("Get Token called...");
  getData("access_token").then(token => {
    if (!token) {
      getData("registrationId").then(id => {
        if (id) {
          getData("guest_token").then(g_token => {
            if (g_token) {
              console.log("Guest token found...");
              return g_token
            } else {
              // need to generate guest token
              console.log("Generate New token...");
              const new_token =  generateGuestToken()
              console.log("Generated New token...", new_token );
              return new_token
            }
          })
        }
      })
    } else {
      console.log("Need a Login");
      return access_token
    }
  })
}

export const generateGuestToken = () => {
  const headers = {
    "Content-Type": "application/json"
  };
  axios
    .get(ENDPOINTS.GENERATE_GEUST_TOKEN, { headers: headers })
    .then(response => {
      if (response) {
        storeData("guest_token", response.data.data)
        return response.data.data
      }
    })
    .catch(error => {
      // showToast("Network Error ! Please use app after sometime")
    })
}


export const Headers = (token) => {
  if (token) {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token,
    };
  
    return headers
  }

  const headers = {
    "Content-Type": "application/json",
  };

  return headers

};

// export const getHeaders = Headers()
// export const getHeaders = {"Content-Type": "application/json",}




export const addLocalData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Data stored successfully!');
  } catch (error) {
    console.log('Error storing data: ', error);
  }
};




export const showToast = (message) => {
  ToastAndroid.show(message, ToastAndroid.LONG)
}

export const isEmpty = (val) => {
  if (val === '') { return true; }
  return false;
}