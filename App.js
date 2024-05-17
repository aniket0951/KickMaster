/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  useColorScheme,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import LoginScreen from './src/LoginScreen';
import axios from 'axios';
import { ENDPOINTS, access_token, getHeaders, showToast } from './src/helper/endpoints';
import { storeData } from './utils/notification';
import HomeScreen from './src/HomeScreen';

function App() {

  useEffect(() => {
    // checkIsUserLoggedId()
    // getData("access_token")
    checkForAccessToken()
  }, [])

  const checkForAccessToken = () => {
    // if registration id there and access token not found then generate access token for guest
    getData("access_token").then(token => {
      if (!token) {
        getData("registrationId").then(id => {
          if (id) {
            getData("guest_token").then(g_token => {
              generateGuestToken();
            })
          }
        })
      }
    })
  }

  const generateGuestToken = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(ENDPOINTS.GENERATE_GEUST_TOKEN, { headers:headers })
      .then(response => {
        if (response) {
          storeData("guest_token", response.data.data)
          access_token = response.data.data``
        }
      })
      .catch(error => {
        // showToast("Network Error ! Please use app after sometime")
      })
  }

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('Data retrieved successfully:', value);
        return value;
      } else {

      }
    } catch (error) {
      console.log('Error retrieving data:', error);
      return null;
    }
  };


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LoginScreen}
          options={(navigation) => ({
            headerShown: true, headerTitle: "",
            headerTitleStyle: { color: '#f87217', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22 },
            headerStyle: { backgroundColor: '#9394a5' },
            // headerRight: () => <Text style={{ color: '#f87217', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22, marginRight: 10 }}>Jay Bhavani !</Text>,
            // headerLeft:() => <HamburgerIcon navigation={navigation}  />
            headerLeft: () => <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22, marginRight: 10 }}>Kick Master </Text>,

          })}
        />

        <Stack.Screen
          name="HomeScreen" component={HomeScreen}
          options={(navigation) => ({
            headerShown: true, headerTitle: "",
            headerTitleStyle: { color: '#f87217', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22 },
            headerStyle: { backgroundColor: '#9394a5' },
            // headerRight: () => <Text style={{ color: '#f87217', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22, marginRight: 10 }}>Jay Bhavani !</Text>,
            // headerLeft:() => <HamburgerIcon navigation={navigation}  />
            headerLeft: () => <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'serif', fontSize: 22, marginRight: 10 }}>Kick Master </Text>,

          })}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
