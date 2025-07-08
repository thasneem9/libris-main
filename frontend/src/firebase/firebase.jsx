// frontend/src/firebase/index.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCH4GyEWE_yKhihmzZwmN2HvMs1UbiOrRo",
  authDomain: "libris-a943c.firebaseapp.com",
  projectId: "libris-a943c",
  storageBucket: "libris-a943c.firebasestorage.app",
  messagingSenderId: "190166557559",
  appId: "1:190166557559:web:1cbfdbd832b8cb49a97772",
  measurementId: "G-2RXHQRPGBV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: Analytics (only if running in browser and needed)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export { db };
