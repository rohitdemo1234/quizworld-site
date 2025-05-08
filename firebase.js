// Import required Firebase modules (v9 style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services
export { db, auth };
