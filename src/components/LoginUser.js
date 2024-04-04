import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebaseConfig.js";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        console.log("User logged in:", userCredential.user);
        navigation.navigate('Home'); // Navigate to the Home screen upon success
      })
      .catch((error) => {
        // Login failed
        console.log("Error in login:", error);
        Alert.alert("Login Failed", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Login</Text>
      <Text style={styles.subtitle}>Access your medical records securely</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => {/* Toggle Remember Me */}}>
          <Text style={styles.rememberMeText}>⬜️</Text>
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>
      <TouchableOpacity onPress={() => {/* Navigate to reset password screen */}}>
        <Text style={styles.link}>Reset password</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles defined in the provided snippet are reused here
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white',
      },
      avatar: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
      },
      title: { 
        fontWeight: 'bold', 
        fontSize: 24, 
        marginVertical: 8 
      },
      subtitle: { 
        fontSize: 16, 
        marginBottom: 20 
      },
      input: { 
        borderWidth: 1, 
        borderColor: 'grey', 
        borderRadius: 5, 
        width: '80%', 
        padding: 10, 
        marginVertical: 5 
      },
      button: { 
        backgroundColor: '#f57c00', 
        width: '80%', 
        padding: 15, 
        alignItems: 'center', 
        borderRadius: 5, 
        marginVertical: 10 
      },
      button1: { 
        backgroundColor: 'gray', 
        width: '80%', 
        padding: 15, 
        alignItems: 'center', 
        borderRadius: 5, 
        marginVertical: 10 
      },
      buttonText: { 
        color: 'white', 
        fontSize: 18 
      },
      rememberMeContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 5 
      },
      rememberMeText: { 
        marginHorizontal: 5 
      },
      link: { 
        color: 'blue' 
      }
});

export default LoginScreen;
