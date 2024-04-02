import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Make sure to install @react-navigation/native and its dependencies


const PatientFormScreen = () => {
  const navigation = useNavigation();
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

  const handleSave = useCallback(() => {
    const newPatientData = {
      name: patientName,
      age,
      medicalHistory: `${diagnosis}; ${prescription}`,
    };
    // Here you would normally add the newPatientData to your state containing the list of patients.
    // For now, we'll simply navigate back.
    navigation.goBack();
  }, [patientName, age, diagnosis, prescription, navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MediCare</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          value={patientName}
          onChangeText={setPatientName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Information"
          value={contactInfo}
          onChangeText={setContactInfo}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>New Diagnosis</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={diagnosis}
          onChangeText={setDiagnosis}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>New Prescription</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={prescription}
          onChangeText={setPrescription}
        />
      </View>
      <View style={styles.medicareAi}>
        <Text style={styles.bottomheaderTitle}>MediCare Ai</Text>
        <Text style={styles.sectionTitle}>Text to Speech</Text>
        <Image
          style={styles.speakerIcon}
          source={{ uri: 'https://iconape.com/wp-content/files/gx/368000/svg/mic-logo-icon-png-svg.png' }} // Replace with your image asset's URL
        />

        
        <View style={styles.transcribedTextContainer}>
          <Text style={styles.transcribedText}>
           
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Optical Character Recognition</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  medicareAi: {
    padding: 16,
  },
  bottomheaderTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#f57c00',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  formGroup: {
    padding: 16,
    backgroundColor: '#f7f7f7',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 10,
  },
  speakerIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 16,
  },
  transcribedTextContainer: {
    backgroundColor: '#fff',
    padding: 16,shadowOffset: { width: 3, height: 3 },
    borderRadius: 10,
    shadowColor: '#000',
    minHeight: 200,
    shadowOpacity: 1.0,
    shadowRadius: 5.41,
    elevation: 4,
  },
  transcribedText: {
    // Style for the transcribed text
  },
});

export default PatientFormScreen;
