// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV0LWqglYdE6k48YgdYzEml1a7F_25cgw",
  authDomain: "bloggingapp-6ddc4.firebaseapp.com",
  projectId: "bloggingapp-6ddc4",
  storageBucket: "bloggingapp-6ddc4.firebasestorage.app",
  messagingSenderId: "950331230976",
  appId: "1:950331230976:web:fc28940707698ade42c1e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth (app)
export const db = getFirestore(app);
