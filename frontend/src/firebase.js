// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc1kReSnrwnPgJNWs89d-cDyecLjn0B4k",
  authDomain: "dawe-flora.firebaseapp.com",
  projectId: "dawe-flora",
  storageBucket: "dawe-flora.firebasestorage.app",
  messagingSenderId: "730940214174",
  appId: "1:730940214174:web:80415db2335e1dc328248f",
  measurementId: "G-Z3KVVPSXEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);