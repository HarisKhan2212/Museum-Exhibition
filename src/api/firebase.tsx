import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0DbX6HC1_q10yuvekzPynDPm7FejrI0M",
  authDomain: "museum-exhibition-haris.firebaseapp.com",
  projectId: "museum-exhibition-haris",
  storageBucket: "museum-exhibition-haris.appspot.com",
  messagingSenderId: "956677798859",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
