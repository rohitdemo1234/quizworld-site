import { db } from "./firebase.js";
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// Load only first 10 questions from Firebase
async function loadQuestions() {
  const querySnapshot = await getDocs(collection(db, "quizzes"));
  querySnapshot.forEach((doc) => {
    if (questions.length < 10) {
      questions.push(doc.data());
    }
  });
  showQuestion();
}

function showQuestion() {
  const questionBox = document.getElementById("questionBox");
  const question = questions[currentQuestionIndex];

  let optionsHtml = question.choices.map(choice => `
    <label>
      <input type="radio" name="answer" value="${choice}"> ${choice}
    </label>
  `).join('');

  questionBox.innerHTML = `
    <p><strong>Q${currentQuestionIndex + 1}:</strong> ${question.question}</p>
    ${optionsHtml}
  `;

  document.getElementById("nextBtn").style.display = currentQuestionIndex < questions.length - 1 ? "inline" : "none";
  document.getElementById("submitBtn").style.display = currentQuestionIndex === questions.length - 1 ? "inline" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextBtn").addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert("Please choose an answer!");
      return;
    }

    if (selected.value === questions[currentQuestionIndex].correct_answer) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }

    currentQuestionIndex++;
    showQuestion();
  });

  document.getElementById("submitBtn").addEventListener("click", async () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
      if (selected.value === questions[currentQuestionIndex].correct_answer) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    }

    const score = correctAnswers;
    const coins = (correctAnswers * 10) - (wrongAnswers * 5);

    document.getElementById("questionBox").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("score-container").style.display = "block";
    document.getElementById("score-text").innerText = `Correct: ${correctAnswers}, Wrong: ${wrongAnswers}, Coins Earned: ${coins}`;

    const username = localStorage.getItem("username");
    const uid = localStorage.getItem("uid");

    await saveScoreToFirebase(username, score);
    await updateWalletCoins(uid, coins);
  });

  loadQuestions();
});

async function saveScoreToFirebase(username, score) {
  try {
    await addDoc(collection(db, "leaderboard"), {
      username: username,
      score: score
    });
    console.log("Score saved successfully!");
  } catch (e) {
    console.error("Error saving score:", e);
  }
}

async function updateWalletCoins(uid, earnedCoins) {
  const walletRef = doc(db, "wallets", uid);
  const walletSnap = await getDoc(walletRef);

  if (walletSnap.exists()) {
    const currentCoins = walletSnap.data().coins || 0;
    await setDoc(walletRef, {
      coins: currentCoins + earnedCoins
    });
  } else {
    await setDoc(walletRef, {
      coins: earnedCoins
    });
  }
}
