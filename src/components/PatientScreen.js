import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import PatientCard from './PatientCard'; // Import PatientCard component
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';


const PatientScreen = () => {
  const [patients, setPatients] = useState([]);
    const navigation = useNavigation();
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'patients'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
  
      fetchData();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Medical Records</Text>
      </View>
      <View style={styles.searchSection}>
        <TextInput style={styles.searchBar} placeholder="Search" />
        <FontAwesome name="search" style={styles.searchIcon} size={20} color="#000" />
      </View>
      <ScrollView>
        {/* Example patients */}
        <PatientCard name="John Doe" age="45" medicalHistory="High blood pressure, Diabetes" />
        <PatientCard name="Jane Smith" age="32" medicalHistory="Allergic to penicillin" />
        <PatientCard name="Michael Brown" age="50" medicalHistory="Cholesterol issues, Hypertension" />
        <PatientCard name="Darsh Tibrewal" age="19" medicalHistory="Allergic to Women" />
        <PatientCard name="Mubashir" age="20" medicalHistory="Monkey" />
        {patients.map(patient => (
          <PatientCard
            key={patient.id}
            name={patient.name}
            age={patient.age}
            medicalHistory={patient.medicalHistory}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNew')}>
        <Text style={styles.addButtonText}>Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#f57c00',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
});

export default PatientScreen;
