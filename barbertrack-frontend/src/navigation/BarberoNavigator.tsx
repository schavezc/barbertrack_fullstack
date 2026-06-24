import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import BarberoHomeScreen from '../screens/barbero/BarberoHomeScreen';
import BarberoResenasScreen from '../screens/barbero/BarberoResenasScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BarberoTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#2A2A2A',
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="BarberoHome"
        component={BarberoHomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>
        }}
      />
      <Tab.Screen
        name="BarberoResenas"
        component={BarberoResenasScreen}
        options={{
          tabBarLabel: 'Reseñas',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⭐</Text>
        }}
      />
    </Tab.Navigator>
  );
}

export default function BarberoNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BarberoTabs" component={BarberoTabs} />
      <Stack.Screen name="PerfilBarbero" component={PerfilScreen} />
    </Stack.Navigator>
  );
}