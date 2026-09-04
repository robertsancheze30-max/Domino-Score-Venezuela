// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnntB6syE5YYibt2KYjGfgvqvNUFYVxO4",
  authDomain: "domino-score-venezuela.firebaseapp.com",
  databaseURL: "https://domino-score-venezuela-default-rtdb.firebaseio.com",
  projectId: "domino-score-venezuela",
  storageBucket: "domino-score-venezuela.firebasestorage.app",
  messagingSenderId: "634170663950",
  appId: "1:634170663950:web:2e933459ee0a309067085f"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
