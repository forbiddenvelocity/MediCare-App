import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Alert,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { firestore } from "../../firebaseConfig.js";
import Voice from "@react-native-voice/voice";
const PatientFormScreen = () => {
  const navigation = useNavigation();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isPatientFlagged, setIsPatientFlagged] = useState(false);
  const [patientAadharId, setPatientAadharId] = useState("");

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [transcribedText, setTranscribedText] = useState("");

  const [ocrText, setOcrText] = useState("");
  const [image, setImage] = useState(null);

  const db = getFirestore(app);

  const toggleFlagSwitch = () => {
    setIsPatientFlagged((previousState) => !previousState);
  };

  const recordingOptions = {
    // Check if the following format is compatible with your API and devices
    android: {
      extension: ".wav",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
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

    const permissionResult = await (pickFromCamera
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

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
      setImage(pickerResult?.assets[0].uri);
      sendToNewOCRAPI(pickerResult?.assets[0].uri);
    }
  };

  const handleCameraOpen = () => {
    handleImagePicking(true);
  };

  const handleGalleryOpen = () => {
    handleImagePicking(false);
  };

  const sendToNewOCRAPI = async (imageUri) => {
    try {
      if (!imageUri) {
        throw new Error("Image URI is empty or undefined");
      }

      console.log("Image URI:", imageUri);

      const formData = new FormData();

      formData.append("image", {
        uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
        type: "image/png",
        name: "image.png",
      });

      const base64String = await getBase64FromUri(imageUri);
      formData.append("base64", base64String);

      const response = await fetch(
        "https://ocr-extract-text.p.rapidapi.com/ocr",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "x-rapidapi-host": "ocr-extract-text.p.rapidapi.com",
            "x-rapidapi-key":
              "e92edab7ecmsh10154b4bee4b96cp1d7ca5jsn30f647611c4c",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("OCR Response:", responseData);

      if (responseData && responseData.text) {
        setOcrText(responseData.text);
      } else {
        setOcrText("No text returned from OCR service");
      }
    } catch (error) {
      console.error("New OCR API Error: ", error);
      setOcrText("Error processing image");
    }
  };

  const getBase64FromUri = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result.split(",")[1]);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function () {
        reject("Failed to convert image to Base64");
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
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
            "X-RapidAPI-Key":
              "e92edab7ecmsh10154b4bee4b96cp1d7ca5jsn30f647611c4c",
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

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Use the recordingOptions defined above
        const { recording } = await Audio.Recording.createAsync(
          recordingOptions
        );
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
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState("");
  const [lastResult, setLastResult] = useState("");
  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  const startSpeechToText = async () => {
    try {
      await Voice.start("en-US");
      setStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopSpeechToText = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSpeechResults = (result) => {
    const newResult = result.value.join(" ");

    if (newResult.length > 0 && newResult !== lastResult) {
      setResults(newResult);
      setLastResult(newResult);
    }
  };

  const onSpeechError = (error) => {
    console.log("Speech error:", error);
  };

  const handleSave = useCallback(async () => {
    try {
      const auth = getAuth(app);
      if (auth.currentUser) {
        console.log(
          "Document written with ID: ",

          results,
          ocrText
        );

        const docRef = await addDoc(collection(db, "patients"), {
          name: patientName,
          age,
          gender,
          address,
          contactInfo,
          diagnosis,
          prescription,
          speechText: results,
          ocrText: ocrText,
          patientAadharId,
          userId: auth.currentUser.uid,
          flagged: isPatientFlagged,
        });

        console.log("Document written with ID: ", docRef.id, results, ocrText);
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
    results,
    ocrText,
    image,
    isPatientFlagged,
    patientAadharId,
  ]);
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
          onChangeText={(val) => setPatientName(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={(val) => setAge(val)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={(val) => setGender(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Patient Aadhar ID"
          value={patientAadharId}
          onChangeText={(val) => setPatientAadharId(val)} // Update state
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={(val) => setAddress(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Information"
          value={contactInfo}
          onChangeText={(val) => setContactInfo(val)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>New Diagnosis</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={diagnosis}
          onChangeText={(val) => setDiagnosis(val)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>New Prescription</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={prescription}
          onChangeText={(val) => setPrescription(val)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.sectionTitle}>Flag Patient as Not Fit for Driving</Text>
        <Switch
          onValueChange={toggleFlagSwitch}
          value={isPatientFlagged} // The flag status will be updated via the switch
        />
        <Text>{isPatientFlagged ? "Flagged as Not Fit for Driving" : "Fit for Driving"}</Text>
      </View>

      <View style={styles.medicareAi}>
        <Text style={styles.bottomheaderTitle}>MediCare Ai</Text>
        <Text style={styles.sectionTitle}>Text to Speech</Text>
        <TouchableOpacity
          onPress={started ? stopSpeechToText : startSpeechToText}
        >
          <Image
            style={styles.speakerIcon}
            source={{
              uri: "https://iconape.com/wp-content/files/gx/368000/svg/mic-logo-icon-png-svg.png",
            }}
          />
        </TouchableOpacity>
        <View style={styles.transcribedTextContainer}>
          <Text style={styles.transcribedText}>{results}</Text>
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
  button: {
    backgroundColor: "#f57c00",
    width: "80%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
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
