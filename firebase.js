// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPFKL5Uijyp9qytyjPN9r0bElku9_1xF4",
  authDomain: "travelmate-nextjs.firebaseapp.com",
  projectId: "travelmate-nextjs",
  storageBucket: "travelmate-nextjs.appspot.com",
  messagingSenderId: "770482697510",
  appId: "1:770482697510:web:42cfcab853f464c998fde7",
  measurementId: "G-Z5GEHECENE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
