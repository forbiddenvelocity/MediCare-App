import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OnboardingScreen = ({ navigation }) => {
    const handlePressSpeaker = () => {
        // Logic to start recording audio
        console.log('Start recording audio');
      };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select patient's problem type</Text>
      <Text style={styles.subtitle}>Use speech-to-text</Text>

      <TouchableOpacity onPress={handlePressSpeaker} style={styles.speakerButton}>
        <Icon name="keyboard-voice" size={30} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.grid}>
        {/* Placeholder for the grid items */}
        {Array.from({ length: 6 }).map((_, index) => (
          <TouchableOpacity key={index} style={styles.gridItem} onPress={() => {}}>
            <Text style={styles.gridItemText}>Placeholder {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.ignoreButton} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.ignoreButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  speakerButton: {
    alignSelf: 'center', 
    padding: 10,
    paddingBottom: 100,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // approximately 50% minus margin
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gridItemText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ignoreButton: {
    backgroundColor: '#000', // Assuming a black button for 'Ignore'
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  continueButton: {
    backgroundColor: '#000', // Assuming a black button for 'Continue'
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ignoreButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  continueButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
