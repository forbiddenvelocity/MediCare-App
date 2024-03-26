import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>MediCare</Text>
      <Text style={styles.subheader}>Manage patient data effectively</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Enter"
          onPress={() => navigation.navigate('Onboarding')} // Navigates to OnboardingScreen
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Adjust the color to match your design
  },
  subheader: {
    fontSize: 18,
    color: '#666', // Adjust the color to match your design
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%', // Full width button
    paddingHorizontal: 30, // Horizontal padding for the button
    color: '#000',
    borderRadius: '20px',
  },
});

export default WelcomeScreen;
