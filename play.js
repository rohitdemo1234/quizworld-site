import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const db = getFirestore();

function addCoinsToUser(amount) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        coins: increment(amount) // Example: 100 coins
      });
      console.log("Coins added successfully");
    }
  });
}
