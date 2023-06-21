import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP7r8a-u6tZFZNKhIFY7lYyF2k31GrWNo",
  authDomain: "std-80b19.firebaseapp.com",
  projectId: "std-80b19",
  storageBucket: "std-80b19.appspot.com",
  messagingSenderId: "43483549333",
  appId: "1:43483549333:web:ae8ccbe621e1be4420d59c",
  measurementId: "G-XEQ2SGBEZV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();//for google signin
export const storage = getStorage(app);

