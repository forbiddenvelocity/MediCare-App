import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {

  const data = [
    'Medical Records',
    'Upload Patient',
    'Patient History',
    'Search and Filter',
    'Appointments',
    'Notes',
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to MediCarePro</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
            <Text style={styles.buttonText}>Problem Type</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.patientOverview}>
        <Text style={styles.sectionTitle}>Patient Overview</Text>
        <Text>Track daily patient progress here</Text>
        {/* Placeholder for progress bar */}
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Medical</Text>
        <View style={styles.grid}>
        {data.map((dataText, index) => (
        <TouchableOpacity key={index} style={styles.gridItem} onPress={() => {}}>
          <Text style={styles.gridItemText}>{dataText}</Text>
        </TouchableOpacity>
      ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Assuming a white background
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000', // Assuming a black button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
  },
  patientOverview: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // A light grey background for the container
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    width: '76%', // Assuming 76% progress
    height: '100%',
    backgroundColor: '#4caf50', // A green progress bar
  },
  sectionContainer: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // approximately 50% minus margin
    aspectRatio: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 8,
  },
  gridItemText: {
    fontSize: 16,
  },
  // ... Add any other styles you might need
});

export default HomeScreen;
