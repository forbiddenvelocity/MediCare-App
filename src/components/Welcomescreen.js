import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source = {require('../../assets/Medicare.png')}
        style={styles.logo}
      />
      <Image
  source={require('../../assets/WelcomeAsset.jpg')}
  style={styles.image}
/>
      <Text style={styles.header}>MediCare</Text>
      <Text style={styles.subheader}>Manage patient data effectively</Text>
      <TouchableOpacity style={styles.ignoreButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ignoreButtonText}>Enter</Text>
        </TouchableOpacity>
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
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'stretch',
    paddingBottom: '10',

  },
  image: {
    width: 300, 
    height: 300, 
    resizeMode: 'contain'
  },
  ignoreButton: {
    backgroundColor: '#000', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ignoreButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', 
  },
  subheader: {
    fontSize: 18,
    color: '#666', 
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%', 
    paddingHorizontal: 30, 
    color: '#000',
  },
});

export default WelcomeScreen;
