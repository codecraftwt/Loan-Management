import {StyleSheet, View} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Dashboard/Home';
import Profile from '../Screens/Dashboard/Profile';
import Outward from '../Screens/Dashboard/Outward';
import Inward from '../Screens/Dashboard/Inward';

export default function BottomNavigation() {
  const Tab = createBottomTabNavigator();

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#b80266',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            fontFamily: 'Poppins-SemiBold',
          },
          tabBarStyle: {
            backgroundColor: '#FFF3E9',
            paddingBottom: 5,
            height: 60,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#b80266',
            shadowOpacity: 0.25,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 2},
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Outward"
          component={Outward}
          options={{
            tabBarIcon: ({color, size}) => (
              <Feather name="arrow-up-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Inward"
          component={Inward}
          options={{
            tabBarIcon: ({color, size}) => (
              <Feather name="arrow-down-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color, size}) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
