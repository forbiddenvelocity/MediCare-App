import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebaseConfig.js";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const signUp = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Handle account creation success
        console.log("User created:", userCredential.user);
        navigation.navigate('Home'); // Navigate to the Home screen upon success
      })
      .catch((error) => {
        // Handle errors here
        console.log("Error in sign-up:", error);
      });
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>Doctor Login</Text>
      <Text style={styles.subtitle}>Access your medical records securely</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button}  onPress={signUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1}  onPress={() => navigation.navigate("LogUser")}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.rememberMeText}>{rememberMe ? '☑️' : '⬜️'}</Text>
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>
      <TouchableOpacity onPress={() => {/* Navigate to reset password screen */}}>
        <Text style={styles.link}>Reset password</Text>
      </TouchableOpacity>
    </View>
  );
};

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
