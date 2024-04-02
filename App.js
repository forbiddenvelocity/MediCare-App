import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/Welcomescreen';
import OnboardingScreen from './src/components/OnboardingScreen';
import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';
import PatientScreen from './src/components/PatientScreen';
import AddNewScreen from './src/components/AddNewScreen';
import AddDetailsScreen from './src/components/AddDetailsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patient" component={PatientScreen} />
        <Stack.Screen name="AddNew" component={AddNewScreen} />
        <Stack.Screen name="AddDetails" component={AddDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;