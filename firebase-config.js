// firebase-config.js — Firebase initialization (Modular SDK v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOWt5QY9HCpQQ4gdY51C5w7J_w-lGsnkM",
  authDomain: "nct-aluminis.firebaseapp.com",
  projectId: "nct-aluminis",
  storageBucket: "nct-aluminis.firebasestorage.app",
  messagingSenderId: "390888490258",
  appId: "1:390888490258:web:6eb9466d4d8b4de4b19fcb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
