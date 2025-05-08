// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase Config (your project)
const firebaseConfig = {
  apiKey: "AIzaSyD1G4rIda3S_e7R3q0ecJ1IFmPWoobtjd4",
  authDomain: "quizworldweb.firebaseapp.com",
  projectId: "quizworldweb",
  storageBucket: "quizworldweb.appspot.com",
  messagingSenderId: "503765027034",
  appId: "1:503765027034:web:eac68bbbfdc31650dd3de3"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Your Quiz Logic ---
let questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Hyderabad", "Chennai"],
    correct_answer: "Delhi"
  },
  {
    question: "Which is the largest ocean?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correct_answer: "Pacific"
  }
  // Add more questions if needed
];

let currentQuestionIndex = 0;
let score = 0;

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    alert("Quiz Finished! 🎉 Your Score: " + score);
    saveScoreToFirestore(score); // ✅ Save to leaderboard
    return;
  }

  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(option => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="answer" value="${option}"> ${option}
    `;
    optionsDiv.appendChild(label);
    optionsDiv.appendChild(document.createElement("br"));
  });
}

// ✅ When Next button clicked
document.getElementById("nextBtn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert("Please choose an answer!");
    return;
  }

  const isCorrect = selected.value === questions[currentQuestionIndex].correct_answer;
  if (isCorrect) {
    selected.parentElement.classList.add("correct");
    score++;
  } else {
    selected.parentElement.classList.add("wrong");
  }

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1000);
});

// ✅ Save Score to Firestore Leaderboard
async function saveScoreToFirestore(score) {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    alert("Not logged in");
    return;
  }

  try {
    const profileRef = doc(db, "profiles", uid);
    const profileSnap = await getDoc(profileRef);
    const username = profileSnap.exists() ? profileSnap.data().username : "Anonymous";

    const leaderboardRef = doc(db, "leaderboard", uid); // unique entry per user
    await setDoc(leaderboardRef, {
      username,
      score,
      timestamp: Date.now()
    });

    console.log("✅ Score saved to leaderboard");
  } catch (error) {
    console.error("❌ Error saving score:", error);
  }
}

// 👇 Start quiz
showQuestion();
