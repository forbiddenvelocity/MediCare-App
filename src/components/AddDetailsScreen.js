import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Switch, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

const AddDetails = () => {
  const route = useRoute();
  const { patientId } = route.params || {};

  if (!patientId) {
    console.error("No patientId passed to AddDetails screen.");
    return null;
  }

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const docRef = doc(firestore, 'patients', patientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setAge(data.age || '');
          setDiagnosis(data.diagnosis || '');
          setPrescription(data.prescription || '');
          setIsFlagged(data.flagged || false);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const updatePatientInfo = async () => {
    try {
      const docRef = doc(firestore, 'patients', patientId);

      await updateDoc(docRef, {
        name,
        age,
        diagnosis,
        prescription,
        flagged: isFlagged,
      });

      Alert.alert('Success', 'Patient information updated successfully.');
    } catch (error) {
      console.error('Error updating patient:', error);
      Alert.alert('Error', 'Failed to update patient information.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Patient Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Age"
          value={age}
          keyboardType="numeric"
          onChangeText={(text) => setAge(text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Diagnosis</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Diagnosis"
          value={diagnosis}
          onChangeText={(text) => setDiagnosis(text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Prescription</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Prescription"
          value={prescription}
          onChangeText={(text) => setPrescription(text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Flagged as Not Fit for Driving</Text>
        <View style={styles.switchRow}>
          <Switch
            value={isFlagged}
            onValueChange={(value) => setIsFlagged(value)}
          />
          <Text style={styles.switchText}>
            {isFlagged ? 'Not Fit for Driving' : 'Fit for Driving'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={updatePatientInfo}>
        <Text style={styles.updateButtonText}>Update Patient Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switchText: {
    fontSize: 16,
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#f57c00',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddDetails;
