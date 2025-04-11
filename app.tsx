import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './app/types'; // Adjust the import path if necessary
import IndexScreen from './app/index'; // Adjust path if necessary
import QuizScreen from './app/addition'; // Adjust path if necessary

const Stack = createStackNavigator<RootStackParamList>();  // Set up type for stack navigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={IndexScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
