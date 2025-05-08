import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

window.onload = async function () {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    document.getElementById("username").innerText = userData.username;
    document.getElementById("email").innerText = userData.email;
    document.getElementById("coins").innerText = userData.coins;
  } else {
    alert("User data not found!");
    document.getElementById("username").innerText = "Unknown";
    document.getElementById("email").innerText = "Unknown";
    document.getElementById("coins").innerText = "0";
  }
};

