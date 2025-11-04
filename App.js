import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import GoogleMapsScreen from './screens/GoogleMapsScreen';
import MapboxScreen from './screens/MapboxScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: route.name === 'Google' ? '🔵 Google Maps' : '🟡 Mapbox',
          tabBarActiveTintColor: '#4285F4',
          tabBarInactiveTintColor: '#ccc',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f0f0f0',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen
          name="Google"
          component={GoogleMapsScreen}
          options={{
            title: 'Google Maps API',
          }}
        />
        <Tab.Screen
          name="Mapbox"
          component={MapboxScreen}
          options={{
            title: 'Mapbox / OpenStreetMap',
          }}
        />
      </Tab.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
