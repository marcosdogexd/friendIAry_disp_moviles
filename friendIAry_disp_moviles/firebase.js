//import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";

//const firebaseConfig = {
//  apiKey: "AIzaSyBipEUdjIH6xZ6UUFh6COKKdhOGsPgawyQ",
//  authDomain: "app-diario-be563.firebaseapp.com",
//  projectId: "app-diario-be563",
//  storageBucket: "app-diario-be563.firebasestorage.app",
//  messagingSenderId: "811353985273",
// appId: "1:811353985273:android:5365ac2f42c10b2e875228",
//};

//const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);

//export { auth };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID 
} from "@env"; // Importa variables del .env

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };