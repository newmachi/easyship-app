// @ts-nocheck
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAxnKDJAVAlt4fXGpNMDgDw2z8GUDmJzM",
  authDomain: "easyship-ng.firebaseapp.com",
  projectId: "easyship-ng",
  storageBucket: "easyship-ng.firebasestorage.app",
  messagingSenderId: "598999285681",
  appId: "1:598999285681:web:d914db08f6119816110790"
};

const fbApp = initializeApp(firebaseConfig);
export const auth = getAuth(fbApp);
export const db = getFirestore(fbApp);
