import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "rohitroman890@gmail.com") {
    alert("Not authorized");
    return;
  }

  const requestsRef = ref(db, 'withdrawRequests');

  onValue(requestsRef, (snapshot) => {
    const table = document.getElementById("requestsTable");
    table.innerHTML = "";

    snapshot.forEach(child => {
      const data = child.val();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.userId}</td>
        <td>${data.platform}</td>
        <td>₹10</td>
        <td>${data.status}</td>
        <td>
          ${data.status === "pending" ? `
            <button class="approve" onclick="handleAction('${child.key}', 'approved')">Approve</button>
            <button class="reject" onclick="handleAction('${child.key}', 'rejected')">Reject</button>
          ` : data.status}
        </td>
      `;
      table.appendChild(row);
    });
  });
});

// Expose handler to window for inline onclick
window.handleAction = (id, status) => {
  const reqRef = ref(db, 'withdrawRequests/' + id);
  if (status === "approved") {
    const giftCode = prompt("Enter the gift code:");
    if (!giftCode) return alert("Gift code is required.");
    update(reqRef, { status, giftCode }).then(() => {
      alert("Request approved with gift code.");
    });
  } else {
    update(reqRef, { status }).then(() => {
      alert(`Request ${status}`);
    });
  }
  
  };
;
