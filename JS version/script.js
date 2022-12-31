// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkfx7tOKW1B2IJN9krdOslmBlNv2zTBik",
    authDomain: "myfirebase-1c228.firebaseapp.com",
    projectId: "myfirebase-1c228",
    storageBucket: "myfirebase-1c228.appspot.com",
    messagingSenderId: "726224051297",
    appId: "1:726224051297:web:452f3de3a561675d541e20",
    measurementId: "G-MN264B1PNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);