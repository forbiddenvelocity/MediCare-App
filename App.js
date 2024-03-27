import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/Welcomescreen';
import LoginScreen from './src/components/LoginScreen';
import OnboardingScreen from './src/components/OnboardingScreen';
import HomeScreen from './src/components/HomeScreen';
import FilterScreen from './src/components/FilterScreen';
import firebase from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Check if Firebase is already initialized to prevent it from initializing again
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;