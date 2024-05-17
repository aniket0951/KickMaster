import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import ProfileScreen from './ProfileScreen';
import AttendanceScreen from './AttendanceScreen';

function HomeScreen() {
  return (
    <Tab.Navigator initialRouteName='Profile'
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    // borderTopStartRadius: 20,
                    // borderTopEndRadius: 20,
                    height: 45,
                    borderTopWidth: 0,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 15,
                    marginBottom: 15,
                    fontWeight: 'bold'
                },
                tabBarHideOnKeyboard: true,
                tabBarActiveBackgroundColor: '#d3d3d3'
            })}

        >
            <Tab.Screen
                name='Profile' component={ProfileScreen}
                options={{ headerShown: false, tabBarLabel: 'Profile', tabBarIcon: () => null }}
            />
            <Tab.Screen
                name='Attendance' component={AttendanceScreen}
                options={{ headerShown: false, tabBarLabel: 'Attendance', tabBarIcon: () => null }}
            />
        </Tab.Navigator>
  )
}

export default HomeScreen