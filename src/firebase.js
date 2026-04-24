import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNFNBQ-fWA0x1asaBTGVXovqUyrRojR4Y",
  authDomain: "recharge-b32e2.firebaseapp.com",
  projectId: "recharge-b32e2",
  storageBucket: "recharge-b32e2.firebasestorage.app",
  messagingSenderId: "704969215335",
  appId: "1:704969215335:web:855f78a7af7a0d7fc473c2",
  measurementId: "G-G9NFV3ES1V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Database export karein