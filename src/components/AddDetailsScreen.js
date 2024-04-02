import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Make sure to install @react-navigation/native

const AddDetailsScreen = () => {
  const navigation = useNavigation();
  const [diagnosis, setDiagnosis] = useState('Headache and fever');
  const [prescription, setPrescription] = useState('Paracetamol - 500mg, 1 tablet every 6 hours');

  // Function to handle the save operation
  const handleSave = () => {
    // Logic to save changes
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Patient Details</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        {/* Placeholder for image */}
        <Text style={styles.imagePlaceholder}>Image Placeholder</Text>
        <Text style={styles.patientName}>John Doe</Text>
        <Text style={styles.patientInfo}>Age: 45</Text>
        <Text style={styles.patientInfo}>Gender: Male</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnosis</Text>
        <TextInput
          style={styles.input}
          value={diagnosis}
          onChangeText={setDiagnosis}
          multiline
        />
        <Text style={styles.lastUpdated}>Last Updated: 2022-10-15 10:30 AM</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prescription</Text>
        <TextInput
          style={styles.input}
          value={prescription}
          onChangeText={setPrescription}
          multiline
        />
        <Text style={styles.lastUpdated}>Last Updated: 2022-10-15 10:30 AM</Text>
      </View>
      <TouchableOpacity style={styles.saveChangesButton}>
        <Text style={styles.saveChangesButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 18,
    color: 'black', // black color for back button
  },
  saveButton: {
    fontSize: 18,
    color: '#f57c00', // orange color for save button
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e1e1e1',
    borderRadius: 50,
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 100, // This is for vertical centering text in the placeholder
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  saveChangesButton: {
    backgroundColor: '#f57c00', // orange color for save changes button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  saveChangesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#000',
  },
});

export default AddDetailsScreen;
