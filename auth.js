import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase config (replace with your project config)
const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create Profile
async function createUserProfile(uid, username, email) {
  const profileRef = doc(db, "profiles", uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      username: username,
      email: email,
    });
  }
}

// Create Wallet
async function createWallet(uid) {
  const walletRef = doc(db, "wallets", uid);
  const walletSnap = await getDoc(walletRef);

  if (!walletSnap.exists()) {
    await setDoc(walletRef, {
      coins: 10,
    });
  }
}

// Sign Up
export async function signUp(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserProfile(user.uid, username, email);
    await createWallet(user.uid);
  } catch (error) {
    console.error("Signup Error:", error.message);
  }
}

// Login
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserProfile(user.uid, "defaultUsername", user.email);
    await createWallet(user.uid);
  } catch (error) {
    console.error("Login Error:", error.message);
  }
}
