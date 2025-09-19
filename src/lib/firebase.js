// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhdoD_6FQ9EiGXUC0YpxiDRh-vrRcS-R8",
    authDomain: "the-uncoders-vercel.firebaseapp.com",
    projectId: "the-uncoders-vercel",
    storageBucket: "the-uncoders-vercel.firebasestorage.app",
    messagingSenderId: "155504288976",
    appId: "1:155504288976:web:04725bd0b4311af0e7ead5",
    measurementId: "G-S7QP96ZMC1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, auth, storage };