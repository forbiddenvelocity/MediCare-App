import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence,
  onAuthStateChanged 
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDntR8yzcQ1Sq1T-Oy76e4E8L2XxlOs52c",
  authDomain: "medicare-e4404.firebaseapp.com",
  projectId: "medicare-e4404",
  storageBucket: "medicare-e4404.appspot.com",
  messagingSenderId: "927980491005",
  appId: "1:927980491005:android:39064e68d2cc4ca339ae94"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Firebase Authentication
let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(app);
}

export { auth };
