// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf5Ztz8XP1elYcndY_4HP8ejlWoS1zfvM",
  authDomain: "image-blog-8c5d1.firebaseapp.com",
  projectId: "image-blog-8c5d1",
  storageBucket: "image-blog-8c5d1.appspot.com",
  messagingSenderId: "903372790590",
  appId: "1:903372790590:web:e919f8316ed321b1b9ea6f",
  measurementId: "G-NBLKR6KJQK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
