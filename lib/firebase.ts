import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsM7Xzrn5KCDZbiGxzhelg6gkClMAzCAk",
  authDomain: "volunteer-coordination-ce21a.firebaseapp.com",
  projectId: "volunteer-coordination-ce21a",
  storageBucket: "volunteer-coordination-ce21a.firebasestorage.app",
  messagingSenderId: "689797703465",
  appId: "1:689797703465:web:6860d02ae1b9853a63b938",
};

// Initialize Firebase (keep as singleton to avoid reinitializing on hot reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
