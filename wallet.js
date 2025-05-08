import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const uid = localStorage.getItem("uid");
  const coinBalance = document.getElementById("coinBalance");

  if (!uid) {
    coinBalance.innerText = "User not logged in!";
    return;
  }

  const walletRef = doc(db, "wallets", uid);
  const walletSnap = await getDoc(walletRef);

  if (walletSnap.exists()) {
    coinBalance.innerText = walletSnap.data().coins || 0;
  } else {
    coinBalance.innerText = "0";
  }
});
