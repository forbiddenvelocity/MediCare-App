import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PatientCard = ({ name, age, medicalHistory }) => {
const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.age}>Age: {age}</Text>
      <Text style={styles.medicalHistory}>{medicalHistory}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddDetails')}>
        <Text style={styles.buttonText}>ADD MORE DETAILS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
  },
  medicalHistory: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PatientCard;
