import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../Screen/HomeScreen';
import SignInScreen from '../Screen/SignInScreen';
import SignUpScreen from '../Screen/SignUpScreen';
import SignOutScreen from '../Screen/SignOutScreen';
import TodoListsScreen from '../Screen/TodoListsScreen';
import TodoListScreen from '../Screen/TodoListScreen';
import AboutScreen from '../Screen/AboutScreen';

import { TokenContext } from '../Context/Context';
import { TabStyle } from '../components/Components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TodoStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TodoLists" component={TodoListsScreen} />
      <Stack.Screen name="TodoList" component={TodoListScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const [token] = useContext(TokenContext);

  return (
    <NavigationContainer>
      {token == null ? (
        <Tab.Navigator screenOptions={({ route }) => TabStyle(route)}>
          <Tab.Screen name="Se connecter" component={SignInScreen} />
          <Tab.Screen name="S'inscrire" component={SignUpScreen} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator screenOptions={({ route }) => TabStyle(route)}>
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="TodoLists" component={TodoStackNavigation} />
          <Tab.Screen name="A Propos" component={AboutScreen} />
          <Tab.Screen name="Deconnexion" component={SignOutScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

