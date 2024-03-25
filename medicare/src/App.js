// src/App.js
import React from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import FilterScreen from './components/FilterScreen';

const App = () => {
  return (
    <>
      <WelcomeScreen />
      <OnboardingScreen />
      <HomeScreen />
      <FilterScreen />
    </>
  );
};

export default App;
