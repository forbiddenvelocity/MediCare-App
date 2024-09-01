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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Storage functions
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
  const storage = getStorage(app); // Initialize Firebase Storage

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
        await handleUploadAndOcr(uri); // Handle uploading and OCR processing
      } else {
        console.error('Image URI is undefined');
      }
    }
  };

  const handleUploadAndOcr = async (uri) => {
    try {
      // Convert the image URI to a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create a reference in Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}.png`);

      // Upload the Blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('Image uploaded successfully. URL:', downloadURL);

      // Send the image to OCR API and get the text
      await sendToOcrSpace(uri, downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const sendToOcrSpace = async (imageUri, imageUrl) => {
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

      let extractedText = 'No text found';
      if (result.ParsedResults && result.ParsedResults.length > 0) {
        extractedText = result.ParsedResults[0].ParsedText || 'No text found';
      }
      setOcrText(extractedText);

      // Save the OCR text and image URL to Firestore
      await saveOcrDataToFirestore(extractedText, imageUrl);
    } catch (error) {
      console.error('OCR Error:', error); // Log any errors
      setOcrText('Error processing image');
    }
  };

  const saveOcrDataToFirestore = async (ocrText, imageUrl) => {
    try {
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
          ocrText: ocrText, // Add extracted OCR text
          imageUrl: imageUrl, // Add the image URL
        });

        console.log("Document written with ID: ", docRef.id);
        // Navigate back to the patient list and pass along the new patient's info if needed
        navigation.goBack();
      } else {
        console.error("No user signed in to add a patient.");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCameraOpen = () => {
    handleImagePicking(true);
  };

  const handleGalleryOpen = () => {
    handleImagePicking(false);
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