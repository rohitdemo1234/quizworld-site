const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read quizzes from JSON file
const quizzes = JSON.parse(fs.readFileSync('quizzes.json', 'utf8'));

// Import each quiz into Firestore
quizzes.forEach(async (quiz) => {
  try {
    await db.collection('quizzes').add(quiz);
    console.log(`Imported quiz: ${quiz.question}`);
  } catch (error) {
    console.error('Error importing quiz:', error);
  }
});
