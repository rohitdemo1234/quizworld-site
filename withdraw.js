import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, get, update, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const walletRef = ref(db, 'wallets/' + uid);

    get(walletRef).then((snapshot) => {
      if (snapshot.exists()) {
        let currentCoins = snapshot.val().balance || 0;
        document.getElementById('wallet-balance').textContent = currentCoins;

        const updateBalance = (amount, platform) => {
          if (currentCoins >= amount) {
            update(walletRef, { balance: currentCoins - amount }).then(() => {
              currentCoins -= amount;
              document.getElementById('wallet-balance').textContent = currentCoins;

              const requestRef = push(ref(db, 'withdrawRequests'));
              set(requestRef, {
                userId: uid,
                platform: platform,
                status: "pending"
              });

              alert(`₹10 ${platform} Gift Card Redeemed! Awaiting Admin Approval.`);
            });
          } else {
            alert(`You need at least ${amount} coins to redeem a ₹10 ${platform} card.`);
          }
        };

        document.getElementById('redeemAmazon').addEventListener('click', () => {
          updateBalance(1000, "Amazon");
        });

        document.getElementById('redeemFlipkart').addEventListener('click', () => {
          updateBalance(1000, "Flipkart");
        });

        // --- Withdrawal History Display Code ---
        const historyRef = ref(db, 'withdrawRequests');

        get(historyRef).then(snapshot => {
          const historyList = document.getElementById("historyList");
historyList.innerHTML = '';

snapshot.forEach(child => {
  const data = child.val();

  if (data.userId === uid) {
    const card = document.createElement("div");
    card.style.cssText = `
      border-radius: 10px;
      padding: 15px;
      width: 250px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      background-color: ${data.status === 'approved' ? '#d4edda' : data.status === 'rejected' ? '#f8d7da' : '#fff3cd'};
      color: #333;
      font-family: sans-serif;
    `;

    card.innerHTML = `
      <h3 style="margin-top:0;">${data.platform}</h3>
      <p>Status: <strong>${data.status}</strong></p>
      ${data.status === 'approved' && data.giftCode ? `<p style="word-break: break-all;"><strong>Gift Code:</strong> ${data.giftCode}</p>` : ''}
    `;

    historyList.appendChild(card);
  }
});

        });

      } else {
        alert("Wallet not found.");
      }
    });
  } else {
    window.location.href = "index.html";
  }
});
