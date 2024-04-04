import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    initializeAuth, 
    getReactNativePersistence 
  } from 'firebase/auth';
  import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDntR8yzcQ1Sq1T-Oy76e4E8L2XxlOs52c",
  authDomain: "medicare-e4404.firebaseapp.com",
  projectId: "medicare-e4404",
  storageBucket: "medicare-e4404.appspot.com",
  messagingSenderId: "927980491005",
  appId: "1:927980491005:android:39064e68d2cc4ca339ae94"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
export { auth };