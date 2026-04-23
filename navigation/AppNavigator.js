import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PlanetsScreen from '../screens/PlanetsScreen';
import FilmsScreen from '../screens/FilmsScreen';
import SpaceshipsScreen from '../screens/SpaceshipsScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const SCREENS = [
  { name: 'Planets', component: PlanetsScreen },
  { name: 'Films', component: FilmsScreen },
  { name: 'Spaceships', component: SpaceshipsScreen },
];

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#FFE81F',
        tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#FFE81F' },
        tabBarActiveTintColor: '#FFE81F',
        tabBarInactiveTintColor: '#888',
      }}
    >
      {SCREENS.map(({ name, component }) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#FFE81F',
        drawerStyle: { backgroundColor: '#1a1a2e' },
        drawerActiveTintColor: '#FFE81F',
        drawerInactiveTintColor: '#aaa',
      }}
    >
      {SCREENS.map(({ name, component }) => (
        <Drawer.Screen key={name} name={name} component={component} />
      ))}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {Platform.OS === 'ios' ? <BottomTabNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}
