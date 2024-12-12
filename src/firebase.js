// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqcAh2az92JA1ZieAfd6MusZ-OknEKhoI",
    authDomain: "edusphere-f784d.firebaseapp.com",
    projectId: "edusphere-f784d",
    storageBucket: "edusphere-f784d.firebasestorage.app",
    messagingSenderId: "356634644028",
    appId: "1:356634644028:web:0dd240fa6d423486ee3d39",
    measurementId: "G-9FZVDZS4M4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };