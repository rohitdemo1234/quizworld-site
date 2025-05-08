import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { app } from "./firebase.js"; // Firebase config import

const auth = getAuth(app);

// User Login Check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User login ledu ante login.html ki redirect
    window.location.href = "login.html";
  }
});

// Login Function
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user.uid);

    // Profile and wallet check
    await createUserProfile(user.uid, "defaultUsername", user.email); 
    await createWallet(user.uid);

    // 👇 Redirect to homepage after login success
    window.location.href = "index.html";

  } catch (error) {
    console.error("Login Error:", error.message);
  }
}
// index.js
export function goTo(page) {
  window.location.href = page;
}

export function logout() {
  localStorage.removeItem("uid");
  alert("Logged out!");
  window.location.href = "login.html";
}
