// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDqcAh2az92JA1ZieAfd6MusZ-OknEKhoI",
    authDomain: "the",
    projectId: "edusphere-f784d",
    storageBucket: "edusphere-f784d.firebasestorage.app",
    messagingSenderId: "356634644028",
    appId: "1:356634644028:web:0dd240fa6d423486ee3d39",
    measurementId: "G-9FZVDZS4M4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };