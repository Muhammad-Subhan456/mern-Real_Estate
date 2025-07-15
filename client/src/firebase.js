// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c4a94.firebaseapp.com",
  projectId: "mern-estate-c4a94",
  storageBucket: "mern-estate-c4a94.firebasestorage.app",
  messagingSenderId: "838083027030",
  appId: "1:838083027030:web:bbd4e0e30ce5d06572dbf7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);