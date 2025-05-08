import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// ✅ Replace this with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const coinBalance = document.getElementById("coinBalance");
const redeemAmazon = document.getElementById("redeemAmazon");
const redeemFlipkart = document.getElementById("redeemFlipkart");
const historyList = document.getElementById("historyList");

let userCoins = 0;
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await loadUserCoins();
    setupButtons();
    await loadWithdrawHistory();
  } else {
    coinBalance.textContent = "Please log in.";
    redeemAmazon.disabled = true;
    redeemFlipkart.disabled = true;
  }
});

async function loadUserCoins() {
  const userDoc = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userDoc);
  if (snap.exists()) {
    userCoins = snap.data().coins || 0;
    coinBalance.textContent = `You have ${userCoins} coins.`;
  } else {
    coinBalance.textContent = "No user data found.";
  }
}

function setupButtons() {
  redeemAmazon.onclick = () => redeemGift("Amazon");
  redeemFlipkart.onclick = () => redeemGift("Flipkart");
}

async function redeemGift(type) {
  if (userCoins < 1000) {
    alert("Not enough coins.");
    return;
  }

  // Update coins
  await updateDoc(doc(db, "users", currentUser.uid), {
    coins: userCoins - 1000
  });

  // Add to withdrawal history
  await addDoc(collection(db, "withdrawals"), {
    uid: currentUser.uid,
    type: type,
    date: new Date().toISOString()
  });

  alert(`Successfully redeemed ₹10 ${type} Gift Card.`);
  await loadUserCoins();
  await loadWithdrawHistory();
}

async function loadWithdrawHistory() {
  historyList.innerHTML = "";
  const q = query(collection(db, "withdrawals"), where("uid", "==", currentUser.uid));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.type} - ${new Date(data.date).toLocaleString()}`;
    historyList.appendChild(li);
  });
}
