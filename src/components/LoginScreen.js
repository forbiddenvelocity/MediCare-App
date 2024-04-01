import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
      <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Log in</Text>
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
    backgroundColor: 'black', 
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