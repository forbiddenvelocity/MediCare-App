import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import Voice from 'react-native-voice';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';

const PatientFormScreen = () => {
  const navigation = useNavigation();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [transcribedText, setTranscribedText] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [image, setImage] = useState(null);

  const db = getFirestore(app);

  const handleImagePicking = async (pickFromCamera) => {
    let pickerResult;
  
    // Get permission first
    const permissionResult = await (pickFromCamera
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    // Launch the picker
    pickerResult = pickFromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
  
    console.log('Picker Result:', pickerResult); // Log the entire result
  
    if (!pickerResult.canceled) {
      const uri = pickerResult.assets && pickerResult.assets[0] && pickerResult.assets[0].uri;
      console.log('Picked Image URI:', uri); // Ensure URI is not undefined
      if (uri) {
        setImage(uri);
        await sendToOcrSpace(uri); // Send URI to OCR API
      } else {
        console.error('Image URI is undefined');
      }
    }
  };
  

  const handleCameraOpen = () => {
    handleImagePicking(true);
  };

  const handleGalleryOpen = () => {
    handleImagePicking(false);
  };

  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get Base64 string without prefix
        console.log('Base64 Image Data:', base64String); // Log the Base64 string
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  

  const sendToOcrSpace = async (imageUri) => {
    try {
      const apiKey = 'K81013753788957';
      const formData = new FormData();
  
      formData.append('apikey', apiKey);
      formData.append('language', 'eng');
      formData.append('filetype', 'png'); // Explicitly specify the file type
  
      formData.append('file', {
        uri: imageUri,
        type: 'image/png', // Ensure MIME type matches the image type
        name: 'image.png', // Use an appropriate file name
      });
  
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('OCR Response:', result); // Log the entire response
  
      if (result.ParsedResults && result.ParsedResults.length > 0) {
        setOcrText(result.ParsedResults[0].ParsedText || 'No text found');
      } else {
        setOcrText('No text found');
      }
    } catch (error) {
      console.error('OCR Error:', error); // Log any errors
      setOcrText('Error processing image');
    }
  };
  
  
  const handleSpeechResults = (event) => {
    const { value } = event;
    setTranscribedText(value.join(' '));
  };

  const startRecording = async () => {
    try {
      Voice.onSpeechResults = handleSpeechResults;
      await Voice.start('en-US');
      setIsRecording(true);
      console.log("Started recording");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      console.log("Stopped recording");
    } catch (error) {
      console.error("Could not stop recording", error);
    }
  };

  const uploadRecording = async (recordingUri) => {
    try {
      // Implementation for audio upload and transcription if needed
      // This part can be adapted to work with the transcription results from Voice API
    } catch (error) {
      console.error("Error processing audio", error);
      setTranscribedText("Error processing audio");
    }
  };

  const handleSave = useCallback(async () => {
    try {
      // Ensure the user is signed in to get their UID
      const auth = getAuth(app);
      if (auth.currentUser) {
        // Add a new document with a generated id to the "patients" collection
        const docRef = await addDoc(collection(db, "patients"), {
          name: patientName,
          age,
          gender,
          address,
          contactInfo,
          diagnosis,
          prescription,
          userId: auth.currentUser.uid, // Associate patient with the user's UID
        });

        console.log("Document written with ID: ", docRef.id);
        // Navigate back to the patient list and pass along the new patient's info if needed
        navigation.goBack(); // Or you could navigate to a specific route that displays patient details
      } else {
        console.error("No user signed in to add a patient.");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, [
    patientName,
    age,
    gender,
    address,
    contactInfo,
    diagnosis,
    prescription,
    navigation,
  ]);

  useEffect(() => {
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Image
            style={styles.speakerIcon}
            source={{
              uri: "https://iconape.com/wp-content/files/gx/368000/svg/mic-logo-icon-png-svg.png",
            }}
          />
        </TouchableOpacity>

        <View style={styles.transcribedTextContainer}>
          <Text style={styles.transcribedText}>{transcribedText}</Text>
        </View>
        <Text style={styles.sectionTitle1}>Optical Character Recognition</Text>
        <TouchableOpacity onPress={handleCameraOpen}>
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGalleryOpen}>
          <Text>Upload</Text>
        </TouchableOpacity>
        <ScrollView style={styles.ocrTextContainer}>
          <Text style={styles.ocrText}>{ocrText}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  medicareAi: {
    padding: 16,
  },
  bottomheaderTitle: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#f57c00",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerButton: {
    fontSize: 18,
    color: "#007bff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  sectionTitle1: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    paddingVertical: 10,
  },
  formGroup: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  speakerIcon: {
    width: 30,
    height: 30,
    marginVertical: 10,
  },
  transcribedTextContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
  },
  transcribedText: {
    fontSize: 16,
  },
  ocrTextContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
  },
  ocrText: {
    fontSize: 16,
  },
});

export default PatientFormScreen;
