import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ARScreen from '../screens/ARScreen';
import CitasScreen from '../screens/CitasScreen';
import HistorialScreen from '../screens/HistorialScreen';
import PerfilScreen from '../screens/PerfilScreen';
import BarberoNavigator from './BarberoNavigator';
import RegisterBarberoScreen from '../screens/RegisterBarberoScreen';
import DejarResenaScreen from '../screens/DejarResenaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
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
        name="Inicio"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Estilos"
        component={ARScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✂</Text> }}
      />
      <Tab.Screen
        name="Citas"
        component={CitasScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text> }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🕐</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="MainBarbero" component={BarberoNavigator} />
        <Stack.Screen name="AR" component={ARScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="RegisterBarbero" component={RegisterBarberoScreen} />
        <Stack.Screen name="DejarResena" component={DejarResenaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}