import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const App = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Card
        title="Welcome, User!"
        isImageCard={true}
      />
      <Card
        title="Manage your patients' records"
        content={[
          { label: 'View existing', icon: 'file-text-o', navigate: 'Patient' },
          { label: 'Add new', icon: 'plus-square-o', navigate: 'AddNew' } // Added navigation to 'AddNewScreen'
        ]}
        navigation={navigation}
      />
      <Card
        title="Patient Insurance Options"
        content={[
          { label: 'Health Insurance', icon: 'heart-o' },
          { label: 'Travel Insurance', icon: 'plane' },
          { label: 'Car Insurance', icon: 'car' },
          { label: 'Life Insurance', icon: 'user-o' }
        ]}
        navigation={navigation}
      />
      <Card
        title="New Insurance Plans"
        content={[
          { label: 'Work Insurance', icon: 'briefcase' },
          { label: 'Group Insurance', icon: 'users' }
        ]}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const Card = ({ title, content = [], isImageCard = false, navigation }) => {
  const handlePress = (navigate) => {
    if (navigate && navigation) {
      navigation.navigate(navigate);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {isImageCard ? (
        <Image style={styles.cardImage} source={{ uri: 'https://media.istockphoto.com/photos/medical-records-picture-id512336518?k=6&m=512336518&s=612x612&w=0&h=wLLR3RRrhOG5iVBWUgYJSrNIDinl-ESEKmoUtGs0NT8=' }} />
      ) : (
        content.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.button}
            onPress={() => handlePress(item.navigate)}
          >
            <FontAwesome name={item.icon} size={24} color="black" />
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default App;
