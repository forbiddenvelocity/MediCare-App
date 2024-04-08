import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

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

  const recordingOptions = {
    // Check if the following format is compatible with your API and devices
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

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

    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
      sendToNewOCRAPI(pickerResult.uri);
    }
  };

  // Modify handleCameraOpen and handleGalleryOpen to use handleImagePicking
  const handleCameraOpen = () => {
    handleImagePicking(true);
  };

  const handleGalleryOpen = () => {
    handleImagePicking(false);
  };

  const sendToNewOCRAPI = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('srcImg', {
        uri: imageUri,
        type: 'image/png', // Adjust the MIME type to match your image type
        name: 'image.png', // Adjust the filename to match your image
      });
      formData.append('Session', 'string'); // If required by the API
  
      const response = await fetch('https://ocr-image-to-text4.p.rapidapi.com/', {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': 'e92edab7ecmsh10154b4bee4b96cp1d7ca5jsn30f647611c4c',
          'X-RapidAPI-Host': 'ocr-image-to-text4.p.rapidapi.com',
          // 'Content-Type': 'multipart/form-data' may be needed, but often it's not required as fetch adds it automatically with the correct boundary.
        },
        body: formData,
      });
  
      const responseData = await response.json();
      console.log('OCR Response:', responseData);
  
      if (responseData && responseData.text) {
        setOcrText(responseData.text);
      } else {
        setOcrText('No text returned from OCR service');
      }
    } catch (error) {
      console.error('New OCR API Error: ', error);
      setOcrText('Error processing image');
    }
  };
  

  const uploadRecording = async (recordingUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: recordingUri,
        type: "audio/wav", // Ensure this matches the actual audio file type
        name: "recording.wav", // The filename doesn't affect the API request
      });
  
      const response = await fetch(
        "https://whisper-speech-to-text1.p.rapidapi.com/speech-to-text",
        {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": "e92edab7ecmsh10154b4bee4b96cp1d7ca5jsn30f647611c4c",
            "X-RapidAPI-Host": "whisper-speech-to-text1.p.rapidapi.com",
          },
          body: formData,
        }
      );
  
      // First, check if the response was ok (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Then check the content type to make sure it's "application/json"
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const responseData = await response.json();
      console.log("Transcription Response:", responseData);
  
      // Check for responseData.text instead of responseData.transcription
      if (responseData && responseData.text) {
        setTranscribedText(responseData.text); // Set the actual text returned from the API
      } else {
        setTranscribedText("No transcription returned from Whisper service");
        console.log("No text field in response:", responseData);
      }
    } catch (error) {
      console.error("Whisper API Error: ", error);
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


  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Use the recordingOptions defined above
        const { recording } = await Audio.Recording.createAsync(recordingOptions);
        setRecording(recording);
        setIsRecording(true);
        console.log("Started recording");
      } else {
        console.log("Permission to record audio was denied");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const recordingUri = recording.getURI();
      console.log("Recording stopped and stored at", recordingUri);
      setIsRecording(false);
      setRecording(null);

      // Upload the recording and fetch the transcription
      uploadRecording(recordingUri);
    } catch (error) {
      console.error("Could not stop recording", error);
    }
  };

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
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  headerButton: {
    fontSize: 18,
    color: "#007AFF",
  },
  formGroup: {
    padding: 16,
    backgroundColor: "#f7f7f7",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  sectionTitle1: {
    marginBottom: 8,
    fontWeight: "bold",
    marginTop: 35,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 10,
  },
  speakerIcon: {
    width: 50,
    height: 50,
    alignSelf: "center",
    marginVertical: 16,
  },
  transcribedTextContainer: {
    backgroundColor: "#fff",
    padding: 16,
    shadowOffset: { width: 3, height: 3 },
    borderRadius: 10,
    shadowColor: "#000",
    minHeight: 200,
    shadowOpacity: 1.0,
    shadowRadius: 5.41,
    elevation: 4,
  },
  transcribedText: {
    // Style for the transcribed text
  },
});

export default PatientFormScreen;
