// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔥 Replace with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyAbHHE91jiD5LqHCziR1snGxVZj9PmW9VE",
    authDomain: "omegle-6fe3b.firebaseapp.com",
    projectId: "omegle-6fe3b",
    storageBucket: "omegle-6fe3b.firebasestorage.app",
    messagingSenderId: "990407188357",
    appId: "1:990407188357:web:438f26f375684ee3b32eec",
    measurementId: "G-8K66TLXQMH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
