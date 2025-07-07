// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH4GyEWE_yKhihmzZwmN2HvMs1UbiOrRo",
  authDomain: "libris-a943c.firebaseapp.com",
  projectId: "libris-a943c",
  storageBucket: "libris-a943c.firebasestorage.app",
  messagingSenderId: "190166557559",
  appId: "1:190166557559:web:1cbfdbd832b8cb49a97772",
  measurementId: "G-2RXHQRPGBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default getFirestore()