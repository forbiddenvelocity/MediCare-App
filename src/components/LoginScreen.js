import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firebase from '../../firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Use Firebase Authentication to sign in
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in successfully
        console.log('User logged in:', userCredential.user);
      })
      .catch((error) => {
        // Handle login errors here
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="email-address"
        keyboardType="email-address" // Ensure the email keyboard is used
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style = {styles.text}>or Sign Up with Google</Text>

      <TouchableOpacity style={styles.buttonG} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign Up With Google</Text>
      </TouchableOpacity>
      <View>
      <Image 
        source = {require('../../assets/Medicare.png')}
        style={styles.logo}
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
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonG: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
